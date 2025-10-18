// campusia-backend/src/routes/auth.js
// Authentication routes (JSON storage)

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { verifyToken } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * POST /api/auth/login
 * Login admin with password
 */
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập mật khẩu'
      });
    }

    // Find admin account
    const admin = Admin.findByUsername('admin');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản admin không tồn tại'
      });
    }

    // Compare password
    const isValidPassword = await Admin.comparePassword(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu không đúng'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: admin.username 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Update last login
    Admin.updateLastLogin();

    res.json({
      success: true,
      token,
      message: 'Đăng nhập thành công'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng nhập: ' + error.message
    });
  }
});

/**
 * GET /api/auth/verify
 * Verify JWT token
 */
router.get('/verify', verifyToken, async (req, res) => {
  try {
    res.json({
      valid: true,
      user: {
        username: req.user.username
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      valid: false,
      message: 'Lỗi xác thực: ' + error.message
    });
  }
});

/**
 * POST /api/auth/change-password
 * Change admin password (requires auth)
 */
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    await Admin.changePassword(currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi đổi mật khẩu'
    });
  }
});

module.exports = router;
