import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import SignUp from './components/signup'; 
import Login from './components/login';
import Navbar from './components/navbar'; 
import StatsPage from './components/statsPage.tsx';
import AddStatsPage from './components/addStatsPage.tsx';
import UpdateStatsPage from './components/updateStatsPage';
import ViewStatsPage from './components/viewStatsPage';
import { AuthContext } from './components/AuthContext';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';


function RoutesWithAuth() {
  const { token } = useContext(AuthContext); 
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) { 
      
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/racer-stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} /> 
        <Route path="/racer-stats/add" element={<ProtectedRoute><AddStatsPage /></ProtectedRoute>} /> 
        <Route path="/racer-stats/:id" element={<ProtectedRoute><UpdateStatsPage /></ProtectedRoute>} /> 
        <Route path="/racer-stats/view/:id" element={<ProtectedRoute><ViewStatsPage /></ProtectedRoute>} /> 
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <RoutesWithAuth />
      </Router>
    </AuthProvider>
  );
}

export default App;