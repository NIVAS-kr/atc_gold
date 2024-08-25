import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaCubes, FaSearch } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import SettingsDialog from '../SettingsDialog';
import "./Devicerolecomposition.css";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaExpandAlt } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { IoHelpCircle } from "react-icons/io5";
import { RxHeight } from "react-icons/rx";
import { IoMove } from "react-icons/io5";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Devicerolecomposition = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isOpennetwork, setIsOpennetwork] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [title, setTitle] = useState('Current Device States');
  const [deviceStates, setDeviceStates] = useState({
    up: true,
    down: true,
    maintenance: true,
    unknown: true,
  });

  const dropdownRef = useRef(null);

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
      const newWidth = Math.min(Math.max(startWidth + e.clientX - startX, window.innerWidth * 0.1), window.innerWidth * 0.9);
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
              <IoIosArrowDown className={`arrow-icon ${isOpen ? 'open' : ''}`} /> Device Role Composition
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
          <div className="gauge-container">
            <CircularProgressbar
              value={66}
              text={`${66}%`}
              styles={buildStyles({
                pathColor: `rgba(62, 152, 199, ${66 / 100})`,
                textColor: '#4F5051',
                trailColor: '#d6d6d6',
                backgroundColor: '#4F5051',
              })}
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

export default Devicerolecomposition;
