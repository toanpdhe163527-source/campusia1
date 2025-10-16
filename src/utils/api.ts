import { Event } from '../data/events'

// Update this URL to your backend API URL
// Development: http://localhost:5000/api
// Production: https://your-backend-domain.com/api

// Get API URL from environment or use default
const getApiUrl = () => {
  // Check if running in browser with environment variable
  if (typeof window !== 'undefined' && (window as any).ENV?.REACT_APP_API_URL) {
    return (window as any).ENV.REACT_APP_API_URL
  }
  // Default to localhost for development
  return 'http://localhost:5000/api'
}

const API_BASE_URL = getApiUrl()

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('admin_token')
}

// Save auth token to localStorage
function saveAuthToken(token: string) {
  localStorage.setItem('admin_token', token)
}

// Remove auth token from localStorage
export function clearAuthToken() {
  localStorage.removeItem('admin_token')
}

// Make API request with auth
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    
    // For 401 errors, throw with a specific flag to handle silently
    if (response.status === 401) {
      const err: any = new Error(error.message || 'Unauthorized')
      err.isAuthError = true
      throw err
    }
    
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// ============= AUTH API =============

export async function login(password: string): Promise<{ success: boolean; token?: string; message?: string }> {
  try {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    })
    
    if (result.success && result.token) {
      saveAuthToken(result.token)
    }
    
    return result
  } catch (error) {
    console.error('Login error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Lỗi đăng nhập' 
    }
  }
}

export async function verifyAuth(): Promise<boolean> {
  try {
    // Check if token exists first
    const token = getAuthToken()
    if (!token) {
      return false
    }
    
    const result = await apiRequest('/auth/verify')
    return result.valid === true
  } catch (error: any) {
    // Silently return false for auth errors (expected when not logged in)
    if (error.isAuthError || (error instanceof Error && error.message.includes('Unauthorized'))) {
      return false
    }
    // Only log unexpected errors
    console.error('Verify auth error:', error)
    return false
  }
}

// ============= HEALTH CHECK =============

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`)
    return response.ok
  } catch (error) {
    return false
  }
}

// ============= EVENT API =============

export async function getAllEvents(): Promise<Event[]> {
  try {
    const result = await apiRequest('/events')
    return result.events || []
  } catch (error: any) {
    // Don't log if it's just a connection error (backend not running)
    if (error.message === 'Network error' || error.message.includes('fetch')) {
      console.warn('Backend not available. Please start backend with: cd backend && npm run dev')
    } else {
      console.error('Get events error:', error)
    }
    return []
  }
}

export async function getEventById(id: number): Promise<Event | null> {
  try {
    const result = await apiRequest(`/events/${id}`)
    return result.event || null
  } catch (error) {
    console.error('Get event error:', error)
    return null
  }
}

export async function createEvent(eventData: any): Promise<{ success: boolean; event?: Event; message?: string }> {
  try {
    const result = await apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    })
    return result
  } catch (error) {
    console.error('Create event error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Lỗi tạo sự kiện' 
    }
  }
}

export async function updateEvent(id: number, eventData: any): Promise<{ success: boolean; event?: Event; message?: string }> {
  try {
    const result = await apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    })
    return result
  } catch (error) {
    console.error('Update event error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Lỗi cập nhật sự kiện' 
    }
  }
}

export async function deleteEvent(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    const result = await apiRequest(`/events/${id}`, {
      method: 'DELETE'
    })
    return result
  } catch (error) {
    console.error('Delete event error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Lỗi xóa sự kiện' 
    }
  }
}

export async function toggleEventFeatured(id: number): Promise<{ success: boolean; event?: Event; message?: string }> {
  try {
    const result = await apiRequest(`/events/${id}/toggle-featured`, {
      method: 'POST'
    })
    return result
  } catch (error) {
    console.error('Toggle featured error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Lỗi cập nhật trạng thái' 
    }
  }
}
