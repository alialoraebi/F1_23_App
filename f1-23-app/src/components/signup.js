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
    <form onSubmit={handleSubmit} className="signup-form">
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="form-input"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
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
      <button type="submit" className="submit-button">Sign Up</button>
  
      {signUpSuccess && (
        <p className="success-message">Sign up successful! Please log in.</p>
      )}
  
      {errorMessage && (
        <p className="error-message">
          {errorMessage}
          {errorMessage.includes('Username already exists') && (
            <span> <Link to="/login" className="login-link">Login here</Link>.</span>
          )}
        </p>
      )}
    </form>
  );
}

export default SignUp;