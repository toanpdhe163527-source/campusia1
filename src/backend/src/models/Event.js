// campusia-backend/src/models/Event.js
// Event model using PostgreSQL Database

const { query } = require('../config/db');

// Validate event data
function validateEvent(data) {
  const required = ['title', 'description', 'date', 'time', 'location', 'venue', 'category', 'eventType', 'organizer', 'registrationUrl'];
  
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  // Validate category
  const validCategories = ['Học thuật', 'Kinh doanh', 'Phát triển kĩ năng', 'Giải trí'];
  if (!validCategories.includes(data.category)) {
    throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
  }
  
  // Validate eventType
  const validEventTypes = ['CLB', 'Workshop', 'Exe'];
  if (!validEventTypes.includes(data.eventType)) {
    throw new Error(`Invalid eventType. Must be one of: ${validEventTypes.join(', ')}`);
  }
  
  return true;
}

// Convert database row to frontend format (snake_case -> camelCase)
function rowToEvent(row) {
  if (!row) return null;
  
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || '',
    description: row.description,
    date: row.date,
    time: row.time,
    location: row.location,
    venue: row.venue,
    image: row.image,
    images: row.images || [],
    category: row.category,
    eventType: row.event_type,
    organizer: row.organizer,
    rating: parseFloat(row.rating) || 4.5,
    attendees: row.attendees || 0,
    highlights: row.highlights || [],
    registrationUrl: row.registration_url,
    featured: row.featured || false,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Event class with CRUD methods
class Event {
  // Get all events
  static async getAll() {
    try {
      const result = await query(
        'SELECT * FROM events ORDER BY created_at DESC'
      );
      return result.rows.map(rowToEvent);
    } catch (error) {
      console.error('Error getting all events:', error);
      throw error;
    }
  }
  
  // Get event by ID
  static async getById(id) {
    try {
      const result = await query(
        'SELECT * FROM events WHERE id = $1',
        [parseInt(id)]
      );
      return rowToEvent(result.rows[0]);
    } catch (error) {
      console.error('Error getting event by ID:', error);
      throw error;
    }
  }
  
  // Get events by type
  static async getByType(eventType) {
    try {
      const result = await query(
        'SELECT * FROM events WHERE event_type = $1 ORDER BY created_at DESC',
        [eventType]
      );
      return result.rows.map(rowToEvent);
    } catch (error) {
      console.error('Error getting events by type:', error);
      throw error;
    }
  }
  
  // Get featured events
  static async getFeatured() {
    try {
      const result = await query(
        'SELECT * FROM events WHERE featured = true ORDER BY created_at DESC'
      );
      return result.rows.map(rowToEvent);
    } catch (error) {
      console.error('Error getting featured events:', error);
      throw error;
    }
  }
  
  // Create new event
  static async create(data) {
    validateEvent(data);
    
    try {
      const result = await query(
        `INSERT INTO events (
          title, subtitle, description, date, time, location, venue,
          image, images, category, event_type, organizer, rating,
          attendees, highlights, registration_url, featured
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *`,
        [
          data.title,
          data.subtitle || '',
          data.description,
          data.date,
          data.time,
          data.location,
          data.venue,
          data.image || (data.images && data.images[0]) || 'https://via.placeholder.com/800x400',
          data.images || [],
          data.category,
          data.eventType,
          data.organizer,
          data.rating || 4.5,
          data.attendees || 0,
          data.highlights || [],
          data.registrationUrl,
          data.featured || false
        ]
      );
      
      return rowToEvent(result.rows[0]);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }
  
  // Update event
  static async update(id, data) {
    try {
      // Get existing event
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('Event not found');
      }
      
      // Build update query dynamically based on provided fields
      const updates = [];
      const values = [];
      let paramCount = 1;
      
      if (data.title !== undefined) {
        updates.push(`title = $${paramCount++}`);
        values.push(data.title);
      }
      if (data.subtitle !== undefined) {
        updates.push(`subtitle = $${paramCount++}`);
        values.push(data.subtitle);
      }
      if (data.description !== undefined) {
        updates.push(`description = $${paramCount++}`);
        values.push(data.description);
      }
      if (data.date !== undefined) {
        updates.push(`date = $${paramCount++}`);
        values.push(data.date);
      }
      if (data.time !== undefined) {
        updates.push(`time = $${paramCount++}`);
        values.push(data.time);
      }
      if (data.location !== undefined) {
        updates.push(`location = $${paramCount++}`);
        values.push(data.location);
      }
      if (data.venue !== undefined) {
        updates.push(`venue = $${paramCount++}`);
        values.push(data.venue);
      }
      if (data.image !== undefined) {
        updates.push(`image = $${paramCount++}`);
        values.push(data.image);
      }
      if (data.images !== undefined) {
        updates.push(`images = $${paramCount++}`);
        values.push(data.images);
      }
      if (data.category !== undefined) {
        updates.push(`category = $${paramCount++}`);
        values.push(data.category);
      }
      if (data.eventType !== undefined) {
        updates.push(`event_type = $${paramCount++}`);
        values.push(data.eventType);
      }
      if (data.organizer !== undefined) {
        updates.push(`organizer = $${paramCount++}`);
        values.push(data.organizer);
      }
      if (data.rating !== undefined) {
        updates.push(`rating = $${paramCount++}`);
        values.push(data.rating);
      }
      if (data.attendees !== undefined) {
        updates.push(`attendees = $${paramCount++}`);
        values.push(data.attendees);
      }
      if (data.highlights !== undefined) {
        updates.push(`highlights = $${paramCount++}`);
        values.push(data.highlights);
      }
      if (data.registrationUrl !== undefined) {
        updates.push(`registration_url = $${paramCount++}`);
        values.push(data.registrationUrl);
      }
      if (data.featured !== undefined) {
        updates.push(`featured = $${paramCount++}`);
        values.push(data.featured);
      }
      
      // Always update updated_at
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      
      // Add ID as last parameter
      values.push(parseInt(id));
      
      const result = await query(
        `UPDATE events SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      
      return rowToEvent(result.rows[0]);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }
  
  // Delete event
  static async delete(id) {
    try {
      const result = await query(
        'DELETE FROM events WHERE id = $1 RETURNING id',
        [parseInt(id)]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Event not found');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
  
  // Toggle featured status
  static async toggleFeatured(id) {
    try {
      const result = await query(
        `UPDATE events 
         SET featured = NOT featured, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 
         RETURNING *`,
        [parseInt(id)]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Event not found');
      }
      
      return rowToEvent(result.rows[0]);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
    }
  }
}

module.exports = Event;
