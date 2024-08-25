// models/devices.js
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  hostname: { type: String, required: true },
  device: { type: String, required: true },
  status: { type: String, required: true },
  seen: { type: Date, default: Date.now },
  statusHistory: [
    {
      status: { type: String, required: true },
      timestamp: { type: String, required: true }
    }
  ]
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
