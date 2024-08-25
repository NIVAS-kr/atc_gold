import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DeviceDetails.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DeviceDetails = () => {
  const { deviceName } = useParams();
  const [deviceDetails, setDeviceDetails] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const fetchDeviceDetails = async () => {
      try {
        const response = await fetch(`https://atc-gold-backend.onrender.com/devices`);
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const result = await response.json();
        const details = result.find(device => device.device === deviceName);
        setDeviceDetails(details);
      } catch (error) {
        console.error('Error fetching device details:', error);
      }
    };

    fetchDeviceDetails();

    const socket = new WebSocket('wss://atc-gold-backend.onrender.com');
    socket.onopen = () => console.log('WebSocket connection established');
    socket.onmessage = (event) => {
      const updatedDevices = JSON.parse(event.data);
      const updatedDevice = updatedDevices.find(device => device.device === deviceName);
      setDeviceDetails(updatedDevice);
    };
    setWs(socket);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [deviceName, ws]);

  if (!deviceDetails) {
    return <div>Loading...</div>;
  }

  const statusIcon = deviceDetails.status === 'up' ? (
    <><FaArrowUp style={{ color: 'green' }} /> Up</>
  ) : (
    <><FaArrowDown style={{ color: 'red' }} /> Down</>
  );

  const calculateStatusHistory = () => {
    const statusHistory = [];
    let lastDownTime = null;

    deviceDetails.statusHistory.forEach((entry) => {
      let uptime = 'N/A';
      let downtime = 'N/A';
      let duration = 'N/A';

      if (entry.status === 'down') {
        lastDownTime = new Date(entry.timestamp);
        downtime = new Date(entry.timestamp).toLocaleString();
      } else if (entry.status === 'up' && lastDownTime) {
        const upTime = new Date(entry.timestamp);
        const timeDifference = Math.abs(upTime - lastDownTime);
        const minutes = Math.floor(timeDifference / 60000);
        const seconds = ((timeDifference % 60000) / 1000).toFixed(0);
        duration = `${minutes} minutes ${seconds} seconds`;
        uptime = new Date(entry.timestamp).toLocaleString();
        lastDownTime = null;
      }

      statusHistory.push({
        status: entry.status === 'up' ? 'Up' : 'Down',
        uptime,
        downtime,
        duration
      });
    });

    return statusHistory;
  };

  const statusHistory = calculateStatusHistory();

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Device Status History', 20, 10);

    const tableColumn = ["Status", "Uptime", "Downtime", "Duration"];
    const tableRows = [];

    statusHistory.forEach(entry => {
      const rowData = [
        entry.status,
        entry.uptime,
        entry.downtime,
        entry.duration,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save(`${deviceName}_status_history.pdf`);
  };

  return (
    <div className="device-details-container">
      <h2 className="deviceh2">Device Details</h2>
      <table className="device-details-table">
        <thead>
          <tr>
            <th>Device</th>
            <th>Status</th>
            <th>IP Address</th>
            <th>Log Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{deviceDetails.device}</td>
            <td>{statusIcon}</td>
            <td>{deviceDetails.ip}</td>
            <td>{deviceDetails.seen}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="deviceh3">Status History</h3>
      <button onClick={downloadPDF} className="devicebutton">Download PDF</button>
      <table className="status-history-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Uptime</th>
            <th>Downtime</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {statusHistory.map((entry, index) => (
            <tr key={index}>
              <td>{entry.status === 'Up' ? <FaArrowUp style={{ color: 'green' }} /> : <FaArrowDown style={{ color: 'red' }} />}</td>
              <td>{entry.uptime}</td>
              <td>{entry.downtime}</td>
              <td>{entry.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeviceDetails;
