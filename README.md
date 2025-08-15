# RevAdOps - Ad Revenue Optimization Platform

RevAdOps is a comprehensive ad revenue optimization platform designed to help publishers and app developers maximize their monetization potential through intelligent ad operations and data-driven strategies.

## 🚀 Features

- **Full-Stack Application**: Next.js frontend with Node.js backend
- **Modern Design**: ITAO-inspired clean and professional UI
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Content Management**: Dynamic CMS for easy content updates
- **Ad Operations**: Specialized tools for ad revenue optimization
- **Analytics Dashboard**: Comprehensive reporting and insights
- **SEO Optimized**: Built with SEO best practices

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Cloudinary** - Image management
- **JWT** - Authentication

## 📁 Project Structure

```
RevAdOps/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable React components
│   │   ├── lib/            # Utility functions and API
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema and migrations
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/umerfarooqlaghari/RevAdOps.git
   cd RevAdOps
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   
   Backend (.env):
   ```env
   PORT=5001
   NODE_ENV=development
   DATABASE_URL="your_postgresql_connection_string"
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

   Frontend (.env.local):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. **Database Setup**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

6. **Start Development Servers**
   
   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend (in new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 📱 Pages & Features

### Public Pages
- **Homepage** - Hero section, services overview, testimonials
- **Services** - Detailed service offerings
- **Blog** - Industry insights and updates
- **Contact** - Contact form and information
- **Landing Page** - Conversion-optimized lead capture

### Admin Features
- **Dashboard** - Analytics and overview
- **Content Management** - Edit homepage, about, services
- **Blog Management** - Create, edit, delete blog posts
- **Lead Management** - View and manage leads
- **Media Library** - Upload and manage images

## 🎨 Design System

The design follows ITAO's clean and professional aesthetic with:
- Clean typography and spacing
- Professional color scheme
- Responsive grid layouts
- Smooth animations and transitions
- Modern UI components

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration
- `GET /api/auth/verify` - Token verification

### Content Management
- `GET /api/content/:section` - Get content by section
- `PUT /api/content/:section` - Update section content

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)

### Blog
- `GET /api/blogs` - Get published blogs
- `POST /api/blogs` - Create blog (admin)
- `GET /api/blogs/categories/all` - Get categories

### Leads
- `POST /api/leads` - Submit lead
- `GET /api/leads/admin/all` - Get all leads (admin)

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Backend (Railway/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and inquiries, contact: mumerfarooqlaghari@gmail.com

---

**RevAdOps** - Unlock Your Ad Revenue Potential with Intelligent Ad Operations
