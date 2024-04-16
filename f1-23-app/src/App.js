import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import SignUp from './components/signup'; 
import Login from './components/login';
import Navbar from './components/navbar'; 
import StatsPage from './components/statsPage';
import AddStatsPage from './components/addStatsPage';
import UpdateStatsPage from './components/updateStatsPage';
import ViewStatsPage from './components/viewStatsPage';
import { AuthContext } from './components/AuthContext';
import { useContext } from 'react';

function RoutesWithAuth() {
  const { token } = useContext(AuthContext); 
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <main className="app-main">
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/racer-stats" element={<StatsPage />} />
        <Route path="/add-stat" element={<AddStatsPage />} />
        <Route path="/update-stat/:id" element={<UpdateStatsPage />} />
        <Route path="/view-stat/:id" element={<ViewStatsPage />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <RoutesWithAuth />
      </div>
    </Router>
  );
}

export default App;