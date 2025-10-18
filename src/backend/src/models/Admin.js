// campusia-backend/src/models/Admin.js
// Admin model using JSON file storage (No MongoDB)

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '../../data');
const adminFile = path.join(dataDir, 'admin.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper function to read admin data
function readAdmin() {
  try {
    const data = fs.readFileSync(adminFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Helper function to write admin data
function writeAdmin(adminData) {
  fs.writeFileSync(adminFile, JSON.stringify(adminData, null, 2));
}

// Admin class
class Admin {
  // Find admin by username
  static findByUsername(username) {
    const admin = readAdmin();
    if (admin && admin.username === username) {
      return admin;
    }
    return null;
  }
  
  // Compare password
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
  
  // Update last login
  static updateLastLogin() {
    const admin = readAdmin();
    if (admin) {
      admin.lastLogin = new Date().toISOString();
      admin.updatedAt = new Date().toISOString();
      writeAdmin(admin);
    }
    return admin;
  }
  
  // Change password
  static async changePassword(currentPassword, newPassword) {
    const admin = readAdmin();
    
    if (!admin) {
      throw new Error('Admin not found');
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.updatedAt = new Date().toISOString();
    
    writeAdmin(admin);
    return true;
  }
  
  // Initialize admin (if not exists)
  static async initialize(password = 'campusia@12345') {
    if (!fs.existsSync(adminFile)) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const adminData = {
        username: 'admin',
        password: hashedPassword,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      writeAdmin(adminData);
      console.log('✅ Admin initialized with default password');
      return adminData;
    }
    return readAdmin();
  }
}

module.exports = Admin;
