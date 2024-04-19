import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/signup'; 
import Login from './components/login';
import Navbar from './components/navbar'; 
import StatsPage from './components/statsPage.tsx';
import AddStatsPage from './components/addStatsPage.tsx';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function RoutesWithAuth() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/racer-stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} /> 
        <Route path="/racer-stats/add" element={<ProtectedRoute><AddStatsPage /></ProtectedRoute>} /> 
        <Route path="*" element={<Navigate to="/signup" />} />
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