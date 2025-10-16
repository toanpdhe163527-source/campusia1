import { Event } from '../data/events'
import { FilterState } from '../components/SearchAndFilters'

export function filterEvents(events: Event[], filters: FilterState): Event[] {
  let filteredEvents = [...events]

  // Search query filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim()
    filteredEvents = filteredEvents.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.subtitle?.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.organizer.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (filters.categories.length > 0) {
    filteredEvents = filteredEvents.filter(event =>
      event.category && filters.categories.includes(event.category)
    )
  }

  // Location filter
  if (filters.locations.length > 0) {
    filteredEvents = filteredEvents.filter(event =>
      filters.locations.some(location => 
        event.location.includes(location)
      )
    )
  }

  // Price range filter removed - no longer applicable

  // Date range filter
  if (filters.dateRange.from || filters.dateRange.to) {
    filteredEvents = filteredEvents.filter(event => {
      const eventDate = parseEventDate(event.date)
      if (!eventDate) return true

      if (filters.dateRange.from && eventDate < filters.dateRange.from) {
        return false
      }
      if (filters.dateRange.to && eventDate > filters.dateRange.to) {
        return false
      }
      return true
    })
  }

  return filteredEvents
}

export function sortEvents(events: Event[], sortBy: string): Event[] {
  const sortedEvents = [...events]

  switch (sortBy) {
    case 'date':
      return sortedEvents.sort((a, b) => {
        const dateA = parseEventDate(a.date)
        const dateB = parseEventDate(b.date)
        if (!dateA || !dateB) return 0
        return dateA.getTime() - dateB.getTime()
      })

    case 'price-low':
    case 'price-high':
      // Price sorting removed - return by date instead
      return sortedEvents.sort((a, b) => {
        const dateA = parseEventDate(a.date)
        const dateB = parseEventDate(b.date)
        if (!dateA || !dateB) return 0
        return dateA.getTime() - dateB.getTime()
      })

    case 'popularity':
      return sortedEvents.sort((a, b) => b.attendees - a.attendees)

    case 'newest':
      return sortedEvents.sort((a, b) => b.id - a.id)

    case 'name':
      return sortedEvents.sort((a, b) => a.title.localeCompare(b.title, 'vi'))

    default:
      return sortedEvents
  }
}

function parseEventDate(dateString: string): Date | null {
  try {
    // Handle different date formats from the events data
    // Example: "15.11 - 16.11.2025" or "07.12.2025"
    const cleanDateString = dateString.split(' - ')[0] // Take the start date if it's a range
    
    // Check if it includes year
    if (cleanDateString.includes('.2025')) {
      const parts = cleanDateString.split('.')
      if (parts.length === 3) {
        const day = parseInt(parts[0])
        const month = parseInt(parts[1]) - 1 // JavaScript months are 0-indexed
        const year = parseInt(parts[2])
        return new Date(year, month, day)
      }
    } else {
      // Assume current year if no year specified
      const parts = cleanDateString.split('.')
      if (parts.length === 2) {
        const day = parseInt(parts[0])
        const month = parseInt(parts[1]) - 1
        const year = new Date().getFullYear()
        return new Date(year, month, day)
      }
    }
    
    return null
  } catch (error) {
    console.error('Error parsing date:', dateString, error)
    return null
  }
}