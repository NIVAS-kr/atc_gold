import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { CSVLink } from 'react-csv';
import './Ipaddress.css';
import { FaFileExport } from "react-icons/fa";

const Ipaddress = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/devices');
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeviceClick = (deviceName) => {
    navigate(`/device/${deviceName}`);
  };

  return (
    <div className="ip-address-container">
      <div className="header">
        <h2>IP/MAC Addresses</h2>
        <div className="header-actions">
          <input type="text" className="search-bar" placeholder="Search..." />
          <CSVLink 
            data={data} 
            filename={"ip_addresses.csv"} 
            className="export-button"
          >
            <FaFileExport className="export-icon" />
            <div className="export-tooltip">Export</div> 
          </CSVLink>
        </div>
      </div>
      <table className="address-table">
        <thead>
          <tr>
            <th>Device</th>
            <th>IP Address</th>
            <th>Hostname</th>
            <th>Seen</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} onClick={() => handleDeviceClick(item.device)}>
              <td>
                <div className={`device-status ${item.status === 'up' ? 'online' : 'offline'}`}></div>
                {item.device}
              </td>
              <td>{item.ip}</td>
              <td>{item.hostname}</td>
              <td>{item.seen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ipaddress;
