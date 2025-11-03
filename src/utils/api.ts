import { Event } from '../data/events'

// Update this URL to your backend API URL
// Development: http://localhost:5000/api
// Production: https://your-backend-domain.com/api

// Get API URL from environment or use default
const getApiUrl = () => {
  // For Vite, use import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    const apiUrl = import.meta.env.VITE_API_URL
    // If URL already includes /api, don't add it again
    return apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`
  }
  // Default to localhost for development
  return 'https://campusia1-backend.onrender.com/api'
}

const API_BASE_URL = getApiUrl()

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('admin_token') || localStorage.getItem('user_token')
}

// Save admin token to localStorage
function saveAdminToken(token: string) {
  localStorage.setItem('admin_token', token)
  localStorage.removeItem('user_token')
}

// Save user token to localStorage
function saveUserToken(token: string) {
  localStorage.setItem('user_token', token)
  localStorage.removeItem('admin_token')
}

// Remove auth token from localStorage
export function clearAuthToken() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('user_token')
}

// Check if current user is admin
export function isAdmin(): boolean {
  return localStorage.getItem('admin_token') !== null
}

// Check if current user is logged in
export function isUserLoggedIn(): boolean {
  return localStorage.getItem('user_token') !== null
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

// Admin login
export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; message?: string }> {
  try {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    })
    
    if (result.success && result.token) {
      saveAdminToken(result.token)
    }
    
    return result
  } catch (error) {
    console.error('Admin login error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Lỗi đăng nhập admin' 
    }
  }
}

// User registration
export async function userRegister(name: string, email: string): Promise<{ success: boolean; token?: string; user?: any; message?: string }> {
  try {
    const result = await apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email })
    })
    
    if (result.success && result.token) {
      saveUserToken(result.token)
    }
    
    return result
  } catch (error) {
    console.error('User register error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Lỗi đăng ký' 
    }
  }
}

// User login
export async function userLogin(email: string): Promise<{ success: boolean; token?: string; user?: any; message?: string }> {
  try {
    const result = await apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
    
    if (result.success && result.token) {
      saveUserToken(result.token)
    }
    
    return result
  } catch (error) {
    console.error('User login error:', error)
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
    // Ensure images are included in the request
    // Backend will handle base64 images and upload to Cloudinary
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
    // Backend will handle base64 images and upload to Cloudinary
    // Existing Cloudinary URLs will be preserved
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

// ============= USER API =============

export async function getUserInfo(): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const result = await apiRequest('/users/me')
    return result
  } catch (error) {
    console.error('Get user info error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Lỗi lấy thông tin user' 
    }
  }
}

export async function joinEvent(eventId: number): Promise<{ success: boolean; message?: string }> {
  try {
    const result = await apiRequest(`/users/join-event/${eventId}`, {
      method: 'POST'
    })
    return result
  } catch (error) {
    console.error('Join event error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Lỗi tham gia sự kiện' 
    }
  }
}

export async function getUserEvents(): Promise<{ success: boolean; events?: any[]; message?: string }> {
  try {
    const result = await apiRequest('/users/my-events')
    return result
  } catch (error) {
    console.error('Get user events error:', error)
    return { 
      success: false,
      events: [],
      message: error instanceof Error ? error.message : 'Lỗi lấy danh sách sự kiện' 
    }
  }
}

// ============= ADMIN USER MANAGEMENT API =============

export async function getAllUsers(): Promise<{ success: boolean; users?: any[]; total?: number; message?: string }> {
  try {
    const result = await apiRequest('/admin/users')
    return result
  } catch (error) {
    console.error('Get all users error:', error)
    return { 
      success: false,
      users: [],
      total: 0,
      message: error instanceof Error ? error.message : 'Lỗi lấy danh sách thành viên' 
    }
  }
}

export async function getUserParticipation(userId: number): Promise<{ success: boolean; events?: any[]; message?: string }> {
  try {
    const result = await apiRequest(`/admin/users/${userId}/events`)
    return result
  } catch (error) {
    console.error('Get user participation error:', error)
    return { 
      success: false,
      events: [],
      message: error instanceof Error ? error.message : 'Lỗi lấy lịch sử tham gia' 
    }
  }
}

export async function getAdminStats(): Promise<{ success: boolean; stats?: any; message?: string }> {
  try {
    const result = await apiRequest('/admin/stats')
    return result
  } catch (error) {
    console.error('Get admin stats error:', error)
    return { 
      success: false,
      stats: {},
      message: error instanceof Error ? error.message : 'Lỗi lấy thống kê' 
    }
  }
}
