export interface Event {
  id: number
  title: string
  subtitle?: string
  description: string
  date: string
  time: string
  location: string
  venue: string
  image: string
  category?: string // Học thuật, Kinh doanh, Phát triển kĩ năng, Giải trí
  eventType?: string // CLB, Workshop, Exe
  organizer: string
  rating: number
  attendees: number
  highlights: string[]
  registrationUrl: string
  featured?: boolean // Hiển thị ở hero carousel
}

export let eventsData: Event[] = [
  {
    id: 1,
    title: "2025 HỒ CHÍ MINH",
    subtitle: "Đại nhạc hội âm thanh độc đáo",
    description: "Một sự kiện âm nhạc đặc biệt với sự tham gia của các nghệ sĩ hàng đầu Việt Nam và quốc tế. Trải nghiệm âm thanh vượt trội với công nghệ sân khấu hiện đại nhất. Hòa mình vào không gian âm nhạc sống động với những tiết mục biểu diễn ấn tượng, mang đến cho khán giả những phút giây thăng hoa cùng âm nhạc.",
    date: "15.11 - 16.11.2025",
    time: "15:00 - 22:00",
    location: "Thành phố Hồ Chí Minh",
    venue: "VĂN PHÒNG CITY",
    image: "https://images.unsplash.com/photo-1724285828991-e996e9cb8503?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBjb2xvcmZ1bCUyMGxpZ2h0c3xlbnwxfHx8fDE3NTg4Nzc0ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Giải trí",
    eventType: "CLB",
    organizer: "Music Entertainment Co.",
    rating: 4.8,
    attendees: 15420,
    highlights: [
      "Lineup nghệ sĩ hàng đầu Việt Nam và quốc tế",
      "Công nghệ âm thanh và ánh sáng hiện đại",
      "Khu vực ẩm thực đa dạng",
      "Hoạt động tương tác và trải nghiệm",
      "An ninh và an toàn tuyệt đối"
    ],
    registrationUrl: "https://example.com/register/2025-ho-chi-minh-festival",
    featured: true
  },
  {
    id: 2,
    title: "VSTRA",
    subtitle: "Những thăng trầm của dòng nhạc tưởng",
    description: "Một đêm nhạc đặc biệt dành cho những tâm hồn yêu nhạc cổ điển và hiện đại. VSTRA mang đến những giai điệu du dương, sâu lắng với sự kết hợp tinh tế giữa nhạc cụ truyền thống và hiện đại. Đây là cơ hội để khán giả thưởng thức âm nhạc trong không gian lãng mạn và đầy cảm xúc.",
    date: "07.12.2025",
    time: "20:00",
    location: "Outdoor Venue",
    venue: "OUTDOOR THEATER",
    image: "https://images.unsplash.com/photo-1549047266-8d18e5f0e064?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXN0aXZhbCUyMHN0YWdlJTIwdmVudWV8ZW58MXx8fHwxNzU4ODc4MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Phát triển kĩ năng",
    eventType: "Workshop",
    organizer: "Classical Music Society",
    rating: 4.9,
    attendees: 8750,
    highlights: [
      "Dàn nhạc giao hưởng chuyên nghiệp",
      "Không gian ngoài trời lãng mạn",
      "Âm thanh acoustics tự nhiên",
      "Chương trình đa dạng từ cổ điển đến hiện đại",
      "Trải nghiệm văn hóa độc đáo"
    ],
    registrationUrl: "https://example.com/register/vstra-concert",
    featured: true
  },
  {
    id: 3,
    title: "LẠC DƯƠNG YANGHỞ",
    subtitle: "Traditional Music Festival",
    description: "Lễ hội âm nhạc truyền thống độc đáo tôn vinh nền văn hóa dân tộc. Sự kiện mang đến những giai điệu truyền thống được kết hợp tinh tế với âm nhạc hiện đại, tạo nên một không gian văn hóa đậm đà bản sắc Việt Nam. Đây là dịp để mọi người cùng nhau khám phá và trân trọng giá trị văn hóa truyền thống.",
    date: "22.06.2025",
    time: "19:00",
    location: "Lạc Dương, Đà Lạt",
    venue: "Trung tâm Văn hóa Lạc Dương",
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwY3Jvd2R8ZW58MXx8fHwxNzU4ODU5OTg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Học thuật",
    eventType: "Exe",
    organizer: "Lạc Dương Cultural Center",
    rating: 4.7,
    attendees: 5200,
    highlights: [
      "Nghệ sĩ dân tộc nổi tiếng",
      "Biểu diễn nhạc cụ truyền thống",
      "Không gian văn hóa đậm đà",
      "Ẩm thực địa phương đặc sắc",
      "Hoạt động trải nghiệm văn hóa"
    ],
    registrationUrl: "https://example.com/register/lac-duong-yanghoo-festival",
    featured: false
  },
  {
    id: 4,
    title: "MIURE QUE SANG",
    subtitle: "Young Star Orchestra Vietnam Live Concert",
    description: "Đêm nhạc đặc biệt của dàn nhạc trẻ tài năng nhất Việt Nam. Những gương mặt nghệ sĩ trẻ triển vọng sẽ mang đến những tiết mục âm nhạc đa dạng từ pop, rock đến jazz. Đây là cơ hội để khán giả được thưởng thức tài năng của thế hệ nghệ sĩ mới và cảm nhận sự năng động, sáng tạo trong âm nhạc.",
    date: "28.06.2025",
    time: "20:30",
    location: "TP.HCM",
    venue: "Nhà hát Thành phố",
    image: "https://images.unsplash.com/photo-1656369895489-e24a2d0816e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NTg3OTI3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Kinh doanh",
    eventType: "CLB",
    organizer: "Young Star Entertainment",
    rating: 4.6,
    attendees: 7800,
    highlights: [
      "Dàn nhạc trẻ tài năng",
      "Repertoire đa dạng và hiện đại",
      "Tương tác với khán giả",
      "Không gian nhà hát sang trọng",
      "Âm thanh chất lượng cao"
    ],
    registrationUrl: "https://example.com/register/miure-que-sang-concert",
    featured: false
  },
  {
    id: 5,
    title: "TẤT",
    subtitle: "Live Concert Series",
    description: "Series concert đặc biệt với sự tham gia của nhiều nghệ sĩ nổi tiếng. TẤT mang đến một đêm nhạc đa sắc màu với những thể loại âm nhạc khác nhau, từ ballad nhẹ nhàng đến rock sôi động. Mỗi tiết mục là một câu chuyện, mỗi giai điệu là một cảm xúc, tạo nên một trải nghiệm âm nhạc không thể quên.",
    date: "05.07.2025",
    time: "19:30",
    location: "Hà Nội",
    venue: "Cung Văn hóa Hữu nghị",
    image: "https://images.unsplash.com/photo-1737107917840-ea155fb60498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwdmVudWUlMjBsaWdodHN8ZW58MXx8fHwxNzU4ODc3NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Phát triển kĩ năng",
    eventType: "Workshop",
    organizer: "Live Music Productions",
    rating: 4.8,
    attendees: 12350,
    highlights: [
      "Lineup nghệ sĩ đa dạng",
      "Chất lượng âm thanh và ánh sáng tối ưu",
      "Tương tác đặc biệt với fan",
      "Merchandise độc quyền",
      "Trải nghiệm concert đáng nhớ"
    ],
    registrationUrl: "https://example.com/register/tat-concert-series",
    featured: true
  }
]

// Helper functions for event management
export const addEvent = (event: Event) => {
  eventsData = [...eventsData, event]
}

export const deleteEvent = (eventId: number) => {
  eventsData = eventsData.filter(event => event.id !== eventId)
}

export const toggleFeatured = (eventId: number) => {
  eventsData = eventsData.map(event => 
    event.id === eventId ? { ...event, featured: !event.featured } : event
  )
}

export const updateEvent = (updatedEvent: Event) => {
  eventsData = eventsData.map(event => 
    event.id === updatedEvent.id ? updatedEvent : event
  )
}