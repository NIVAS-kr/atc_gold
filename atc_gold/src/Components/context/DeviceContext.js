// DeviceContext.js
import React, { createContext, useState, useContext } from 'react';

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [deviceStates, setDeviceStates] = useState({
    up: 0,
    down: 0,
    maintenance: 0,
    unknown: 0,
  });

  return (
    <DeviceContext.Provider value={{ deviceStates, setDeviceStates }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
