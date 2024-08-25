import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaCubes, FaSearch } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import SettingsDialog from '../SettingsDialog';
import GaugeChart from 'react-gauge-chart';
import './Networkcoverage.css';
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaExpandAlt } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { IoHelpCircle } from "react-icons/io5";
import { RxHeight } from "react-icons/rx";
import { IoMove } from "react-icons/io5";
import axios from 'axios';

const Networkcoverage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isOpennetwork, setIsOpennetwork] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [title, setTitle] = useState('Current Device States');
  const [deviceStates, setDeviceStates] = useState({
    up: 10,
    down: 5,
    maintenance: 2,
    unknown: 1,
  });

  const dropdownRef = useRef(null);

  const fetchDeviceStates = useCallback(async () => {
    try {
      const response = await axios.get('https://atc-gold-backend.onrender.com/device-states');
      setDeviceStates(response.data);
    } catch (error) {
      console.error('Error fetching device states:', error);
    }
  }, []);

  useEffect(() => {
    fetchDeviceStates();

    // Setup WebSocket for real-time updates
    const socket = new WebSocket('wss://atc-gold-backend.onrender.com');
    
    socket.onmessage = (event) => {
      const updatedDevices = JSON.parse(event.data);

      // Calculate new device states
      const newDeviceStates = {
        up: updatedDevices.filter(device => device.status === 'up').length,
        down: updatedDevices.filter(device => device.status === 'down').length,
        maintenance: updatedDevices.filter(device => device.status === 'maintenance').length,
        unknown: updatedDevices.filter(device => device.status === 'unknown').length,
      };
      setDeviceStates(newDeviceStates);
    };

    return () => {
      socket.close();
    };
  }, [fetchDeviceStates]);

  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  };

  const toggleDropdownnetwork = () => {
    setIsOpennetwork(prevState => !prevState);
  };

  const toggleHamburgerMenu = () => {
    setIsHamburgerOpen(prevState => !prevState);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpennetwork(false);
      setIsHamburgerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseDown = (e) => {
    const container = dropdownRef.current;
    const startX = e.clientX;
    const startWidth = container.offsetWidth;

    const handleMouseMove = (e) => {
      const newWidth = Math.min(Math.max(startWidth + e.clientX - startX, window.innerWidth * 0.08), window.innerWidth * 0.9);
      container.style.width = `${newWidth}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="expandable-box" ref={dropdownRef}>
      <div className="header">
        <div className="current-device">
          <div className="current-device-left" onClick={toggleDropdown}>
            <h5>
              <IoIosArrowDown className={`arrow-icon ${isOpen ? 'open' : ''}`} /> Network Coverage
            </h5>
          </div>
          
          <div className="current-device-right">
            <IoSettingsOutline onClick={() => setIsSettingsOpen(true)} />
            <RxHamburgerMenu onClick={toggleHamburgerMenu} />
            {isHamburgerOpen && (
              <div className="hamburger-dropdown">
                <ul>
                  <li><FiRefreshCcw /> Refresh</li>
                  <li><IoMove /> Move Report</li>
                  <li><RxHeight /> Reset Height</li>
                  <li><FaExpandAlt /> Expand</li>
                  <li><RiDeleteBin5Fill /> Delete</li>
                  <li><IoHelpCircle /> Help</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="header-item">
          <div className="network-section">
            <button className="dropdown-button" onClick={toggleDropdownnetwork}>
              <FaCubes /> My Network 
              <IoMdArrowDropdown className={`arrow-icon ${isOpennetwork ? 'open' : ''}`} />
            </button>
            {isOpennetwork && (
              <div className="dropdown-content">
                <p><FaSearch /> Search</p>
                <a href="#option1">Clear History</a>
                <a href="#option2">My Network</a>
                <a href="#option3">Discovered Device</a>
              </div>
            )}
          </div>
          <div className="gauge-container-network">
            <GaugeChart
              id="gauge-chart4"
              nrOfLevels={30}
              percent={deviceStates.unknown / 100}
              textColor="#000"
            />
          </div>
          <div className="resizer" onMouseDown={handleMouseDown} />
        </div>
      )}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={() => console.log('Settings Saved')}
        title={title}
        setTitle={setTitle}
        deviceStates={deviceStates}
        setDeviceStates={setDeviceStates}
      />
    </div>
  );
}

export default Networkcoverage;
