// campusia-backend/src/scripts/seed-database.js
// Script to seed sample data into PostgreSQL database

require('dotenv').config();
const Event = require('../models/Event');

// Sample events data
const sampleEvents = [
  {
    title: "Workshop Kỹ Năng Thuyết Trình",
    subtitle: "Nâng cao khả năng trình bày trước đám đông",
    description: "Workshop giúp bạn tự tin thuyết trình và giao tiếp hiệu quả trong môi trường học thuật và công việc.",
    date: "2025-02-15",
    time: "14:00 - 17:00",
    location: "TP. Hồ Chí Minh",
    venue: "Hội trường A - Trường Đại học",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
    images: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
    ],
    category: "Phát triển kĩ năng",
    eventType: "Workshop",
    organizer: "CLB Kỹ Năng Mềm",
    rating: 4.8,
    attendees: 120,
    highlights: [
      "Luyện tập thực hành thuyết trình",
      "Feedback từ chuyên gia",
      "Kỹ thuật xử lý stress",
      "Certificate hoàn thành"
    ],
    registrationUrl: "https://forms.gle/example1",
    featured: true
  },
  {
    title: "Hội Thảo Khởi Nghiệp 2025",
    subtitle: "Từ ý tưởng đến thực tế kinh doanh",
    description: "Sự kiện quy tụ các founder, investor và mentor chia sẻ kinh nghiệm khởi nghiệp thành công.",
    date: "2025-03-01",
    time: "09:00 - 18:00",
    location: "Hà Nội",
    venue: "Innovation Hub",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
    images: [
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800"
    ],
    category: "Kinh doanh",
    eventType: "Exe",
    organizer: "Startup Vietnam",
    rating: 4.9,
    attendees: 300,
    highlights: [
      "Gặp gỡ investors",
      "Networking session",
      "Case study thực tế",
      "Pitch competition"
    ],
    registrationUrl: "https://forms.gle/example2",
    featured: true
  },
  {
    title: "CLB Lập Trình AI - Buổi Kick-off",
    subtitle: "Khám phá Machine Learning cơ bản",
    description: "Buổi gặp mặt đầu tiên của CLB, giới thiệu roadmap học AI và các dự án sắp tới.",
    date: "2025-02-10",
    time: "18:00 - 20:00",
    location: "TP. Hồ Chí Minh",
    venue: "Phòng Lab A301",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800",
    images: [
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800"
    ],
    category: "Học thuật",
    eventType: "CLB",
    organizer: "CLB AI & Data Science",
    rating: 4.7,
    attendees: 80,
    highlights: [
      "Giới thiệu Python basics",
      "Demo ML models",
      "Q&A với seniors",
      "Đăng ký tham gia CLB"
    ],
    registrationUrl: "https://forms.gle/example3",
    featured: false
  },
  {
    title: "Đêm Nhạc Acoustic Sinh Viên",
    subtitle: "Chill cùng âm nhạc và bạn bè",
    description: "Đêm nhạc acoustic với các ca sĩ sinh viên tài năng, không gian ấm cúng và thân thiện.",
    date: "2025-02-20",
    time: "19:00 - 22:00",
    location: "Đà Nẵng",
    venue: "The Coffee House - Ngũ Hành Sơn",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    images: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800"
    ],
    category: "Giải trí",
    eventType: "Exe",
    organizer: "CLB Âm Nhạc",
    rating: 4.6,
    attendees: 150,
    highlights: [
      "Live performance",
      "Open mic session",
      "Free drinks",
      "Networking chill"
    ],
    registrationUrl: "https://forms.gle/example4",
    featured: false
  },
  {
    title: "Workshop Thiết Kế UI/UX",
    subtitle: "Từ wireframe đến prototype",
    description: "Học cách thiết kế giao diện người dùng chuyên nghiệp với Figma và các công cụ hiện đại.",
    date: "2025-02-25",
    time: "13:00 - 17:00",
    location: "TP. Hồ Chí Minh",
    venue: "Co-working Space The Hive",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800",
    images: [
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800"
    ],
    category: "Phát triển kĩ năng",
    eventType: "Workshop",
    organizer: "Design Community Vietnam",
    rating: 4.9,
    attendees: 60,
    highlights: [
      "Hands-on Figma",
      "Portfolio review",
      "Design thinking process",
      "Industry insights"
    ],
    registrationUrl: "https://forms.gle/example5",
    featured: true
  }
];

// Seed function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    for (const eventData of sampleEvents) {
      const event = await Event.create(eventData);
      console.log(`✅ Created: ${event.title} (ID: ${event.id})`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Total events created: ${sampleEvents.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding complete, exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
