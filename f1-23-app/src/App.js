import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import SignUp from './components/signup'; 
import Login from './components/login';
import Navbar from './components/navbar'; 
import StatsPage from './components/statsPage.tsx';
import AddStatsPage from './components/addStatsPage';
import UpdateStatsPage from './components/updateStatsPage';
import ViewStatsPage from './components/viewStatsPage';
import { AuthContext } from './components/AuthContext';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


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
    <div className="App">
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/racer-stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
        <Route path="/add-stat" element={<ProtectedRoute><AddStatsPage /></ProtectedRoute>} />
        <Route path="/update-stat/:id" element={<ProtectedRoute><UpdateStatsPage /></ProtectedRoute>} />
        <Route path="/view-stat/:id" element={<ProtectedRoute><ViewStatsPage /></ProtectedRoute>} />
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