// campusia-backend/src/routes/users.js
// User routes (registration and login without password)

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '30d';

/**
 * POST /api/users/register
 * Register new user (email + name only, no password)
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ tên và email'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được đăng ký'
      });
    }

    // Create new user
    const user = await User.create(name, email);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name,
        role: 'user'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      message: 'Đăng ký thành công'
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng ký: ' + error.message
    });
  }
});

/**
 * POST /api/users/login
 * Login existing user (email only, no password)
 */
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email'
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email chưa được đăng ký. Vui lòng đăng ký trước.'
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name,
        role: 'user'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
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
 * GET /api/users/me
 * Get current user info
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const user = await User.findByEmail(req.user.email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
        lastLogin: user.last_login
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi: ' + error.message
    });
  }
});

/**
 * POST /api/users/join-event/:eventId
 * User joins an event
 */
router.post('/join-event/:eventId', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const eventId = parseInt(req.params.eventId);
    const userId = req.user.userId;

    const result = await User.joinEvent(userId, eventId);

    if (result.alreadyJoined) {
      return res.json({
        success: true,
        message: 'Bạn đã tham gia sự kiện này rồi',
        alreadyJoined: true
      });
    }

    res.json({
      success: true,
      message: 'Tham gia sự kiện thành công',
      alreadyJoined: false
    });

  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi: ' + error.message
    });
  }
});

/**
 * GET /api/users/my-events
 * Get user's participated events
 */
router.get('/my-events', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const events = await User.getParticipationHistory(req.user.userId);

    res.json({
      success: true,
      events
    });

  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi: ' + error.message
    });
  }
});

module.exports = router;
