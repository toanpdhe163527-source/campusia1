// campusia-backend/src/models/Event.js
// Event model using JSON file storage (No MongoDB)

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
const eventsFile = path.join(dataDir, 'events.json');
const counterFile = path.join(dataDir, 'counter.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper function to read events
function readEvents() {
  try {
    const data = fs.readFileSync(eventsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write events
function writeEvents(events) {
  fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));
}

// Helper function to get next ID
function getNextId() {
  try {
    const data = fs.readFileSync(counterFile, 'utf8');
    const counter = JSON.parse(data);
    counter.eventId += 1;
    fs.writeFileSync(counterFile, JSON.stringify(counter, null, 2));
    return counter.eventId;
  } catch (error) {
    const newCounter = { eventId: 1 };
    fs.writeFileSync(counterFile, JSON.stringify(newCounter, null, 2));
    return 1;
  }
}

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

// Event class with CRUD methods
class Event {
  // Get all events
  static getAll() {
    return readEvents();
  }
  
  // Get event by ID (numeric)
  static getById(id) {
    const events = readEvents();
    return events.find(event => event.id === parseInt(id));
  }
  
  // Get events by type
  static getByType(eventType) {
    const events = readEvents();
    return events.filter(event => event.eventType === eventType);
  }
  
  // Get featured events
  static getFeatured() {
    const events = readEvents();
    return events.filter(event => event.featured === true);
  }
  
  // Create new event
  static create(data) {
    validateEvent(data);
    
    const events = readEvents();
    const id = getNextId();
    
    const newEvent = {
      id,
      title: data.title,
      subtitle: data.subtitle || '',
      description: data.description,
      date: data.date,
      time: data.time,
      location: data.location,
      venue: data.venue,
      image: data.image || (data.images && data.images[0]) || 'https://via.placeholder.com/800x400',
      images: data.images || [],
      category: data.category,
      eventType: data.eventType,
      organizer: data.organizer,
      rating: data.rating || 4.5,
      attendees: data.attendees || 0,
      highlights: data.highlights || [],
      registrationUrl: data.registrationUrl,
      featured: data.featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    writeEvents(events);
    
    return newEvent;
  }
  
  // Update event
  static update(id, data) {
    const events = readEvents();
    const index = events.findIndex(event => event.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Event not found');
    }
    
    // Don't allow changing ID
    delete data.id;
    
    // Update event
    events[index] = {
      ...events[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    writeEvents(events);
    return events[index];
  }
  
  // Delete event
  static delete(id) {
    const events = readEvents();
    const index = events.findIndex(event => event.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Event not found');
    }
    
    events.splice(index, 1);
    writeEvents(events);
    
    return true;
  }
  
  // Toggle featured status
  static toggleFeatured(id) {
    const events = readEvents();
    const index = events.findIndex(event => event.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Event not found');
    }
    
    events[index].featured = !events[index].featured;
    events[index].updatedAt = new Date().toISOString();
    
    writeEvents(events);
    return events[index];
  }
}

module.exports = Event;
