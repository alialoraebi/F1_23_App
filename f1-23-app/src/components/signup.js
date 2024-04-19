import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const [signUpSuccess, setSignUpSuccess] = useState(false); 
  
  const navigate = useNavigate();

  
  const handleChange = (e) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    console.log(updatedFormData);
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all fields.');
    } else {
      try {
        const response = await axios.post('http://localhost:4000/user/signup', formData);
        console.log(response.data);
        setErrorMessage(''); 
        setSignUpSuccess(true); 
        navigate('/login'); 
      } catch (error) {
        console.error("Error during sign up:", error);
        if (error.response && error.response.data) {
          console.log('Error message:', error.response.data.message); 
          setErrorMessage(error.response.data.message);
        } else if (error.response && error.response.status === 400) {
          setErrorMessage('Invalid email format');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="form-input block w-full p-3 rounded mb-4 border border-gray-300"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
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
      <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">Sign Up</button>
  
      {signUpSuccess && (
        <p className="text-green-500 mt-4 text-center">Sign up successful! Please log in.</p>
      )}
  
      {errorMessage && (
        <p className="text-red-500 mt-4 text-center">
          {errorMessage}
          {errorMessage.includes('Username already exists') && (
            <span> <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>.</span>
          )}
        </p>
      )}
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>.
      </p>
    </form>
  );
}

export default SignUp;