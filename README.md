# Academic & Research Portfolio Website

A modern, responsive, and full-stack academic portfolio website designed for a doctoral physics researcher. Built with React, Express, MongoDB Atlas, and ImageKit.

---

## Architecture Overview

```
├── client/              # React 19 + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── api/         # Axios client and centralized API services
│   │   ├── components/  # Layout, common cards, UI controls, admin panels
│   │   ├── context/     # AuthContext and ThemeContext
│   │   └── pages/       # Public and protected admin pages
│   └── vercel.json      # Vercel SPA routing configuration
│
└── server/              # Node.js + Express 5.x REST API
    ├── config/          # MongoDB Atlas & ImageKit SDK configs
    ├── controllers/     # Modular business logic controllers
    ├── middleware/      # JWT auth, Multer upload & error handlers
    ├── models/          # Mongoose data schemas
    └── routes/          # API route definitions (/api/*)
```

---

## Tech Stack

### Frontend
* **Framework:** React 19 with Vite
* **Styling:** Tailwind CSS with Dark/Light theme switching
* **Routing:** React Router v7 with global scroll restoration
* **Icons:** Lucide React
* **HTTP Client:** Axios with JWT request interceptor

### Backend
* **Runtime & Framework:** Node.js & Express 5.x
* **Database & ODM:** MongoDB Atlas with Mongoose 9.x
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs password hashing
* **File Uploads:** Multer (memory storage) & ImageKit Node SDK

---

## Key Features

1. **Public Scholarly Showcase**
   * **Home:** Profile hero with dynamic researcher branding, research highlights, selected publications, recent talks, and awards.
   * **About:** Full academic biography, key research focus tags, 4-tier education timeline, and institutional affiliations.
   * **Research:** Core investigation areas (Thin-film magnetism, Spintronics, Interface-driven magnetic phenomena).
   * **Publications:** Peer-reviewed journal publications with live search and year filtering.
   * **Talks & Conferences:** Structured records of invited lectures, contributed talks, and conference participations.
   * **Awards & Honors:** Academic fellowships, talent hunt ranks, and institutional recognitions.
   * **Experience:** Dual timeline showcasing academic appointments and institutional leadership roles.
   * **Curriculum Vitae:** Embedded PDF viewer with direct download and new-tab preview triggers.
   * **Contact:** Direct email, campus address, Google Scholar, and professional network profiles.

2. **Admin Management Console**
   * **Protected Authentication:** JWT-secured dashboard accessible only to authorized administrators.
   * **Full CRUD Consoles:** Complete management interfaces for Profile, Research, Publications, Talks, Conferences, Awards, Education, Experience, and Gallery.
   * **Cloud Uploads:** Direct upload pipeline to ImageKit for profile images and PDF documents.

3. **Performance & UX**
   * **Zero Layout Shift / Flash:** Animated pulse skeletons while fetching live data.
   * **Route Scroll Restoration:** Automatic reset to top `(0, 0)` upon every route transition.
   * **Theme Persistence:** Dark and Light mode preference saved in local storage.

---

## Getting Started Locally

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher
* **MongoDB Atlas** account or local MongoDB instance
* **ImageKit.io** account for document & image storage

---

### 1. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

Configure your `.env` file with the required variable names:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

# ImageKit Credentials
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Start the backend development server:
```bash
# Start in development mode (with nodemon)
npm run dev

# Or start in production mode
npm start
```

Backend will run at: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/api/health`

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to the client directory
cd client

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

Configure your `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## Environment Variables Reference

### Backend (`server/.env`)
| Variable | Description |
|---|---|
| `PORT` | Server listening port (default `5000`) |
| `MONGODB_URI` | MongoDB Atlas connection URI |
| `JWT_SECRET` | Secret key for signing admin authentication tokens |
| `ADMIN_EMAIL` | Administrator login email |
| `ADMIN_PASSWORD` | Administrator login password |
| `IMAGEKIT_PUBLIC_KEY` | Public key from ImageKit dashboard |
| `IMAGEKIT_PRIVATE_KEY` | Private key from ImageKit dashboard |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |

### Frontend (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:5000/api` or production URL) |

---

## Production Build & Deployment

### Frontend (Vercel)
* **Root Directory:** `client`
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Environment Variable:** `VITE_API_URL` pointing to deployed backend (e.g. `https://your-backend.onrender.com/api`)
* **SPA Routing:** Handled automatically via `client/vercel.json`

### Backend (Render / Railway / VPS)
* **Root Directory:** `server`
* **Build Command:** `npm install`
* **Start Command:** `npm start`
* **Environment Variables:** Set all variables defined in `server/.env.example`

---

## License
This project is licensed under the ISC License.
