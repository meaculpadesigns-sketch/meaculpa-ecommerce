# Mea Culpa E-Commerce Website

Modern, Apple-inspired e-commerce platform for Mea Culpa brand - traditional Eastern textiles with contemporary design.

## 🌟 Features

- **Modern UI/UX**: Apple.com-inspired design with smooth animations
- **Multi-language**: Turkish & English support (i18next)
- **E-commerce**: Full shopping cart, checkout, order management
- **AI Integration**: Gemini AI for virtual try-on and mockup generation
- **Admin Panel**: Complete management dashboard
- **Firebase Backend**: Authentication, Firestore database, Storage
- **Payment Integration**: iyzico payment gateway ready
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router & Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Google Gemini API
- **Payment**: iyzico (ready for integration)
- **Deployment**: Vercel

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Site URL
NEXT_PUBLIC_SITE_URL=https://www.meaculpadesign.com
```

## 📱 Contact

- **Email**: meaculpadesigns@gmail.com
- **Phone**: +90 507 562 08 02
- **Instagram**: [@meaculpadesigns](https://www.instagram.com/meaculpadesigns)
- **Address**: Yurt mah. 71329 sk. Erkam Apt. Kat: 8 No: 16 Çukurova/ADANA

## 📄 License

© 2025 Mea Culpa. All rights reserved.

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/meaculpa-ecommerce)
