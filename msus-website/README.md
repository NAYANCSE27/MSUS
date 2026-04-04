# MSUS - Mohammadpur Samaj Unnayan Sangathan Website

A complete, production-ready full-stack website for the social organization "Mohammadpur Samaj Unnayan Sangathan" (মোহাম্মদপুর সমাজ উন্নয়ন সংগঠন).

## 🏢 Organization

**Name:** Mohammadpur Samaj Unnayan Sangathan (মোহাম্মদপুর সমাজ উন্নয়ন সংগঠন)  
**Location:** Mohammadpur, Ulchapara, Brahmanbaria  
**Type:** Non-profit Social Development Organization

## 🎯 Features

### Core Modules
- 🏠 **Homepage** - Hero section, statistics, featured activities
- 📖 **About Us** - History, mission, vision, leadership
- 🧑‍🤝‍🧑 **Member Management** - Registration, profiles, role-based access
- 💰 **Donation System** - Online donations with Stripe/bKash integration
- 📅 **Events & Activities** - Event creation, registration, gallery
- 📚 **Activity Modules:**
  - 🎓 Education Support
  - 🏥 Healthcare & Medical Support
  - 📢 Social Awareness
  - 📚 Library System
  - ⚽ Sports & Cultural Activities
  - 🚫 Anti-Drug Campaign
  - 🏗️ Infrastructure Development
  - 🤝 Humanitarian Aid
- 📰 **Blog/News** - Admin posts, categories, comments
- 🖼️ **Gallery** - Image & video gallery
- 📩 **Contact System** - Contact forms, maps, email notifications
- ⚙️ **Admin Dashboard** - Complete CMS with analytics

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** React Context + Hooks
- **HTTP Client:** Axios
- **Animation:** Framer Motion

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcryptjs, helmet, cors, express-rate-limit
- **File Upload:** multer
- **Email:** nodemailer

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway/Render/DigitalOcean
- **Database:** MongoDB Atlas
- **Storage:** Cloudinary (for images)

## 📁 Project Structure

```
msus-website/
├── frontend/          # Next.js application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── lib/          # Utilities
│   └── public/       # Static assets
├── backend/           # Express API
│   ├── controllers/   # Route controllers
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── utils/         # Utility functions
├── database/          # Schemas & seed data
└── docs/             # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and setup:**
```bash
git clone <repository-url>
cd msus-website
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

4. **Environment Setup:**
```bash
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/msus
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=30d
NODE_ENV=development

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

5. **Run the application:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Seed the database (optional):**
```bash
cd backend
npm run seed
```

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update` - Update profile

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `PUT /api/members/:id/approve` - Approve member (Admin)
- `PUT /api/members/:id/role` - Update member role (Admin)

### Donations
- `POST /api/donations` - Create donation
- `GET /api/donations` - Get all donations (Admin)
- `GET /api/donations/public` - Get public donor list
- `GET /api/donations/stats` - Get donation statistics

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (Admin)
- `PUT /api/events/:id` - Update event (Admin)
- `DELETE /api/events/:id` - Delete event (Admin)
- `POST /api/events/:id/register` - Register for event

### Blog/News
- `GET /api/posts` - Get all posts
- `GET /api/posts/:slug` - Get post by slug
- `POST /api/posts` - Create post (Admin)
- `PUT /api/posts/:id` - Update post (Admin)
- `DELETE /api/posts/:id` - Delete post (Admin)

### Activity Modules
- `GET /api/modules/:type` - Get module by type
- `PUT /api/modules/:type` - Update module (Admin)
- `POST /api/modules/:type/projects` - Add project (Admin)

### Gallery
- `GET /api/gallery` - Get all gallery items
- `POST /api/gallery` - Upload image (Admin)
- `DELETE /api/gallery/:id` - Delete image (Admin)

### Contact
- `POST /api/contact` - Send contact message
- `GET /api/contact` - Get all messages (Admin)

## 🔐 User Roles

1. **Super Admin** - Full system access
2. **Admin** - Content management, member approval
3. **Volunteer** - Limited content creation
4. **Member** - Basic access, profile management

## 🎨 Design System

### Colors
- Primary: `#16a34a` (Green-600)
- Secondary: `#15803d` (Green-700)
- Accent: `#fbbf24` (Amber-400)
- Background: `#f8fafc` (Slate-50)
- Text: `#1e293b` (Slate-800)

### Typography
- Headings: Inter, sans-serif
- Body: Inter, sans-serif

## 📄 License

This project is proprietary and developed for Mohammadpur Samaj Unnayan Sangathan.

## 🤝 Support

For support, email: info@msus.org.bd or contact the development team.

---

**Developed with ❤️ for Mohammadpur Samaj Unnayan Sangathan**
