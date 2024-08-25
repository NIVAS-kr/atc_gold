// const bcrypt = require('bcryptjs');
// const User = require('../models/user'); // Adjust path as needed

// const initializeAdminUser = async () => {
//   try {
//     const hashedPassword = await bcrypt.hash('admin123', 10);
//     const existingAdmin = await User.findOne({ username: 'admin' });

//     if (!existingAdmin) {
//       await User.create({
//         username: 'admin',
//         email: 'admin@gmail.com',
//         password: hashedPassword,
//       });
//       console.log('Admin user initialized');
//     }
//   } catch (error) {
//     console.error('Error initializing admin user:', error);
//   }
// };

// module.exports = { initializeAdminUser };
