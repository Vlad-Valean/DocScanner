import React, {JSX} from 'react';
import './App.scss';
import {Route , Routes } from 'react-router-dom';

import Nav from "./Components/Nav/Nav";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ReviewerDashboard from "./Pages/ReviewerDashboard/ReviewerDashboard";
import { Navigate } from "react-router-dom";
import UploadPage from "./Pages/UploadPage/UploadPage";

type PrivateRouteProps = {
  children: JSX.Element;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {

  return (
    <div className="App">
        <Nav role="reviewer" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><ReviewerDashboard /></PrivateRoute>} />
        </Routes>
    </div>
  );
}

export default App;
