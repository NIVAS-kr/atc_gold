require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ping = require('ping');
const WebSocket = require('ws');
const bcrypt = require('bcrypt');
const connectDB = require('./db'); // Import MongoDB connection
const User = require('./models/User'); // Import User model
const Device = require('./models/devices');
const app = express();
const port = process.env.PORT || 5000; // Use environment variable PORT or default to 5000
const wss = new WebSocket.Server({ port: 5001 }); // WebSocket server

app.use(cors());
app.use(bodyParser.json());

connectDB(); // Connect to MongoDB

// Function to initialize admin user
const initializeAdminUser = async () => {
  try {
    // Check if the admin user already exists
    const existingUser = await User.findOne({ username: 'admin' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@gmail.com'
      });
      console.log('Admin user initialized');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

// Array to store devices
let devices = [];

// Broadcast function to notify all WebSocket clients
const broadcastDevices = () => {
  console.log('Broadcasting devices:', devices); // Add this line to log broadcast data
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(devices));
    }
  });
};

// Function to ping all devices and update their status
const pingDevices = async () => {
  try {
    for (let device of devices) {
      const { alive } = await ping.promise.probe(device.ip);
      const status = alive ? 'up' : 'down';

      // Update status if it has changed
      if (device.status !== status) {
        console.log(`Status changed for ${device.ip}: ${device.status} -> ${status}`);
        device.statusHistory.push({
          status,
          timestamp: new Date().toLocaleString(),
        });
        device.status = status;
        device.seen = new Date().toLocaleString();
      }
    }

    broadcastDevices(); // Notify all WebSocket clients of the updated device statuses
  } catch (error) {
    console.error('Error pinging devices:', error);
  }
};

// Call pingDevices every 10 seconds
setInterval(pingDevices, 10000);

// Add new IP address endpoint
app.post('/add-ip', async (req, res) => {
  const { ipAddress, hostname, device } = req.body;

  if (!ipAddress || !hostname || !device) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { alive } = await ping.promise.probe(ipAddress);
    const status = alive ? 'up' : 'down';

    let deviceEntry = await Device.findOne({ ip: ipAddress });

    if (deviceEntry) {
      // Check if the status has changed
      if (deviceEntry.status !== status) {
        console.log(`Status changed for ${ipAddress}: ${deviceEntry.status} -> ${status}`); // Log status change
        // Add status change to history
        deviceEntry.statusHistory.push({
          status,
          timestamp: new Date().toLocaleString()
        });
        deviceEntry.status = status;
        deviceEntry.hostname = hostname;
        deviceEntry.device = device;
        deviceEntry.seen = new Date().toLocaleString();
        await deviceEntry.save(); // Save updated device
      }
    } else {
      deviceEntry = new Device({
        ip: ipAddress,
        hostname,
        device,
        status,
        seen: new Date().toLocaleString(),
        statusHistory: [{ status, timestamp: new Date().toLocaleString() }]
      });
      await deviceEntry.save(); // Save new device
      console.log(`New device added: ${ipAddress} with status ${status}`); // Log new device addition
    }

    // Update devices array for broadcasting
    devices = await Device.find(); // Fetch updated devices from the database
    broadcastDevices(); // Notify all WebSocket clients
    res.status(200).json(devices); // Ensure success response
  } catch (error) {
    console.error('Error checking IP address:', error);
    res.status(500).json({ error: 'Error checking IP address' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get device statuses
app.get('/devices', (req, res) => {
  res.status(200).json(devices); // Ensure success response
});

// Add new user endpoint
app.post('/add-user', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding user' });
  }
});

// Get users endpoint
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Remove user endpoint
app.delete('/remove-user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const result = await User.deleteOne({ username });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing user' });
  }
});
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Initialize the admin user and start the server
const startServer = async () => {
  await initializeAdminUser();
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

startServer();
