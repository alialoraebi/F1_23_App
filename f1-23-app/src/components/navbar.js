import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function Navbar() {
  const { isLoggedIn, logOut } = useContext(AuthContext);

  const handleLogOut = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logOut();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    }
  };

  return (
    <header>
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="/" class="flex items-center">
                <img src="https://cdn-icons-png.flaticon.com/512/2418/2418779.png" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">F1 23 Stats</span>
            </a>
            <div class="flex items-center lg:order-2">
                {!isLoggedIn ? (
                  <>
                    <Link to="/signup" className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Sign Up</Link>
                    <Link to="/login" className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Login</Link>
                  </>
                  ) : (
                    <button onClick={handleLogOut} className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Logout</button>
                )}
            </div>
        </div>
    </nav>
    </header>
  );
}

export default Navbar;
