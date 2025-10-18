import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Middleware
app.use('*', cors())
app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Storage bucket name
const BUCKET_NAME = 'make-f28c46f6-event-images'

// Initialize storage bucket
async function initializeBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 5242880 // 5MB
      })
      if (error) {
        console.log('Error creating bucket:', error)
      } else {
        console.log('Bucket created successfully')
      }
    }
  } catch (error) {
    console.log('Error initializing bucket:', error)
  }
}

// Initialize bucket on startup
initializeBucket()

// Authentication helper
async function verifyAuth(authHeader: string | null): Promise<boolean> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  
  const token = authHeader.split(' ')[1]
  const adminToken = await kv.get('admin_token')
  
  return token === adminToken
}

// ============= AUTH ROUTES =============

// Login route
app.post('/make-server-f28c46f6/auth/login', async (c) => {
  try {
    const { password } = await c.req.json()
    
    // Check password
    if (password === 'campusia@12345') {
      // Generate simple token (in production, use JWT)
      const token = crypto.randomUUID()
      await kv.set('admin_token', token)
      
      return c.json({ 
        success: true, 
        token,
        message: 'Đăng nhập thành công' 
      })
    }
    
    return c.json({ 
      success: false, 
      message: 'Mật khẩu không đúng' 
    }, 401)
  } catch (error) {
    console.log('Login error:', error)
    return c.json({ 
      success: false, 
      message: `Lỗi đăng nhập: ${error}` 
    }, 500)
  }
})

// Verify token
app.get('/make-server-f28c46f6/auth/verify', async (c) => {
  const isValid = await verifyAuth(c.req.header('Authorization'))
  return c.json({ valid: isValid })
})

// ============= EVENT ROUTES =============

// Get all events
app.get('/make-server-f28c46f6/events', async (c) => {
  try {
    const events = await kv.getByPrefix('event:')
    return c.json({ success: true, events })
  } catch (error) {
    console.log('Error fetching events:', error)
    return c.json({ 
      success: false, 
      message: `Lỗi lấy danh sách sự kiện: ${error}` 
    }, 500)
  }
})

// Get single event
app.get('/make-server-f28c46f6/events/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const event = await kv.get(`event:${id}`)
    
    if (!event) {
      return c.json({ 
        success: false, 
        message: 'Không tìm thấy sự kiện' 
      }, 404)
    }
    
    return c.json({ success: true, event })
  } catch (error) {
    console.log('Error fetching event:', error)
    return c.json({ 
      success: false, 
      message: `Lỗi lấy thông tin sự kiện: ${error}` 
    }, 500)
  }
})

// Create event (requires auth)
app.post('/make-server-f28c46f6/events', async (c) => {
  try {
    // Verify authentication
    const isAuthed = await verifyAuth(c.req.header('Authorization'))
    if (!isAuthed) {
      return c.json({ 
        success: false, 
        message: 'Unauthorized - Vui lòng đăng nhập' 
      }, 401)
    }
    
    const eventData = await c.req.json()
    
    // Generate new ID
    const events = await kv.getByPrefix('event:')
    const maxId = events.reduce((max, e) => Math.max(max, e.id || 0), 0)
    const newId = maxId + 1
    
    // Process images - upload to storage
    const processedImages: string[] = []
    if (eventData.images && Array.isArray(eventData.images)) {
      for (let i = 0; i < eventData.images.length; i++) {
        const imageData = eventData.images[i]
        
        // If it's a base64 image, upload to storage
        if (imageData.startsWith('data:image/')) {
          try {
            // Extract base64 data
            const base64Data = imageData.split(',')[1]
            const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
            
            // Generate filename
            const ext = imageData.split(';')[0].split('/')[1]
            const filename = `event-${newId}-${i}-${Date.now()}.${ext}`
            
            // Upload to storage
            const { error: uploadError } = await supabase.storage
              .from(BUCKET_NAME)
              .upload(filename, buffer, {
                contentType: `image/${ext}`,
                upsert: false
              })
            
            if (uploadError) {
              console.log('Upload error:', uploadError)
            } else {
              // Get signed URL (valid for 1 year)
              const { data: signedData } = await supabase.storage
                .from(BUCKET_NAME)
                .createSignedUrl(filename, 31536000) // 1 year
              
              if (signedData?.signedUrl) {
                processedImages.push(signedData.signedUrl)
              }
            }
          } catch (uploadError) {
            console.log('Error processing image:', uploadError)
          }
        } else {
          // Keep existing URLs
          processedImages.push(imageData)
        }
      }
    }
    
    // Create event object
    const newEvent = {
      id: newId,
      title: eventData.title,
      subtitle: eventData.subtitle || '',
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      venue: eventData.venue,
      image: processedImages[0] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      images: processedImages,
      category: eventData.category,
      eventType: eventData.eventType,
      organizer: eventData.organizer,
      rating: 4.5,
      attendees: 0,
      highlights: eventData.highlights || [],
      registrationUrl: eventData.registrationUrl,
      featured: eventData.featured || false,
      createdAt: new Date().toISOString()
    }
    
    // Save to KV store
    await kv.set(`event:${newId}`, newEvent)
    
    return c.json({ 
      success: true, 
      event: newEvent,
      message: 'Sự kiện đã được tạo thành công' 
    })
  } catch (error) {
    console.log('Error creating event:', error)
    return c.json({ 
      success: false, 
      message: `Lỗi tạo sự kiện: ${error}` 
    }, 500)
  }
})

