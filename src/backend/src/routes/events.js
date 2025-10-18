// campusia-backend/src/routes/events.js
// Event CRUD routes (JSON storage)

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { verifyToken } = require('../middleware/auth');
const { saveBase64Image } = require('../middleware/upload');

/**
 * GET /api/events
 * Get all events
 */
router.get('/', async (req, res) => {
  try {
    const events = Event.getAll();
    
    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách sự kiện: ' + error.message
    });
  }
});

/**
 * GET /api/events/:id
 * Get single event by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const event = Event.getById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sự kiện'
      });
    }

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin sự kiện: ' + error.message
    });
  }
});

/**
 * POST /api/events
 * Create new event (requires auth)
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const eventData = req.body;

    // Process images (base64 or URLs)
    const processedImages = [];
    
    if (eventData.images && Array.isArray(eventData.images)) {
      for (const image of eventData.images) {
        if (image.startsWith('data:image/')) {
          // Base64 image - save to disk
          const imagePath = await saveBase64Image(image);
          processedImages.push(`${req.protocol}://${req.get('host')}/uploads/${imagePath}`);
        } else {
          // URL - keep as is
          processedImages.push(image);
        }
      }
    }

    // Create event data
    const newEventData = {
      title: eventData.title,
      subtitle: eventData.subtitle || '',
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      venue: eventData.venue,
      images: processedImages,
      category: eventData.category,
      eventType: eventData.eventType,
      organizer: eventData.organizer,
      rating: eventData.rating || 4.5,
      attendees: eventData.attendees || 0,
      highlights: eventData.highlights || [],
      registrationUrl: eventData.registrationUrl,
      featured: eventData.featured || false
    };

    const event = Event.create(newEventData);

    res.status(201).json({
      success: true,
      event,
      message: 'Sự kiện đã được tạo thành công'
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo sự kiện: ' + error.message
    });
  }
});

/**
 * PUT /api/events/:id
 * Update event (requires auth)
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const event = Event.update(req.params.id, req.body);

    res.json({
      success: true,
      event,
      message: 'Sự kiện đã được cập nhật'
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi cập nhật sự kiện'
    });
  }
});

/**
 * DELETE /api/events/:id
 * Delete event (requires auth)
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    Event.delete(req.params.id);

    res.json({
      success: true,
      message: 'Sự kiện đã được xóa'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi xóa sự kiện'
    });
  }
});

/**
 * POST /api/events/:id/toggle-featured
 * Toggle featured status (requires auth)
 */
router.post('/:id/toggle-featured', verifyToken, async (req, res) => {
  try {
    const event = Event.toggleFeatured(req.params.id);

    res.json({
      success: true,
      event,
      message: `Sự kiện đã ${event.featured ? 'được đánh dấu' : 'bỏ đánh dấu'} nổi bật`
    });

  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi cập nhật trạng thái'
    });
  }
});

/**
 * GET /api/events/type/:eventType
 * Get events by type (CLB, Workshop, Exe)
 */
router.get('/type/:eventType', async (req, res) => {
  try {
    const events = Event.getByType(req.params.eventType);
    
    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Get events by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách sự kiện: ' + error.message
    });
  }
});

/**
 * GET /api/events/featured/list
 * Get featured events only
 */
router.get('/featured/list', async (req, res) => {
  try {
    const events = Event.getFeatured();
    
    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách sự kiện nổi bật: ' + error.message
    });
  }
});

module.exports = router;
