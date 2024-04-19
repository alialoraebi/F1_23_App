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
    <header className="bg-gray-800 text-white py-4">
      <div className="container max-w-full flex justify-between items-center">
        <div className="ml-8">
          <h1 className="text-xl font-bold">F1 23 Stats</h1>
        </div>
        <div className="ml-auto">
          <nav className='mr-8'>
            {!isLoggedIn ? (
              <>
                <Link to="/signup" className="text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">Sign Up</Link>
                <Link to="/login" className="text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">Login</Link>
              </>
            ) : (
              <button onClick={handleLogOut} className="text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">Logout</button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;