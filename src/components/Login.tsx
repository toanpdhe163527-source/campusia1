import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, Calendar } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import logo from 'figma:asset/620bfad20cf1b2ff39b6cfa165a49485c5a89610.png'

interface LoginProps {
  onBack: () => void
  onLogin: (password: string) => Promise<boolean>
}

export function Login({ onBack, onLogin }: LoginProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const correctPassword = 'campusia@12345'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Call login API
    const success = await onLogin(password)
    
    if (!success) {
      setError('Mật khẩu không chính xác. Vui lòng thử lại.')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-gray-700 hover:bg-white/50"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-gray-900 text-xl">Đăng nhập để tạo sự kiện</h1>
        </div>

        {/* Login Card */}
        <Card className="bg-white border-gray-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Campusia" className="h-16" />
            </div>
            <p className="text-gray-600">Đăng nhập để tạo và quản lý sự kiện của bạn</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900">
                  Mật khẩu quản trị
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu quản trị"
                    className="bg-gray-50 border-gray-200 text-gray-900 pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:text-gray-900"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-gray-900 text-sm mb-2">💡 Thông tin đăng nhập:</h4>
                <p className="text-gray-600 text-xs">
                  Chỉ những người có quyền quản trị mới có thể tạo sự kiện mới trên Campusia. 
                  Liên hệ ban quản trị để được cấp quyền truy cập.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Campusia - Nền tảng đặt vé sự kiện hàng đầu Việt Nam
          </p>
        </div>
      </div>
    </div>
  )
}