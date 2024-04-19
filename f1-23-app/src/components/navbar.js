import React, { useContext} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 

function Navbar() {
  const { isLoggedIn, logOut } = useContext(AuthContext); 

  const handleLogOut = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logOut(); 
      localStorage.removeItem('token'); 
      localStorage.removeItem('userId'); 
    }
  };

  return (
    <header className="App-header">
      <h1 className="app-title">F1 23 Stats</h1>
      <nav className="app-nav">
        {!isLoggedIn ? (
          <>
            <Link to="/signup" className="nav-link">Sign Up</Link>
            <Link to="/login" className="nav-link">Login</Link>
          </>
        ) : (
          <button onClick={handleLogOut} className="nav-link">Logout</button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;