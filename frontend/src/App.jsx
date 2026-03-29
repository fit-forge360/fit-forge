import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workout   from './pages/Workout';
import Nutrition from './pages/Nutrition';
import Progress  from './pages/Progress';
import Chat      from './pages/Chat';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/"          element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/workout"   element={<PrivateRoute><Workout   /></PrivateRoute>} />
        <Route path="/nutrition" element={<PrivateRoute><Nutrition /></PrivateRoute>} />
        <Route path="/progress"  element={<PrivateRoute><Progress  /></PrivateRoute>} />
        <Route path="/chat"      element={<PrivateRoute><Chat      /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
