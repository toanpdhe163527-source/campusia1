import { useState, useMemo, useEffect } from 'react'
import { Navigation } from './components/Navigation'
import { HeroCarousel } from './components/HeroCarousel'
import { SpecialEvents } from './components/SpecialEvents'
import { EventDetail } from './components/EventDetail'
import { CreateEvent } from './components/CreateEvent'
import { AdminLogin } from './components/Login'
import { UserLogin } from './components/UserLogin'
import { AdminDashboard } from './components/AdminDashboard'
import { SearchAndFilters, FilterState } from './components/SearchAndFilters'
import { Event } from './data/events'
import { filterEvents, sortEvents } from './utils/filterEvents'
import * as api from './utils/api'
import { initializeDatabase } from './utils/initializeData'

type ViewState = 'home' | 'eventDetail' | 'createEvent' | 'userLogin' | 'adminLogin' | 'admin'

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home')
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [backendAvailable, setBackendAvailable] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    categories: [],
    dateRange: {},
    priceRange: [0, 5000000], // Keep for compatibility but unused
    locations: [],
    sortBy: 'date'
  })

  const selectedEvent = selectedEventId ? events.find(event => event.id === selectedEventId) : null

  // Load events from API on mount
  useEffect(() => {
    checkBackendAndLoadEvents()
    // Make initialization function available globally
    if (typeof window !== 'undefined') {
      (window as any).initDB = initializeDatabase
    }
  }, [])
  
  async function checkBackendAndLoadEvents() {
    const isBackendUp = await api.checkBackendHealth()
    setBackendAvailable(isBackendUp)
    
    if (!isBackendUp) {
      console.warn('⚠️ Backend is not running. Please start it with: cd backend && npm run dev')
      setLoading(false)
      return
    }
    
    loadEvents()
  }

  // Verify auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  async function loadEvents() {
    setLoading(true)
    try {
      const fetchedEvents = await api.getAllEvents()
      setEvents(fetchedEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  async function checkAuth() {
    const isAdminValid = await api.verifyAuth() && api.isAdmin()
    const isUserValid = api.isUserLoggedIn()
    setIsAdminAuthenticated(isAdminValid)
    setIsUserLoggedIn(isUserValid)
  }

  // Filter and sort events based on current filters and active category
  const filteredAndSortedEvents = useMemo(() => {
    let filteredEvents = events
    
    // Filter by active category from navigation (eventType: CLB, Workshop, Exe)
    if (activeCategory) {
      filteredEvents = filteredEvents.filter(event => event.eventType === activeCategory)
    }
    
    // Apply additional filters
    const filtered = filterEvents(filteredEvents, filters)
    return sortEvents(filtered, filters.sortBy)
  }, [filters, activeCategory, events])

  // Get events by type for separate sections
  const clbEvents = useMemo(() => events.filter(e => e.eventType === 'CLB'), [events])
  const workshopEvents = useMemo(() => events.filter(e => e.eventType === 'Workshop'), [events])
  const exeEvents = useMemo(() => events.filter(e => e.eventType === 'Exe'), [events])

  const handleEventClick = (eventId: number) => {
    setSelectedEventId(eventId)
    setCurrentView('eventDetail')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    setSelectedEventId(null)
    setActiveCategory(null)
    loadEvents() // Refresh events when returning home
  }

  const handleAdminLogin = async (password: string) => {
    const result = await api.adminLogin(password)
    if (result.success) {
      setIsAdminAuthenticated(true)
      setCurrentView('admin')
      return true
    }
    return false
  }

  const handleUserLogin = async (email: string) => {
    const result = await api.userLogin(email)
    if (result.success) {
      setIsUserLoggedIn(true)
      // If there's a pending event to view, go back to it
      if (selectedEventId) {
        setCurrentView('eventDetail')
      } else {
        setCurrentView('home')
      }
    }
    return result
  }

  const handleUserRegister = async (name: string, email: string) => {
    const result = await api.userRegister(name, email)
    if (result.success) {
      setIsUserLoggedIn(true)
      // If there's a pending event to view, go back to it
      if (selectedEventId) {
        setCurrentView('eventDetail')
      } else {
        setCurrentView('home')
      }
    }
    return result
  }

  const handleLoginRequired = () => {
    // Save current view and navigate to user login
    setCurrentView('userLogin')
  }

  const handleLogout = () => {
    api.clearAuthToken()
    setIsAdminAuthenticated(false)
    setIsUserLoggedIn(false)
    setCurrentView('home')
  }

  const handleDeleteEvent = async (eventId: number) => {
    const result = await api.deleteEvent(eventId)
    if (result.success) {
      await loadEvents()
    } else {
      alert(result.message || 'Lỗi xóa sự kiện')
    }
  }

  const handleToggleFeatured = async (eventId: number) => {
    const result = await api.toggleEventFeatured(eventId)
    if (result.success) {
      await loadEvents()
    } else {
      alert(result.message || 'Lỗi cập nhật trạng thái')
    }
  }

  const handleNavigate = (category: string | null) => {
    setActiveCategory(category)
    setCurrentView('home')
  }

  const handleSearchChange = (query: string) => {
    setFilters({ ...filters, searchQuery: query })
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      categories: [],
      dateRange: {},
      priceRange: [0, 5000000],
      locations: [],
      sortBy: 'date'
    })
  }

  const handleCreateEvent = async (eventData: any) => {
    const result = await api.createEvent(eventData)
    if (result.success) {
      await loadEvents()
      setCurrentView('admin')
    }
    return result
  }

  // User Login view
  if (currentView === 'userLogin') {
    return (
      <UserLogin
        onBack={() => setCurrentView('home')}
        onLogin={handleUserLogin}
        onRegister={handleUserRegister}
      />
    )
  }

  // Admin Login view
  if (currentView === 'adminLogin') {
    return (
      <AdminLogin
        onBack={() => setCurrentView('home')}
        onLogin={handleAdminLogin}
      />
    )
  }

  // Admin Dashboard view
  if (currentView === 'admin' && isAdminAuthenticated) {
    return (
      <AdminDashboard
        events={events}
        onBack={handleBackToHome}
        onCreateEvent={() => setCurrentView('createEvent')}
        onEditEvent={handleEventClick}
        onDeleteEvent={handleDeleteEvent}
        onToggleFeatured={handleToggleFeatured}
        onLogout={handleLogout}
      />
    )
  }

  // Create Event view
  if (currentView === 'createEvent') {
    if (!isAdminAuthenticated) {
      setCurrentView('adminLogin')
      return null
    }
    
    return (
      <CreateEvent
        onBack={() => setCurrentView('admin')}
        onSubmit={handleCreateEvent}
      />
    )
  }

  // Event Detail view
  if (currentView === 'eventDetail' && selectedEvent) {
    return (
      <EventDetail
        event={selectedEvent}
        onBack={handleBackToHome}
        isUserLoggedIn={isUserLoggedIn}
        onLoginRequired={handleLoginRequired}
      />
    )
  }

  // Home view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Backend Warning Banner */}
      {!backendAvailable && (
        <div className="bg-red-600 text-white px-4 py-3 text-center">
          <strong>⚠️ Backend không chạy!</strong> Vui lòng mở terminal và chạy: <code className="bg-red-700 px-2 py-1 rounded">cd backend && npm run dev</code>
        </div>
      )}
      
      {/* Navigation */}
      <Navigation
        onUserLogin={() => setCurrentView('userLogin')}
        onAdminLogin={() => setCurrentView('adminLogin')}
        onNavigate={handleNavigate}
        onSearchChange={handleSearchChange}
        activeCategory={activeCategory}
        searchQuery={filters.searchQuery}
      />

      {/* Hero Carousel - Only show on home page (no active category) */}
      {!activeCategory && (
        <HeroCarousel 
          events={events.filter(e => e.featured)} 
          onEventClick={handleEventClick}
        />
      )}

      {/* Search and Filters - Only show when navigating to a category or searching */}
      {activeCategory && (
        <SearchAndFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          eventCount={filteredAndSortedEvents.length}
        />
      )}

      {/* Loading state */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Đang tải sự kiện...</p>
        </div>
      ) : (
        <>
          {/* Show filtered events or show all categories */}
          {activeCategory ? (
            <SpecialEvents 
              events={filteredAndSortedEvents} 
              onEventClick={handleEventClick}
              title={`Sự kiện ${activeCategory}`}
            />
          ) : (
            <>
              {clbEvents.length > 0 && (
                <SpecialEvents 
                  events={clbEvents} 
                  onEventClick={handleEventClick}
                  title="CLB"
                />
              )}
              {workshopEvents.length > 0 && (
                <SpecialEvents 
                  events={workshopEvents} 
                  onEventClick={handleEventClick}
                  title="Workshop"
                />
              )}
              {exeEvents.length > 0 && (
                <SpecialEvents 
                  events={exeEvents} 
                  onEventClick={handleEventClick}
                  title="Exe"
                />
              )}
            </>
          )}

          {/* No events message */}
          {events.length === 0 && !loading && (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
              <h2 className="text-2xl text-gray-900 mb-4">Chưa có sự kiện nào</h2>
              <p className="text-gray-600">Vui lòng quay lại sau hoặc liên hệ admin để thêm sự kiện.</p>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2025 Campusia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
