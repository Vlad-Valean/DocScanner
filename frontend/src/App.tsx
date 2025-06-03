import React, { JSX } from 'react';
import './App.scss';
import { Route, Routes, Navigate } from 'react-router-dom';

import Nav from './Components/Nav/Nav';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ReviewerDashboard from './Pages/ReviewerDashboard/ReviewerDashboard';
import UploadPage from './Pages/UploadPage/UploadPage';
import Account from './Pages/Account/Account';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {Paper} from "@mui/material";
import {useAuth} from "./Services/AuthService";


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

  const { isAuthenticated, role, updateAuth } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Nav role={role} isAuthenticated={isAuthenticated} />
        <Paper color="default">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onAuthUpdate={updateAuth}/>} />
            <Route path="/register" element={<Register onAuthUpdate={updateAuth}/>} />
            <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
            <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><ReviewerDashboard /></PrivateRoute>} />
          </Routes>
        </Paper>
      </div>
    </ThemeProvider>
  );
}

export default App;
