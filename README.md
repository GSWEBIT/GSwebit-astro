# GSWebIT - Astro.js Full-Stack Application

This project is a conversion of the GSWebIT agency website and backend into a unified **Astro.js** application with Node.js SSR adapter and direct MongoDB Atlas cluster connectivity.

---

## 🚀 Key Highlights

- **Astro SSR (`output: 'server'`) with `@astrojs/node`:** Serves all pages and handles all backend API routes in a single unified deployment.
- **Direct MongoDB Cluster Connection:** Managed via Mongoose in [`src/lib/db.ts`](src/lib/db.ts) with connection pooling and caching.
- **Server Endpoints:** Fully functional REST endpoints under `/api/...` matching the original Express backend routes (`/api/inquiries`, `/api/admin/login`, `/api/admin/inquiries`, etc.).
- **Componentized Layout:** Server-rendered [`Header.astro`](src/components/Header.astro), [`Footer.astro`](src/components/Footer.astro), and [`Cta.astro`](src/components/Cta.astro) for fast loading, no layout shifts, and strong SEO.
- **Interactive UI & Demos:** All live template previews, filtering chips, responsive mobile menu, scroll reveal animations, and admin panel preserved.

---

## 📁 Project Structure

```text
astro/
├── astro.config.mjs         # Astro configuration with Node standalone adapter & redirects
├── package.json             # Scripts & dependencies (Astro 5, @astrojs/node, Mongoose, etc.)
├── tsconfig.json            # TypeScript configuration
├── .env                     # MongoDB URI and environment variables (active)
├── .env.example             # Example environment variables
├── public/
│   ├── assets/              # Logos, SVGs, style.css, client-side main.js
│   ├── demos/               # Full template interactive preview sites
│   └── previews/            # Template previews
└── src/
    ├── components/
    │   ├── Header.astro     # Site header with active navigation & mobile drawer
    │   ├── Footer.astro     # Site footer with services & links
    │   └── Cta.astro        # Call to action section
    ├── layouts/
    │   └── Layout.astro     # Base HTML layout (head, fonts, styles, scripts)
    ├── lib/
    │   ├── db.ts            # MongoDB Atlas cluster connection & cache
    │   ├── auth.ts          # Admin authentication, HMAC token generator & verifier
    │   ├── email.ts         # Nodemailer setup for password reset
    │   ├── cors.ts          # CORS headers helper
    │   └── models/
    │       ├── Inquiry.ts   # Mongoose model for client inquiries
    │       └── PasswordReset.ts # Mongoose model for password resets
    └── pages/
        ├── index.astro      # Home page (/)
        ├── about.astro      # About Us (/about)
        ├── services.astro   # Services (/services)
        ├── templates.astro  # Templates (/templates)
        ├── contact.astro    # Contact & inquiry form (/contact)
        ├── admin.astro      # Admin dashboard (/admin)
        ├── reset-password.astro # Password reset (/reset-password)
        └── api/
            ├── index.ts     # GET /api (health & status)
            ├── health.ts    # GET /api/health
            ├── inquiries.ts # POST /api/inquiries (saves to Mongo Cluster)
            └── admin/
                ├── login.ts           # POST /api/admin/login
                ├── forgot-password.ts # POST /api/admin/forgot-password
                ├── reset-password.ts  # POST /api/admin/reset-password
                └── inquiries/
                    ├── index.ts       # GET /api/admin/inquiries (fetch all + stats)
                    └── [id].ts        # DELETE /api/admin/inquiries/:id
```

---

## ⚙️ Configuration & Environment Variables

The `.env` file in `astro/` manages the MongoDB cluster connection and admin settings:

```env
MONGODB_URI=mongodb+srv://gswebit23_db_user:<password>@cluster0.vrcyuej.mongodb.net/gswebit?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
HOST=127.0.0.1
ALLOWED_ORIGIN=*
ADMIN_PASSWORD=gswebit2026
ADMIN_SECRET=gswebit-secret-key-2026
EMAIL_USER=gswebit23@gmail.com
EMAIL_PASS=your-gmail-app-password-here
FRONTEND_URL=https://gswebit.vercel.app
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
cd astro
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:4321` (or the port Astro reports) in your browser.

### 3. Build & Run Production Server
```bash
npm run build
npm run start
```
The server will start on the host and port defined in `.env` (default: `http://127.0.0.1:3000`).
All pages and MongoDB cluster connections are ready and active!

