import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Star, Edit, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Event } from '../data/events'

interface AdminDashboardProps {
  events: Event[]
  onBack: () => void
  onCreateEvent: () => void
  onEditEvent: (eventId: number) => void
  onDeleteEvent: (eventId: number) => void
  onToggleFeatured: (eventId: number) => void
  onLogout: () => void
}

export function AdminDashboard({ 
  events, 
  onBack, 
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onToggleFeatured,
  onLogout
}: AdminDashboardProps) {
  const [filterType, setFilterType] = useState<string>('all')

  const filteredEvents = filterType === 'all' 
    ? events 
    : events.filter(event => event.eventType === filterType)

  const handleDelete = (eventId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      onDeleteEvent(eventId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-purple-600 hover:bg-purple-50"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-gray-900">Quản lý sự kiện</h1>
                <p className="text-sm text-gray-600">Tạo, chỉnh sửa và quản lý sự kiện của bạn</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={onCreateEvent}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo sự kiện mới</span>
              </Button>
              <Button 
                onClick={onLogout}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'CLB', 'Workshop', 'Exe'].map((type) => (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'outline'}
              onClick={() => setFilterType(type)}
              className={filterType === type 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
            >
              {type === 'all' ? 'Tất cả' : type} ({events.filter(e => type === 'all' || e.eventType === type).length})
            </Button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-gray-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng sự kiện</p>
                  <h3 className="text-gray-900 mt-1">{events.length}</h3>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sự kiện nổi bật</p>
                  <h3 className="text-gray-900 mt-1">{events.filter(e => e.featured).length}</h3>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">CLB</p>
                  <h3 className="text-gray-900 mt-1">{events.filter(e => e.eventType === 'CLB').length}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">🎯</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Workshop</p>
                  <h3 className="text-gray-900 mt-1">{events.filter(e => e.eventType === 'Workshop').length}</h3>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">🎓</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card className="bg-white border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900">Danh sách sự kiện</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Không có sự kiện nào
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <ImageWithFallback 
                      src={event.image}
                      alt={event.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-gray-900 truncate">{event.title}</h3>
                          {event.subtitle && (
                            <p className="text-sm text-gray-600 truncate">{event.subtitle}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {event.category || 'Chưa phân loại'}
                            </Badge>
                            <Badge className="text-xs bg-purple-100 text-purple-700">
                              {event.eventType}
                            </Badge>
                            {event.featured && (
                              <Badge className="text-xs bg-yellow-100 text-yellow-700 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                Nổi bật
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>📅 {event.date}</span>
                            <span>👥 {event.attendees.toLocaleString()} quan tâm</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onToggleFeatured(event.id)}
                            className={`border-gray-300 ${
                              event.featured 
                                ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            title={event.featured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                          >
                            <Star className={`w-4 h-4 ${event.featured ? 'fill-current' : ''}`} />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditEvent(event.id)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(event.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
