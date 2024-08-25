// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const ping = require('ping');
// const WebSocket = require('ws');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { check, validationResult } = require('express-validator');
// const User = require('./models/user'); // Mongoose model
// const Device = require('./models/devices'); // Mongoose model
// const { initializeAdminUser } = require('./utils/initializeAdminUser'); // Adjust path as needed

// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000;
// const wsPort = process.env.WS_PORT || 5001;
// const mongoURI = process.env.MONGO_URI || 'your-mongo-uri';

// // WebSocket Server Setup
// const wss = new WebSocket.Server({ port: wsPort });

// // Middleware Setup
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB Connection using mongoose
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   maxPoolSize: 10,
//   serverSelectionTimeoutMS: 60000,
//   socketTimeoutMS: 60000,
// })
//   .then(() => {
//     console.log('Connected to MongoDB Atlas');
//   })
//   .catch(err => {
//     console.error('Error connecting to MongoDB Atlas:', err);
//     process.exit(1);
//   });

// // Broadcast Devices Function
// const broadcastDevices = async () => {
//   try {
//     const devices = await Device.find({});
//     console.log('Broadcasting devices:', devices);
//     wss.clients.forEach(client => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify(devices));
//       }
//     });
//   } catch (error) {
//     console.error('Error broadcasting devices:', error);
//   }
// };

// // Ping Devices Function
// const pingDevices = async () => {
//   try {
//     const devices = await Device.find({});
//     for (let device of devices) {
//       try {
//         const { alive } = await ping.promise.probe(device.ip);
//         const status = alive ? 'up' : 'down';

//         if (device.status !== status) {
//           console.log(`Status changed for ${device.ip}: ${device.status} -> ${status}`);
//           device.statusHistory.push({
//             status,
//             timestamp: new Date().toLocaleString(),
//           });
//           device.status = status;
//           device.seen = new Date().toLocaleString();
//           await device.save();
//         }
//       } catch (err) {
//         console.error(`Error pinging device ${device.ip}:`, err);
//       }
//     }
//     broadcastDevices();
//   } catch (error) {
//     console.error('Error pinging devices:', error);
//   }
// };

// // Ping devices every 10 seconds
// setInterval(pingDevices, 10000);

// // Routes
// app.post('/add-ip', async (req, res) => {
//   const { ipAddress, hostname, device } = req.body;

//   if (!ipAddress || !hostname || !device) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     const { alive } = await ping.promise.probe(ipAddress);
//     const status = alive ? 'up' : 'down';

//     let deviceEntry = await Device.findOne({ ip: ipAddress });
//     if (deviceEntry) {
//       if (deviceEntry.status !== status) {
//         console.log(`Status changed for ${ipAddress}: ${deviceEntry.status} -> ${status}`);
//         deviceEntry.statusHistory.push({
//           status,
//           timestamp: new Date().toLocaleString()
//         });
//         deviceEntry.status = status;
//         deviceEntry.hostname = hostname;
//         deviceEntry.device = device;
//         deviceEntry.seen = new Date().toLocaleString();
//         await deviceEntry.save();
//       }
//     } else {
//       const newDevice = new Device({
//         ip: ipAddress,
//         hostname,
//         device,
//         status,
//         seen: new Date().toLocaleString(),
//         statusHistory: [{ status, timestamp: new Date().toLocaleString() }]
//       });
//       await newDevice.save();
//       console.log(`New device added: ${ipAddress} with status ${status}`);
//     }

//     broadcastDevices();
//     res.status(200).json(await Device.find({}));
//   } catch (error) {
//     console.error('Error checking IP address:', error);
//     res.status(500).json({ error: 'Error checking IP address' });
//   }
// });

// app.get('/devices', async (req, res) => {
//   try {
//     const devices = await Device.find({});
//     res.status(200).json(devices);
//   } catch (error) {
//     console.error('Error fetching devices:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // User Routes
// app.post('/register', [
//   check('username', 'Username is required').not().isEmpty(),
//   check('email', 'Please include a valid email').isEmail(),
//   check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { username, email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     user = new User({
//       username,
//       email,
//       password: await bcrypt.hash(password, 10),
//     });

//     await user.save();

//     const payload = {
//       user: {
//         id: user.id,
//       },
//     };

//     jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
//       if (err) throw err;
//       res.json({ token });
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// app.post('/login', [
//   check('username', 'Please include a valid username').not().isEmpty(),
//   check('password', 'Password is required').exists()
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { username, password } = req.body;

//   try {
//     let user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//       },
//     };

//     jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
//       if (err) throw err;
//       res.json({ token });
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// app.get('/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.delete('/remove-user/:username', async (req, res) => {
//   const { username } = req.params;

//   try {
//     const result = await User.deleteOne({ username });
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json({ message: 'User removed successfully' });
//   } catch (error) {
//     console.error('Error removing user:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Initialize admin user if needed
// const initializeAdmin = async () => {
//   try {
//     await initializeAdminUser();
//     console.log('Admin user initialized');
//   } catch (error) {
//     console.error('Error initializing admin user:', error);
//   }
// };

// // Initialize the admin user and start the server
// initializeAdmin().then(() => {
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// });
