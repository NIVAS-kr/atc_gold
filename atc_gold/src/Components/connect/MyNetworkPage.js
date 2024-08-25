import React, { useState, useEffect } from "react";
import { TbDeviceDesktopPause } from "react-icons/tb";
import Draggable from "react-draggable"; // Import Draggable
import axios from "axios";
import "./MyNetworkPage.css";

const MyNetworkPage = () => {
  const [devices, setDevices] = useState([]);
  const [draggable, setDraggable] = useState({});

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/devices');
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices(); // Initial fetch

    const socket = new WebSocket('ws://localhost:5001');
    
    socket.onmessage = (event) => {
      const updatedDevices = JSON.parse(event.data);
      setDevices(updatedDevices);
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleDoubleClick = (index) => {
    setDraggable((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="my-network-page">
      <div>
        <h2>My Networks</h2>
      </div>
      <div className="icon-container">
        {devices.map((device, index) => (
          <Draggable
            key={index}
            disabled={!draggable[index]} // Enable dragging only if the icon is double-clicked
            bounds="parent" // Optional: restricts dragging within parent
          >
            <div
              className={`device-icon-container ${device.status}`}
              style={{ borderColor: device.status === 'up' ? 'green' : 'red' }}
              onDoubleClick={() => handleDoubleClick(index)} // Handle double-click
            >
              <TbDeviceDesktopPause className="device-icon" />
              <p className="device-ip">{device.ip}</p>
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default MyNetworkPage;
