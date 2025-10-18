import { EventCard } from './EventCard'
import { ChevronRight } from 'lucide-react'
import { Event } from '../data/events'

interface SpecialEventsProps {
  events: Event[]
  onEventClick: (eventId: number) => void
  title?: string
}

export function SpecialEvents({ events, onEventClick, title = "Sự kiện đặc biệt" }: SpecialEventsProps) {
  if (events.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="relative inline-block">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent font-bold">
              {title}
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full"></div>
            <div className="absolute -top-1 -left-2 w-8 h-8 border-2 border-purple-600 rounded-full opacity-30"></div>
            <div className="absolute -bottom-1 -right-2 w-6 h-6 border-2 border-pink-600 rounded-lg rotate-45 opacity-30"></div>
          </h2>
          <ChevronRight className="text-gray-900 w-6 h-6" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              id={event.id}
              image={event.image}
              title={event.title}
              subtitle={event.subtitle}
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