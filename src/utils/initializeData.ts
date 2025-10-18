// This file initializes the database with sample events
// Run this once to populate the database with initial data

import { eventsData } from '../data/events'
import * as api from './api'

export async function initializeDatabase() {
  try {
    console.log('Starting database initialization...')
    
    // Check if events already exist
    const existingEvents = await api.getAllEvents()
    
    if (existingEvents.length > 0) {
      console.log(`Database already has ${existingEvents.length} events. Skipping initialization.`)
      return { success: true, message: 'Database already initialized' }
    }
    
    // Login as admin first
    const loginResult = await api.login('campusia@12345')
    if (!loginResult.success) {
      throw new Error('Failed to login as admin')
    }
    
    console.log('Logged in as admin successfully')
    
    // Create each event
    let successCount = 0
    let errorCount = 0
    
    for (const event of eventsData) {
      try {
        const eventData = {
          title: event.title,
          subtitle: event.subtitle,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          venue: event.venue,
          images: [event.image], // Convert single image to array
          category: event.category,
          eventType: event.eventType,
          organizer: event.organizer,
          highlights: event.highlights,
          registrationUrl: event.registrationUrl,
          featured: event.featured
        }
        
        const result = await api.createEvent(eventData)
        
        if (result.success) {
          successCount++
          console.log(`✓ Created event: ${event.title}`)
        } else {
          errorCount++
          console.error(`✗ Failed to create event: ${event.title}`, result.message)
        }
      } catch (error) {
        errorCount++
        console.error(`✗ Error creating event: ${event.title}`, error)
      }
    }
    
    console.log(`\nInitialization complete!`)
    console.log(`Success: ${successCount} events`)
    console.log(`Failed: ${errorCount} events`)
    
    return {
      success: errorCount === 0,
      message: `Created ${successCount} events, ${errorCount} failed`
    }
  } catch (error) {
    console.error('Database initialization failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Helper function to run initialization from browser console
// Usage: window.initDB()
if (typeof window !== 'undefined') {
  (window as any).initDB = initializeDatabase
}
