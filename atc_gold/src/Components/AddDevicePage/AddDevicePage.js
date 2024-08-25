import React, { useState } from "react";
import { FaTimes, FaFileCsv } from "react-icons/fa";
import axios from "axios";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import "./AddDevicePage.css";

const AddDevicePage = ({ onAddDevice }) => {
  const [ipAddress, setIpAddress] = useState("");
  const [hostname, setHostname] = useState("");
  const [device, setDevice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const handleAddIp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('https://atc-gold-backend.onrender.com/add-ip', { ipAddress, hostname, device });
      if (typeof onAddDevice === 'function') {
        onAddDevice(response.data); // Pass updated device list
      }
      setIsLoading(false);
      navigate("/"); // Redirect to DashboardCombined after adding the device
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);

    if (file) {
      Papa.parse(file, {
        complete: async (results) => {
          const devices = results.data;
          try {
            setIsLoading(true);
            await Promise.all(devices.map(device => {
              return axios.post('https://atc-gold-backend.onrender.com/add-ip', {
                ipAddress: device[0],
                hostname: device[1],
                device: device[2]
              });
            }));
            setIsLoading(false);
            navigate("/"); // Redirect after processing CSV
          } catch (error) {
            console.error('Error:', error);
            setError(error.message);
            setIsLoading(false);
          }
        },
        header: false
      });
    }
  };

  return (
    <>
      <div className="page-container">
        <div className="page-navbar">
          <h2 className="page-title">Add Device</h2>
          <FaTimes
            className="page-close-icon"
            onClick={() => navigate("/")} // Redirect to DashboardCombined when close icon is clicked
          />
        </div>
        <div className="page-content">
          {error && <div className="error-message">{error}</div>}
          <h3>Choose your starting device set</h3>
          <p>Single device, multiple devices, IP ranges, or subnets</p>
          
          <div className="file-upload">
            <label htmlFor="csv-upload" className="csv-upload-label">
              <FaFileCsv className="csv-upload-icon" />
              Import CSV
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="Location/IP Location"
            className="page-input"
          />
          <input
            type="text"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
            placeholder="Hostname"
            className="page-input"
          />
          <input
            type="text"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            placeholder="Device"
            className="page-input"
          />
          <button
            className="page-next-button"
            onClick={handleAddIp}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Add"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddDevicePage;
