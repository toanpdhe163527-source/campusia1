import { useState } from 'react'
import { ArrowLeft, Mail, User as UserIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import logo from 'figma:asset/620bfad20cf1b2ff39b6cfa165a49485c5a89610.png'

interface UserLoginProps {
  onBack: () => void
  onLogin: (email: string) => Promise<{ success: boolean; message?: string }>
  onRegister: (name: string, email: string) => Promise<{ success: boolean; message?: string }>
}

export function UserLogin({ onBack, onLogin, onRegister }: UserLoginProps) {
  const [loginEmail, setLoginEmail] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await onLogin(loginEmail)
    
    if (!result.success) {
      setError(result.message || 'Đăng nhập thất bại')
    }
    
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await onRegister(registerName, registerEmail)
    
    if (!result.success) {
      setError(result.message || 'Đăng ký thất bại')
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
          <h1 className="text-gray-900 text-xl">Tham gia Campusia</h1>
        </div>

        {/* Login/Register Card */}
        <Card className="bg-white border-gray-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Campusia" className="h-16" />
            </div>
            <p className="text-gray-600">Đăng nhập hoặc đăng ký để tham gia các sự kiện</p>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-900">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                        className="bg-gray-50 border-gray-200 text-gray-900 pl-10"
                        required
                      />
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
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-gray-900">
                      Họ và tên
                    </Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Nhập họ và tên"
                        className="bg-gray-50 border-gray-200 text-gray-900 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-900">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                        className="bg-gray-50 border-gray-200 text-gray-900 pl-10"
                        required
                      />
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
                    {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-gray-900 text-sm mb-2">💡 Thông tin:</h4>
                <p className="text-gray-600 text-xs">
                  Đăng nhập để tham gia các sự kiện và theo dõi lịch sử tham gia của bạn. 
                  Không cần mật khẩu, chỉ cần email!
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
