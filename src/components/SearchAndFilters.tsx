import { useState } from 'react'
import { Search, Filter, X, Calendar, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar as CalendarComponent } from './ui/calendar'
import { Slider } from './ui/slider'
import { Checkbox } from './ui/checkbox'
import { Separator } from './ui/separator'

export interface FilterState {
  searchQuery: string
  categories: string[]
  dateRange: {
    from?: Date
    to?: Date
  }
  priceRange: [number, number]
  locations: string[]
  sortBy: string
}

interface SearchAndFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  eventCount: number
}

export function SearchAndFilters({ filters, onFiltersChange, onClearFilters, eventCount }: SearchAndFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const categories = [
    'Học thuật',
    'Kinh doanh',
    'Phát triển kĩ năng',
    'Giải trí'
  ]

  const sortOptions = [
    { value: 'date', label: 'Ngày diễn ra' },
    { value: 'popularity', label: 'Phổ biến nhất' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'name', label: 'Tên A-Z' }
  ]

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value })
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    onFiltersChange({ ...filters, categories: newCategories })
  }



  const handlePriceRangeChange = (values: number[]) => {
    onFiltersChange({ ...filters, priceRange: [values[0], values[1]] })
  }

  const handleSortChange = (value: string) => {
    onFiltersChange({ ...filters, sortBy: value })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.searchQuery) count++
    if (filters.categories.length > 0) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    return count
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-gray-900 mb-3 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Danh mục
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <label
                htmlFor={`category-${category}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-200" />

      {/* Date Range */}
      <div>
        <h3 className="text-gray-900 mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Thời gian
        </h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-white border-gray-300 text-gray-900"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {filters.dateRange.from ? (
                filters.dateRange.to ? (
                  <>
                    {filters.dateRange.from.toLocaleDateString('vi-VN')} -{' '}
                    {filters.dateRange.to.toLocaleDateString('vi-VN')}
                  </>
                ) : (
                  filters.dateRange.from.toLocaleDateString('vi-VN')
                )
              ) : (
                'Chọn ngày'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white border-gray-200" align="start">
            <CalendarComponent
              mode="range"
              selected={{
                from: filters.dateRange.from,
                to: filters.dateRange.to,
              }}
              onSelect={(range) =>
                onFiltersChange({
                  ...filters,
                  dateRange: { from: range?.from, to: range?.to }
                })
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Left side - Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden bg-white border-gray-300 text-gray-900"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Bộ lọc
              {getActiveFiltersCount() > 0 && (
                <Badge className="ml-2 bg-purple-600 text-white">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-white border-gray-300 text-gray-900">
                    <Filter className="w-4 h-4 mr-2" />
                    Danh mục
                    {filters.categories.length > 0 && (
                      <Badge className="ml-2 bg-purple-600 text-white">
                        {filters.categories.length}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-white border-gray-200 p-4">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`desktop-category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <label
                          htmlFor={`desktop-category-${category}`}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-white border-gray-300 text-gray-900">
                    <Calendar className="w-4 h-4 mr-2" />
                    Thời gian
                    {(filters.dateRange.from || filters.dateRange.to) && (
                      <Badge className="ml-2 bg-purple-600 text-white">1</Badge>
                    )}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border-gray-200" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: filters.dateRange.from,
                      to: filters.dateRange.to,
                    }}
                    onSelect={(range) =>
                      onFiltersChange({
                        ...filters,
                        dateRange: { from: range?.from, to: range?.to }
                      })
                    }
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="ghost"
                  onClick={onClearFilters}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          {/* Right side - Sort and Results */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <span>{eventCount} sự kiện</span>
            </div>
            
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full lg:w-48 bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-gray-900">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.searchQuery && (
              <Badge variant="secondary" className="bg-gray-200 text-gray-900">
                Tìm kiếm: "{filters.searchQuery}"
                <button
                  onClick={() => handleSearchChange('')}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {filters.categories.map((category) => (
              <Badge key={category} variant="secondary" className="bg-purple-100 text-purple-900">
                {category}
                <button
                  onClick={() => handleCategoryToggle(category)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            
            {(filters.dateRange.from || filters.dateRange.to) && (
              <Badge variant="secondary" className="bg-pink-100 text-pink-900">
                {filters.dateRange.from && filters.dateRange.to
                  ? `${filters.dateRange.from.toLocaleDateString('vi-VN')} - ${filters.dateRange.to.toLocaleDateString('vi-VN')}`
                  : filters.dateRange.from
                  ? `Từ ${filters.dateRange.from.toLocaleDateString('vi-VN')}`
                  : `Đến ${filters.dateRange.to?.toLocaleDateString('vi-VN')}`
                }
                <button
                  onClick={() => onFiltersChange({ ...filters, dateRange: {} })}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Mobile Filters Panel */}
        {showMobileFilters && (
          <div className="lg:hidden mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-900">Bộ lọc</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <FilterContent />
            <div className="mt-6 flex gap-3">
              <Button
                onClick={onClearFilters}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-900"
              >
                Xóa bộ lọc
              </Button>
              <Button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Áp dụng
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}