// campusia-backend/src/models/Admin.js
// Admin model using PostgreSQL Database

const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

// Admin class
class Admin {
  // Find admin by username
  static async findByUsername(username) {
    try {
      const result = await query(
        'SELECT * FROM admin WHERE username = $1',
        [username]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding admin by username:', error);
      throw error;
    }
  }
  
  // Compare password
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
  
  // Update last login
  static async updateLastLogin(username) {
    try {
      const result = await query(
        `UPDATE admin 
         SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
         WHERE username = $1 
         RETURNING *`,
        [username]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }
  
  // Change password
  static async changePassword(username, currentPassword, newPassword) {
    try {
      const admin = await this.findByUsername(username);
      
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
      
      await query(
        `UPDATE admin 
         SET password = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE username = $2`,
        [hashedPassword, username]
      );
      
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
  
  // Initialize admin (if not exists)
  static async initialize(password = 'campusia@12345') {
    try {
      const existing = await this.findByUsername('admin');
      
      if (!existing) {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await query(
          'INSERT INTO admin (username, password) VALUES ($1, $2) RETURNING *',
          ['admin', hashedPassword]
        );
        
        console.log('✅ Admin initialized with default password');
        return result.rows[0];
      }
      
      return existing;
    } catch (error) {
      console.error('Error initializing admin:', error);
      throw error;
    }
  }
}

module.exports = Admin;