// Update event (requires auth)
app.put('/make-server-f28c46f6/events/:id', async (c) => {
  try {
    // Verify authentication
    const isAuthed = await verifyAuth(c.req.header('Authorization'))
    if (!isAuthed) {
      return c.json({ 
        success: false, 
        message: 'Unauthorized - Vui lòng đăng nhập' 
      }, 401)
    }
    
    const id = c.req.param('id')
    const eventData = await c.req.json()
    
    // Get existing event
    const existingEvent = await kv.get(`event:${id}`)
    if (!existingEvent) {
      return c.json({ 
        success: false, 
        message: 'Không tìm thấy sự kiện' 
      }, 404)
    }
    
    // Update event
    const updatedEvent = {
      ...existingEvent,
      ...eventData,
      id: parseInt(id),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`event:${id}`, updatedEvent)
    
    return c.json({ 
      success: true, 
      event: updatedEvent,
      message: 'Sự kiện đã được cập nhật' 
    })
  } catch (error) {
    console.log('Error updating event:', error)
    return c.json({ 
      success: false, 
      message: `Lỗi cập nhật sự kiện: ${error}` 
    }, 500)
  }
})

// Delete event (requires auth)
app.delete('/make-server-f28c46f6/events/:id', async (c) => {
  try {
    // Verify authentication
    const isAuthed = await verifyAuth(c.req.header('Authorization'))
    if (!isAuthed) {
      return c.json({ 
        success: false, 
        message: 'Unauthorized - Vui lòng đăng nhập' 
      }, 401)
    }
    
    const id = c.req.param('id')
    
    // Check if event exists
    const event = await kv.get(`event:${id}`)
    if (!event) {
      return c.json({ 
        success: false, 
        message: 'Không tìm thấy sự kiện' 
      }, 404)
    }
    
    // Delete event
    await kv.del(`event:${id}`)
    
    return c.json({ 
      success: true, 
      message: 'Sự kiện đã được xóa' 
    })
  } catch (error) {
    console.log('Error deleting event:', error)
    return c.json({ 
      success: false, 
      message: `Lỗi xóa sự kiện: ${error}` 
    }, 500)
  }
})

// Toggle featured status (requires auth)
app.post('/make-server-f28c46f6/events/:id/toggle-featured', async (c) => {
  try {
    // Verify authentication
    const isAuthed = await verifyAuth(c.req.header('Authorization'))
    if (!isAuthed) {
      return c.json({ 
        success: false, 
        message: 'Unauthorized - Vui lòng đăng nhập' 
      }, 401)
    }
    
    const id = c.req.param('id')
    
    // Get event
    const event = await kv.get(`event:${id}`)
    if (!event) {
      return c.json({ 
        success: false, 
        message: 'Không tìm thấy sự kiện' 
      }, 404)
    }
    
    // Toggle featured
    const updatedEvent = {
      ...event,
      featured: !event.featured,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`event:${id}`, updatedEvent)
    
    return c.json({ 
      success: true, 
      event: updatedEvent,
      message: `Sự kiện đã ${updatedEvent.featured ? 'được đánh dấu' : 'bỏ đánh dấu'} nổi bật` 
    })
  } catch (error) {
    console.log('Error toggling featured:', error)
    return c.json({ 
      success: false, 
      message: `Lỗi cập nhật trạng thái nổi bật: ${error}` 
    }, 500)
  }
})

// Health check
app.get('/make-server-f28c46f6/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
Deno.serve(app.fetch)
