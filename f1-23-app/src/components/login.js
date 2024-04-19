import React, { useState, useContext, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import { AuthContext } from './AuthContext';
import { jwtDecode } from 'jwt-decode';

function Login() {
    const {isLoggedIn, logIn } = useContext(AuthContext);
    const navigate = useNavigate(); 


    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
      if (!isLoggedIn) {
          setFormData({
              username: '',
              password: ''
          });
      }
  }, [isLoggedIn]);

  const handleChange = (e) => {
      const updatedFormData = { ...formData, [e.target.name]: e.target.value };
      setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/user/login', formData);
      console.log(response.data);
      setErrorMessage(''); 

      const decodedToken = jwtDecode(response.data.token);
      const userId = decodedToken.userId;

      logIn(response.data.token, userId);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', userId);

      navigate('/racer-stats'); 
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response && error.response.data) {
        console.log('Error message:', error.response.data.message); 
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="form-input block w-full p-3 rounded mb-4 border border-gray-300"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="form-input block w-full p-3 rounded mb-4 border border-gray-300"
      />
      <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">Login</button>
  
      {errorMessage && (
        <p className="text-red-500 mt-4 text-center">
          {errorMessage}
          {errorMessage.includes('User not found') && (
            <span> <Link to="/signup" className="text-blue-500 hover:underline">Sign up here</Link>.</span>
          )}
        </p>
      )}
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up here</Link>.
      </p>
    </form>
  );
}


export default Login;