import React, { JSX, useState, useEffect } from 'react';
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
import {UserSetting} from "./Services/Types"
import { getUserSettings } from "./Services/UserSettingsService";
import CustomAlert from './Components/CustomAlert/CustomAlert';


type PrivateRouteProps = {
  children: JSX.Element;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/" />;
};


function App() {
  const token = localStorage.getItem("token");

  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  const [userSettings, setUserSettings] = useState<UserSetting>({
    profilePictureUrl: '',
    theme: 'dark',
  });

  const { isAuthenticated, role, updateAuth } = useAuth();

  const [alert, setAlert] = useState<{ message: string; success: boolean } | null>(null);

  const showAlert = (message: string, success: boolean = true) => {
    setAlert({ message, success });

    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    if (!token || !isAuthenticated) {
      setUserSettings({
        profilePictureUrl: '',
        theme: 'dark',
      });
      return;
    }
    getUserSettings(token)
      .then(setUserSettings)
      .catch((err) => showAlert("Failed to load settings: " + err, false));
  }, [token, isAuthenticated]);


  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Nav role={role}
             isAuthenticated={isAuthenticated}
             userSettings={userSettings}
        />
        <Paper color="default">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={
                     <Login onAuthUpdate={updateAuth}
                            showAlert={showAlert}
                     />}
            />
            <Route path="/register" element={
                     <Register onAuthUpdate={updateAuth}
                               showAlert={showAlert}
                     />}
            />
            <Route path="/account" element={
                     <PrivateRoute>
                       <Account token={token}
                                showAlert={showAlert}
                                userSettings={userSettings}
                                setUserSettings={setUserSettings}
                       />
                     </PrivateRoute>}
            />
            <Route path="/upload" element={
                     <PrivateRoute>
                     <UploadPage token={token}
                                 showAlert={showAlert}
                     />
                   </PrivateRoute>}
            />
            <Route path="/dashboard" element={
                     <PrivateRoute>
                       <ReviewerDashboard token={token} />
                     </PrivateRoute>}
            />
          </Routes>

          {alert && (
            <CustomAlert
              open={!!alert}
              onClose={() => setAlert(null)}
              response={alert.success}
              message={alert.message}
            />
          )}
        </Paper>
      </div>
    </ThemeProvider>
  );
}

export default App;
