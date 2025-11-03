import { EventCard } from './EventCard'
import { ChevronRight } from 'lucide-react'
import { Event } from '../data/events'

interface SpecialEventsProps {
  events: Event[]
  onEventClick: (eventId: number) => void
  title?: string
}

export function SpecialEvents({
  events,
  onEventClick,
  title = 'Sự kiện đặc biệt',
}: SpecialEventsProps) {
  if (events.length === 0) {
    return null
  }

  return (
    <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="relative inline-block">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent font-extrabold text-2xl tracking-tight">
              {title}
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full"></div>
            <div className="absolute -top-1 -left-2 w-8 h-8 border-2 border-purple-600 rounded-full opacity-30"></div>
            <div className="absolute -bottom-1 -right-2 w-6 h-6 border-2 border-pink-600 rounded-lg rotate-45 opacity-30"></div>
          </h2>

          <div className="flex items-center gap-1 text-purple-700 hover:text-pink-600 transition cursor-pointer">
            <span className="font-medium">Xem thêm</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>

        {/* Grid hiển thị các EventCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              image={event.image}
              title={event.title}
              subtitle={event.subtitle} // ✅ đảm bảo truyền subtitle
              date={event.date}
              location={event.location}
              category={event.category}
              onClick={onEventClick}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
