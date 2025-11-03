import { Button } from './ui/button'
import { Input } from './ui/input'
import { Search, LogIn, Shield } from 'lucide-react'
import logo from 'figma:asset/620bfad20cf1b2ff39b6cfa165a49485c5a89610.png'

interface NavigationProps {
  onUserLogin?: () => void
  onAdminLogin?: () => void
  onNavigate?: (category: string | null) => void
  onSearchChange?: (query: string) => void
  activeCategory?: string | null
  searchQuery?: string
}

export function Navigation({ 
  onUserLogin,
  onAdminLogin, 
  onNavigate, 
  onSearchChange, 
  activeCategory = null,
  searchQuery = ''
}: NavigationProps) {
  const menuItems = [
    { label: 'Trang chủ', value: null },
    { label: 'CLB', value: 'CLB' },
    { label: 'Workshop', value: 'Workshop' },
    { label: 'Exe', value: 'Exe' }
  ]

  return (
    <nav className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <img src={logo} alt="Campusia" className="h-10" />
            <span className="text-xl font-bold text-gray-900">Campusia</span>
          </div>
          
          {/* Menu Items */}
          <ul className="flex items-center space-x-8">
            {menuItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => onNavigate?.(item.value)}
                  className={`transition-colors duration-200 ${
                    activeCategory === item.value
                      ? 'text-purple-600 font-semibold'
                      : 'text-gray-700 hover:text-purple-600'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Search Bar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-purple-500"
              />
            </div>
            
            {/* User Login Button */}
            <Button 
              onClick={onUserLogin}
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập</span>
            </Button>
            
            {/* Admin Login Button */}
            <Button 
              onClick={onAdminLogin}
              variant="outline"
              className="border-gray-700 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}