import { ImageWithFallback } from './figma/ImageWithFallback'

interface EventCardProps {
  id: number
  image: string
  title: string
  subtitle?: string
  date?: string
  location?: string
  category?: string
  onClick?: (id: number) => void
}

export function EventCard({ id, image, title, subtitle, date, location, category, onClick }: EventCardProps) {
  return (
    <div 
      className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={() => onClick?.(id)}
    >
      <div className="relative">
        <ImageWithFallback 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        {category && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
            {category}
          </div>
        )}
        {date && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {date}
          </div>
        )}
      </div>
      <div className="p-4 text-white">
        <h3 className="font-semibold mb-1 line-clamp-2">{title}</h3>
        {subtitle && (
          <p className="text-gray-400 text-sm mb-2 line-clamp-1">{subtitle}</p>
        )}
        {location && (
          <p className="text-gray-500 text-xs">{location}</p>
        )}
      </div>
    </div>
  )
}