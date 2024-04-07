import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import './App.css';
import SignUp from './components/signup'; 
import Login from './components/login';
import { AuthContext } from './components/AuthContext'; 


function App() {
  const { isLoggedIn, logOut } = useContext(AuthContext); 

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="app-title">F1 23 Stats</h1>
          <nav className="app-nav">
            {!isLoggedIn && <Link to="/signup" className="nav-link">Sign Up</Link>}
            {!isLoggedIn && <Link to="/login" className="nav-link">Login</Link>}
            {isLoggedIn && <NavLink to="/login" onClick={logOut} className="nav-link">Logout</NavLink>}
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            {/* {isLoggedIn && <Route path="/employees" element={<EmployeeList />} />} 
            {isLoggedIn && <Route path="/add-employee" element={<AddEmployee />} />} 
            {isLoggedIn && <Route path="/update-employee/:id" element={<UpdateEmployee />} />}
            {isLoggedIn && <Route path="/view-employee/:id" element={<ViewEmployee />} />} */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;