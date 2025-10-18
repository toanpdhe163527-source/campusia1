import { Search, User, Globe, Bell } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import logo from 'figma:asset/620bfad20cf1b2ff39b6cfa165a49485c5a89610.png'

export function Header() {
  return (
    <header className="bg-green-500 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Campusia" className="h-8" />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Bạn tìm gì hôm nay?" 
              className="pl-10 bg-white text-black border-0"
            />
            <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 h-8">
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-500 rounded-full">
            Tạo sự kiện
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-green-600">
              <Globe className="w-4 h-4" />
            </Button>
            <span className="text-sm">Việ của tôi</span>
            <span className="text-sm">Đăng nhập | Đăng ký</span>
            <Button variant="ghost" size="icon" className="text-white hover:bg-green-600 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-green-600">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}