import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Heart, Star, Users, Music, Check } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'
import { ImageWithFallback } from './figma/ImageWithFallback'
import * as api from '../utils/api'

interface EventDetailProps {
  event: {
    id: number
    title: string
    subtitle?: string
    description: string
    date: string
    time: string
    location: string
    venue: string
    image: string
    category?: string
    eventType?: string
    organizer: string
    rating: number
    attendees: number
    highlights: string[]
    registrationUrl: string
  }
  onBack: () => void
  isUserLoggedIn?: boolean
  onLoginRequired?: () => void
}

export function EventDetail({ event, onBack, isUserLoggedIn = false, onLoginRequired }: EventDetailProps) {
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [error, setError] = useState('')

  // Check if user has already joined this event
  useEffect(() => {
    if (isUserLoggedIn) {
      checkUserJoinedStatus()
    }
  }, [isUserLoggedIn, event.id])

  async function checkUserJoinedStatus() {
    const result = await api.getUserEvents()
    if (result.success && result.events) {
      const joined = result.events.some((e: any) => e.event_id === event.id)
      setHasJoined(joined)
    }
  }

  async function handleJoinEvent() {
    // If not logged in, redirect to login
    if (!isUserLoggedIn) {
      onLoginRequired?.()
      return
    }

    // If already joined, do nothing
    if (hasJoined) {
      return
    }

    setIsJoining(true)
    setError('')

    const result = await api.joinEvent(event.id)
    
    if (result.success) {
      setHasJoined(true)
    } else {
      setError(result.message || 'Không thể tham gia sự kiện')
    }

    setIsJoining(false)
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative">
        <ImageWithFallback 
          src={event.image}
          alt={event.title}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={onBack}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        {/* Share and favorite */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        {/* Event title overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center space-x-2 mb-2">
            {event.category && (
              <Badge className="bg-purple-600 text-white">{event.category}</Badge>
            )}
            {event.eventType && (
              <Badge className="bg-pink-600 text-white">{event.eventType}</Badge>
            )}
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-white">{event.rating}</span>
            </div>
            <div className="flex items-center space-x-1 text-white">
              <Users className="w-4 h-4" />
              <span className="text-sm">{event.attendees.toLocaleString()} quan tâm</span>
            </div>
          </div>
          <h1 className="text-white text-4xl font-bold mb-2">{event.title}</h1>
          {event.subtitle && (
            <p className="text-xl text-gray-200">{event.subtitle}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event info */}
            <Card className="bg-white border-gray-200 shadow-md">
              <CardContent className="p-6">
                <h2 className="text-gray-900 mb-4">Thông tin sự kiện</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày</p>
                      <p className="text-gray-900">{event.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Thời gian</p>
                      <p className="text-gray-900">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Địa điểm</p>
                      <p className="text-gray-900">{event.venue}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200 my-6" />

                <div className="mb-6">
                  <h3 className="text-lg text-gray-900 mb-3">Mô tả sự kiện</h3>
                  <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </div>

                {event.highlights.length > 0 && (
                  <div>
                    <h3 className="text-lg text-gray-900 mb-3">Điểm nổi bật</h3>
                    <ul className="space-y-2">
                      {event.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Music className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organizer info */}
            <Card className="bg-white border-gray-200 shadow-md">
              <CardContent className="p-6">
                <h2 className="text-gray-900 mb-4">Đơn vị tổ chức</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Music className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900">{event.organizer}</h3>
                    <p className="text-gray-600">Đơn vị tổ chức sự kiện uy tín</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Registration */}
          <div className="space-y-6">
            <Card className="bg-white border-gray-200 shadow-md sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-gray-900 mb-4">Tham gia sự kiện</h2>
                
                <div className="text-center mb-6">
                  {!isUserLoggedIn ? (
                    <p className="text-gray-700 mb-4">
                      Đăng nhập để tham gia sự kiện và nhận thông báo cập nhật!
                    </p>
                  ) : hasJoined ? (
                    <div className="p-3 bg-green-50 rounded-lg mb-4">
                      <div className="flex items-center justify-center space-x-2 text-green-700">
                        <Check className="w-5 h-5" />
                        <span>Bạn đã đăng ký tham gia sự kiện này</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 mb-4">
                      Đăng ký ngay để không bỏ lỡ sự kiện tuyệt vời này!
                    </p>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    className={`w-full ${
                      hasJoined 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    } text-white`}
                    onClick={handleJoinEvent}
                    disabled={isJoining || hasJoined}
                  >
                    {isJoining ? (
                      'Đang xử lý...'
                    ) : hasJoined ? (
                      <span className="flex items-center justify-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>Đã tham gia</span>
                      </span>
                    ) : !isUserLoggedIn ? (
                      'Đăng nhập để tham gia'
                    ) : (
                      'Đăng ký tham gia'
                    )}
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-700">
                    {isUserLoggedIn ? (
                      <>
                        ✓ Đăng ký miễn phí và nhanh chóng<br />
                        ✓ Nhận thông tin cập nhật qua email<br />
                        ✓ Theo dõi lịch sử tham gia sự kiện
                      </>
                    ) : (
                      <>
                        ✓ Đăng nhập để tham gia sự kiện<br />
                        ✓ Theo dõi các sự kiện đã tham gia<br />
                        ✓ Nhận thông báo và cập nhật mới nhất
                      </>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
