// campusia-backend/src/models/User.js
// User model using PostgreSQL Database

const { query } = require('../config/db');

// User class
class User {
  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
  
  // Create new user
  static async create(name, email) {
    try {
      const result = await query(
        `INSERT INTO users (name, email, created_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP) 
         RETURNING *`,
        [name, email]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  // Update last login
  static async updateLastLogin(userId) {
    try {
      const result = await query(
        `UPDATE users 
         SET last_login = CURRENT_TIMESTAMP 
         WHERE id = $1 
         RETURNING *`,
        [userId]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }
  
  // Get all users with participation stats
  static async getAllWithStats() {
    try {
      const result = await query(
        `SELECT 
          u.id,
          u.name,
          u.email,
          u.created_at,
          u.last_login,
          COUNT(DISTINCT uep.event_id) as events_count
         FROM users u
         LEFT JOIN user_event_participation uep ON u.id = uep.user_id
         GROUP BY u.id, u.name, u.email, u.created_at, u.last_login
         ORDER BY u.created_at DESC`
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting all users with stats:', error);
      throw error;
    }
  }
  
  // Get user participation history
  static async getParticipationHistory(userId) {
    try {
      const result = await query(
        `SELECT 
          e.id,
          e.title,
          e.date,
          e.event_type,
          uep.joined_at
         FROM user_event_participation uep
         JOIN events e ON uep.event_id = e.id
         WHERE uep.user_id = $1
         ORDER BY uep.joined_at DESC`,
        [userId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting participation history:', error);
      throw error;
    }
  }
  
  // Add user to event
  static async joinEvent(userId, eventId) {
    try {
      // Check if already joined
      const existing = await query(
        'SELECT * FROM user_event_participation WHERE user_id = $1 AND event_id = $2',
        [userId, eventId]
      );
      
      if (existing.rows.length > 0) {
        return { alreadyJoined: true, participation: existing.rows[0] };
      }
      
      // Add participation
      const result = await query(
        `INSERT INTO user_event_participation (user_id, event_id, joined_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         RETURNING *`,
        [userId, eventId]
      );
      
      return { alreadyJoined: false, participation: result.rows[0] };
    } catch (error) {
      console.error('Error joining event:', error);
      throw error;
    }
  }
  
  // Get total user count
  static async getTotalCount() {
    try {
      const result = await query('SELECT COUNT(*) as count FROM users');
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error getting total count:', error);
      throw error;
    }
  }
}

module.exports = User;
