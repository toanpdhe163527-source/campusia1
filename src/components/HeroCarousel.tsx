import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { Event } from '../data/events'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface HeroCarouselProps {
  events: Event[]
  onEventClick: (eventId: number) => void
}

export function HeroCarousel({ events, onEventClick }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Filter only featured events
  const featuredEvents = events.filter(event => event.featured === true)

  // Reset currentSlide if it exceeds the number of featured events
  useEffect(() => {
    if (currentSlide >= featuredEvents.length && featuredEvents.length > 0) {
      setCurrentSlide(0)
    }
  }, [featuredEvents.length, currentSlide])

  const slides = featuredEvents.map(event => ({
    id: event.id,
    title: event.title,
    subtitle: event.subtitle || '',
    date: event.date,
    time: event.time,
    location: event.venue,
    image: event.image,
    buttonText: "Xem Chi tiết"
  }))

  // Show placeholder if no featured events
  if (slides.length === 0) {
    return (
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-purple-800">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-white z-10">
            <h2 className="text-6xl font-bold mb-4">Campusia</h2>
            <p className="text-xl">Khám phá các sự kiện đặc biệt</p>
          </div>
        </div>
      </div>
    )
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-[500px] overflow-hidden bg-gray-100">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className="min-w-full h-full flex items-center justify-center relative px-4 md:px-8 lg:px-16"
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-purple-800/20" />
            
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border-4 border-purple-600 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-pink-600 rounded-lg rotate-45"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-purple-600 rounded-full"></div>
            </div>

            {/* Main content container */}
            <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Image frame */}
              <div className="order-2 md:order-1">
                <div className="relative group">
                  {/* Decorative frame border */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl opacity-75 blur-xl group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Image container */}
                  <div className="relative bg-white p-2 rounded-xl shadow-2xl">
                    <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                      <ImageWithFallback 
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Image overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="order-1 md:order-2 text-center md:text-left space-y-4 mb-8 md:mb-0">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">{slide.title}</h2>
                <h3 className="text-xl md:text-2xl text-gray-700">{slide.subtitle}</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="text-lg">{slide.date}</div>
                  <div className="text-lg">{slide.time}</div>
                  <div className="text-lg">{slide.location}</div>
                </div>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg mt-4"
                  onClick={() => onEventClick(slide.id)}
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows - only show if there are multiple slides */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-900 bg-white/80 hover:bg-white shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 bg-white/80 hover:bg-white shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-purple-600' : 'bg-purple-600/30'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
