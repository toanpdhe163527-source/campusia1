import { ArrowLeft, Calendar, Clock, MapPin, Share2, Heart, Star, Users, Music } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'
import { ImageWithFallback } from './figma/ImageWithFallback'

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
}

export function EventDetail({ event, onBack }: EventDetailProps) {
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
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">4.8 ⭐ (2,847 đánh giá)</span>
                      <span className="text-sm text-gray-600">156 sự kiện đã tổ chức</span>
                    </div>
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
                  <p className="text-gray-700 mb-4">
                    Đăng ký ngay để không bỏ lỡ sự kiện tuyệt vời này!
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => window.open(event.registrationUrl, '_blank')}
                  >
                    Đăng ký tham gia
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                    Chia sẻ sự kiện
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-700">
                    ✓ Đăng ký miễn phí và nhanh chóng<br />
                    ✓ Nhận thông tin cập nhật qua email<br />
                    ✓ Hỗ trợ 24/7 nếu có thắc mắc
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
