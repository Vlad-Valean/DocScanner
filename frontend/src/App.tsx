import React, { JSX, useEffect, useState } from 'react';
import './App.scss';
import { Route, Routes, Navigate } from 'react-router-dom';

import Nav from './Components/Nav/Nav';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ReviewerDashboard from './Pages/ReviewerDashboard/ReviewerDashboard';
import UploadPage from './Pages/UploadPage/UploadPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';



type Role = 'User' | 'Reviewer' | 'Admin' | null;

type PrivateRouteProps = {
  children: JSX.Element;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  const [role, setRole] = useState<Role>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');
      setIsAuthenticated(!!token);
      setRole(storedRole ? storedRole as Role : 'User');
    };

    checkAuth();

    window.addEventListener('storageChanged', checkAuth);
    return () => window.removeEventListener('storageChanged', checkAuth);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Nav role={role} isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><ReviewerDashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
