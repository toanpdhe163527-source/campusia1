import { useState, useRef } from 'react'
import { ArrowLeft, Upload, X, Plus, MapPin, Calendar, Clock, Users, Tag, Link, Image as ImageIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface CreateEventProps {
  onBack: () => void
  onSubmit?: (eventData: any) => Promise<{ success: boolean; message?: string }>
}

export function CreateEvent({ onBack, onSubmit }: CreateEventProps) {
  const [eventImages, setEventImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    eventType: '',
    date: '',
    time: '',
    venue: '',
    location: '',
    organizer: '',
    registrationUrl: '',
    highlights: ['']
  })

  const categories = [
    'Học thuật',
    'Kinh doanh',
    'Phát triển kĩ năng',
    'Giải trí'
  ]

  const eventTypes = [
    'CLB',
    'Workshop',
    'Exe'
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Limit to 10 images total
    const remainingSlots = 10 - eventImages.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    filesToProcess.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chỉ tải lên file ảnh (JPG, PNG, etc.)')
        return
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB')
        return
      }

      // Read file and convert to base64
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setEventImages(prev => [...prev, event.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeImage = (index: number) => {
    setEventImages(eventImages.filter((_, i) => i !== index))
  }

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] })
  }

  const removeHighlight = (index: number) => {
    if (formData.highlights.length > 1) {
      setFormData({ 
        ...formData, 
        highlights: formData.highlights.filter((_, i) => i !== index) 
      })
    }
  }

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.highlights]
    newHighlights[index] = value
    setFormData({ ...formData, highlights: newHighlights })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate that at least one image is uploaded
    if (eventImages.length === 0) {
      alert('Vui lòng tải lên ít nhất một hình ảnh cho sự kiện')
      return
    }
    
    // Prepare event data
    const eventData = {
      ...formData,
      images: eventImages,
      highlights: formData.highlights.filter(h => h.trim() !== '')
    }
    
    // Call API to create event
    if (onSubmit) {
      const result = await onSubmit(eventData)
      if (result.success) {
        alert('Sự kiện đã được tạo thành công!')
      } else {
        alert(result.message || 'Lỗi tạo sự kiện')
      }
    } else {
      console.log('Event Data:', eventData)
      alert('Sự kiện đã được tạo thành công!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-2xl">Tạo sự kiện mới</h1>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-50">
                Lưu nháp
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Xuất bản sự kiện
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card className="bg-white border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center space-x-2">
                    <Tag className="w-5 h-5" />
                    <span>Thông tin cơ bản</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-gray-900">Tên sự kiện *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Nhập tên sự kiện"
                      className="bg-gray-50 border-gray-200 text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subtitle" className="text-gray-900">Tiêu đề phụ</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="Tiêu đề phụ (tùy chọn)"
                      className="bg-gray-50 border-gray-200 text-gray-900"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-gray-900">Danh mục *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
                        <SelectValue placeholder="Chọn danh mục sự kiện" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="text-gray-900">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="eventType" className="text-gray-900">Loại hình *</Label>
                    <Select value={formData.eventType} onValueChange={(value) => setFormData({ ...formData, eventType: value })}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
                        <SelectValue placeholder="Chọn loại hình sự kiện" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-gray-900">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-900">Mô tả sự kiện *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Mô tả chi tiết về sự kiện của bạn..."
                      className="bg-gray-50 border-gray-200 text-gray-900 min-h-32"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-gray-900">Điểm nổi bật</Label>
                    <div className="space-y-3">
                      {formData.highlights.map((highlight, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            value={highlight}
                            onChange={(e) => updateHighlight(index, e.target.value)}
                            placeholder="Nhập điểm nổi bật"
                            className="bg-gray-50 border-gray-200 text-gray-900"
                          />
                          {formData.highlights.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeHighlight(index)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addHighlight}
                        className="border-gray-300 text-gray-900 hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm điểm nổi bật
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Images */}
              <Card className="bg-white border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5" />
                    <span>Hình ảnh sự kiện *</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Image upload hint */}
                    {eventImages.length === 0 && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start space-x-3">
                          <ImageIcon className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="text-purple-900 mb-1">Hình ảnh đầu tiên sẽ là ảnh chính</h4>
                            <p className="text-sm text-purple-700">
                              Ảnh chính sẽ được hiển thị trong danh sách sự kiện, trang chi tiết và carousel trang chủ (nếu được đánh dấu nổi bật)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {eventImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="relative">
                            <ImageWithFallback 
                              src={image}
                              alt={`Event image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                            />
                            {/* Main image badge */}
                            {index === 0 && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-purple-600 text-white text-xs">
                                  Ảnh chính
                                </Badge>
                              </div>
                            )}
                            {/* Remove button */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Upload button - only show if less than 10 images */}
                      {eventImages.length < 10 && (
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-600 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-sm">Tải ảnh lên</span>
                        </button>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• Tải lên tối đa 10 hình ảnh</p>
                      <p>• Định dạng: JPG, PNG, GIF, WebP</p>
                      <p>• Dung lượng tối đa: 5MB/ảnh</p>
                      <p>• Ảnh đầu tiên sẽ là ảnh đại diện chính của sự kiện</p>
                      <p className="text-purple-600">• Đã tải: {eventImages.length}/10 ảnh</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Time */}
              <Card className="bg-white border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Thời gian và địa điểm</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-gray-900">Ngày tổ chức *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="bg-gray-50 border-gray-200 text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-gray-900">Thời gian *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="bg-gray-50 border-gray-200 text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="venue" className="text-gray-900">Tên địa điểm *</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="Ví dụ: Nhà hát Thành phố"
                      className="bg-gray-50 border-gray-200 text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-gray-900">Địa chỉ chi tiết *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Số nhà, tên đường, quận/huyện, thành phố"
                      className="bg-gray-50 border-gray-200 text-gray-900"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Organizer Info */}
              <Card className="bg-white border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Thông tin tổ chức</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="organizer" className="text-gray-900">Đơn vị tổ chức *</Label>
                    <Input
                      id="organizer"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                      placeholder="Tên công ty/tổ chức"
                      className="bg-gray-50 border-gray-200 text-gray-900"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Registration Link */}
              <Card className="bg-white border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center space-x-2">
                    <Link className="w-5 h-5" />
                    <span>Đăng ký sự kiện</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="registrationUrl" className="text-gray-900">Link đăng ký *</Label>
                    <Input
                      id="registrationUrl"
                      value={formData.registrationUrl}
                      onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                      placeholder="https://example.com/register/your-event"
                      type="url"
                      className="bg-gray-50 border-gray-200 text-gray-900"
                      required
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Nhập đường link nơi người dùng có thể đăng ký tham gia sự kiện của bạn.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="text-gray-900 mb-2">💡 Gợi ý:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Sử dụng Google Forms cho form đăng ký đơn giản</li>
                      <li>• Eventbrite, Facebook Events cho quản lý chuyên nghiệp</li>
                      <li>• Website riêng của tổ chức/công ty</li>
                      <li>• Đảm bảo link hoạt động và dễ tiếp cận</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="bg-white border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-900">Xem trước</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-400">
                        Nháp
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hình ảnh:</span>
                      <span className="text-gray-900">{eventImages.length} ảnh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Link đăng ký:</span>
                      <span className="text-gray-900">{formData.registrationUrl ? '✓' : '✗'}</span>
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-200 my-4" />
                  
                  <div className="text-xs text-gray-600">
                    <p className="mb-2">⚠️ Lưu ý:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Cần có ít nhất 1 hình ảnh</li>
                      <li>Sự kiện sẽ được duyệt trong 24h</li>
                      <li>Thông tin cần chính xác và đầy đủ</li>
                      <li>Hình ảnh cần rõ nét và phù hợp</li>
                      <li>Link đăng ký phải hoạt động tốt</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
