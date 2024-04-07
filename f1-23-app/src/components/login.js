import React, { useState, useContext} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import { AuthContext } from './AuthContext';


function Login() {
    const { logIn } = useContext(AuthContext);
    const navigate = useNavigate(); 


    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

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
          logIn();
        //   navigate('/employees'); 
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
    <form onSubmit={handleSubmit} className="login-form">
        <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="form-input"
        />
        <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="form-input"
        />
        <button type="submit" className="submit-button">Login</button>
    
        {errorMessage && (
        <p className="error-message">
            {errorMessage}
            {errorMessage.includes('User not found') && (
            <span> <Link to="/" className="signup-link">Sign up here</Link>.</span>
            )}
        </p>
        )}
    </form>
    );
}

export default Login;