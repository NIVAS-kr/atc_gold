// NavbarDevice.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaLightbulb, FaUser } from 'react-icons/fa';
import { IoHelpCircle } from 'react-icons/io5';
import { MdKeyboardArrowDown } from 'react-icons/md';
import './NavbarDevice.css';

const NavbarDevice = ({ onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAnalyzeDropdownOpen, setIsAnalyzeDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleAnalyzeDropdown = () => setIsAnalyzeDropdownOpen(!isAnalyzeDropdownOpen);
  const toggleAdminDropdown = () => setIsAdminDropdownOpen(!isAdminDropdownOpen);

  const goToDashboard = () => navigate('/');
  const goToMyNetwork = () => navigate('/my-network');
  const goToIPMAC = () => navigate('/Ip/mac');
  const goToAddDevicePage = () => navigate('/add-device');
  const goToAddUser = () => navigate('/add-user');
  const goToUsers = () => navigate('/users');

  const handleLogout = () => {
    onLogout(); // Call the passed logout function
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="navbar-item active" onClick={goToDashboard}>ATC Netpulse</div>
        <div className="navbar-item discover" onClick={toggleDropdown}>
          Discover 
          <div className="discover-downlogo"> <MdKeyboardArrowDown /></div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">Discovered Network</div>
              <div className="dropdown-item" onClick={goToAddDevicePage}>Add device</div>
              <div className="dropdown-item">Save Scan Settings</div>
              <div className="dropdown-item">Scan History</div>
            </div>
          )}
        </div>
        <div className="navbar-item" onClick={goToMyNetwork}>My Network</div>
        <div className="navbar-item analyze" onClick={toggleAnalyzeDropdown}>
          Analyze 
          <div className="analyze-downlogo"> <MdKeyboardArrowDown /></div>
          {isAnalyzeDropdownOpen && (
            <div className="dropdown-menu analyze-dropdown-menu">
              <div className="dropdown-item" onClick={goToDashboard}>Dashboard</div>
              <div className="dropdown-item" onClick={goToIPMAC}> IP/MAC Addresses</div>
              <div className="dropdown-item">Alert center log</div>
              <div className="dropdown-item">Reports</div>
            </div>
          )}
        </div>
        <div className="navbar-item">Settings</div>
        <div className="navbar-item">Favourites</div>
      </div>
      <div className="navbar-right">
        <input type="text" placeholder="Search..." className="search-bar" />
        <FaBell className="icon" />
        <FaLightbulb className="icon" />
        <div className="admin-section" onClick={toggleAdminDropdown}>
          <FaUser className="icon" />
          <span>Admin</span>
          <MdKeyboardArrowDown className={`dropdown-arrow ${isAdminDropdownOpen ? 'open' : ''}`} />
          {isAdminDropdownOpen && (
            <div className="dropdown-menu admin-dropdown-menu">
              <div className="dropdown-item" onClick={goToAddUser}>Add User</div>
              <div className="dropdown-item" onClick={goToUsers}>Users</div>
              <div className="dropdown-item" onClick={handleLogout}>Logout</div> {/* Add Logout option */}
            </div>
          )}
        </div>
        <IoHelpCircle className="icon" />
      </div>
    </div>
  );
};

export default NavbarDevice;
