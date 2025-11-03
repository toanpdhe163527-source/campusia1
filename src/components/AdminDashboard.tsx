import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash2, Star, Edit, LogOut, Users, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Event } from '../data/events'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import * as api from '../utils/api'

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
  const [users, setUsers] = useState<any[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userEvents, setUserEvents] = useState<any[]>([])
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)

  const filteredEvents = filterType === 'all' 
    ? events 
    : events.filter(event => event.eventType === filterType)

  // Load users on mount
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoadingUsers(true)
    const result = await api.getAllUsers()
    if (result.success) {
      setUsers(result.users || [])
      setTotalUsers(result.total || 0)
    }
    setLoadingUsers(false)
  }

  const handleViewUserDetails = async (user: any) => {
    setSelectedUser(user)
    setShowUserDialog(true)
    
    // Load user's participated events
    const result = await api.getUserParticipation(user.id)
    if (result.success) {
      setUserEvents(result.events || [])
    }
  }

  const handleDelete = (eventId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      onDeleteEvent(eventId)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa có'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
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
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Quản lý sự kiện
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Quản lý thành viên
            </TabsTrigger>
          </TabsList>

          {/* Events Management Tab */}
          <TabsContent value="events">
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
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-white border-gray-200 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tổng thành viên</p>
                      <h3 className="text-gray-900 mt-1">{totalUsers}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Thành viên mới (7 ngày)</p>
                      <h3 className="text-gray-900 mt-1">
                        {users.filter(u => {
                          const created = new Date(u.created_at)
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return created > weekAgo
                        }).length}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600">🎉</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Thành viên hoạt động</p>
                      <h3 className="text-gray-900 mt-1">
                        {users.filter(u => parseInt(u.events_count) > 0).length}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users List */}
            <Card className="bg-white border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-900">Danh sách thành viên</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Chưa có thành viên nào
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-4 text-gray-900">Tên</th>
                          <th className="text-left p-4 text-gray-900">Email</th>
                          <th className="text-left p-4 text-gray-900">Sự kiện tham gia</th>
                          <th className="text-left p-4 text-gray-900">Ngày đăng ký</th>
                          <th className="text-left p-4 text-gray-900">Lần đăng nhập cuối</th>
                          <th className="text-left p-4 text-gray-900">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-4 text-gray-900">{user.name}</td>
                            <td className="p-4 text-gray-600">{user.email}</td>
                            <td className="p-4">
                              <Badge className="bg-purple-100 text-purple-700">
                                {user.events_count || 0} sự kiện
                              </Badge>
                            </td>
                            <td className="p-4 text-gray-600 text-sm">
                              {formatDate(user.created_at)}
                            </td>
                            <td className="p-4 text-gray-600 text-sm">
                              {formatDate(user.last_login)}
                            </td>
                            <td className="p-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewUserDetails(user)}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                Xem chi tiết
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Chi tiết thành viên</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tên</p>
                  <p className="text-gray-900 mt-1">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900 mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày đăng ký</p>
                  <p className="text-gray-900 mt-1">{formatDate(selectedUser.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lần đăng nhập cuối</p>
                  <p className="text-gray-900 mt-1">{formatDate(selectedUser.last_login)}</p>
                </div>
              </div>

              {/* Participated Events */}
              <div>
                <h4 className="text-gray-900 mb-4">Sự kiện đã tham gia ({userEvents.length})</h4>
                {userEvents.length === 0 ? (
                  <p className="text-gray-500 text-sm">Chưa tham gia sự kiện nào</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {userEvents.map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="text-gray-900">{event.title}</h5>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span>📅 {event.date}</span>
                              <Badge className="text-xs bg-purple-100 text-purple-700">
                                {event.event_type}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Tham gia lúc:</p>
                            <p className="text-xs text-gray-900 mt-1">{formatDate(event.joined_at)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
