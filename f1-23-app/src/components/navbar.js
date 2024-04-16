// Navbar.js
import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 

function Navbar() {
    const { isLoggedIn, logOut } = useContext(AuthContext); 

    return (
        <header className="App-header">
            <h1 className="app-title">F1 23 Stats</h1>
            <nav className="app-nav">
                {!isLoggedIn && <Link to="/signup" className="nav-link">Sign Up</Link>}
                {!isLoggedIn && <Link to="/login" className="nav-link">Login</Link>}
                {isLoggedIn && <NavLink to="/login" onClick={logOut} className="nav-link">Logout</NavLink>}
            </nav>
        </header>
    );
}

export default Navbar;