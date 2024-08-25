import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import NavbarDevice from './Components/Navbardevice/NavbarDevice';
import DashboardCurrent from './Components/DashboardCurrent';
import MyNetworkPage from './Components/connect/MyNetworkPage'; 
import Ipaddress from './Components/Ip/mac/Ipaddress';
import AddDevicePage from './Components/AddDevicePage/AddDevicePage';
import DeviceDetails from './Components/Details/DeviceDetails';
import AddUser from './AddUser/AddUser';
import Users from './Components/Users';
import Login from './Components/Login';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<RouteWithNavbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
};

const RouteWithNavbar = ({ isAuthenticated, handleLogout }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const ProtectedRoute = ({ element: Component, ...rest }) => {
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
  };

  return (
    <>
      {!isLoginPage && isAuthenticated && <NavbarDevice onLogout={handleLogout} />}
      <Routes>
        <Route path="/add-user" element={<ProtectedRoute element={AddUser} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={DashboardCurrent} />} />
        <Route path="/my-network" element={<ProtectedRoute element={MyNetworkPage} />} />
        <Route path="/Ip/mac" element={<ProtectedRoute element={Ipaddress} />} />
        <Route path="/add-device" element={<ProtectedRoute element={AddDevicePage} />} />
        <Route path="/device/:deviceName" element={<ProtectedRoute element={DeviceDetails} />} />
        <Route path="/users" element={<ProtectedRoute element={Users} />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </>
  );
};

export default App;
