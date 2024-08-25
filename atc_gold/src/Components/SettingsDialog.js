import React from 'react';
import { IoClose } from "react-icons/io5";
import "./SettingsDialog.css";

const SettingsDialog = ({ isOpen, onClose, onSave, title, setTitle, deviceStates, setDeviceStates }) => {
  if (!isOpen) return null;

  const handleCheckboxChange = (state) => {
    setDeviceStates((prevStates) => ({
      ...prevStates,
      [state]: !prevStates[state],
    }));
  };

  const handleSave = () => {
    onSave();
    onClose();
  };

  return (
    <div className="settings-dialog-overlay">
      <div className="settings-dialog">
        <div className="settings-dialog-header">
          <h2>Report Settings</h2>
          <IoClose onClick={onClose} className="close-icon" />
        </div>
        <hr />
        <div className="settings-dialog-body">
          <h3>Title</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
          />
          <h3>Device States Setting</h3>
          <div className="checkbox-group">
            {["Up", "Down", "Maintenance", "Unknown"].map((state) => (
              <label key={state}>
                <input
                  type="checkbox"
                  checked={deviceStates[state.toLowerCase()]}
                  onChange={() => handleCheckboxChange(state.toLowerCase())}
                />
                {state}
              </label>
            ))}
          </div>
        </div>
        <hr />
        <div className="settings-dialog-footer">
          <button onClick={handleSave} className="save-button">OK</button>
          <button onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
