# ☕ COFFEE LAND RESTO & CAFE — Fullstack Deployment & Hosting Guide

This guide explains how to host the **Coffee Land Resto & Cafe** fullstack web application publicly on **[Render.com](https://render.com/)**, along with the separate links for customers and the owner admin panel.

---

## 🔗 Separate Links Overview

Once deployed to Render (or when running locally), you will have two distinct links:

| Link Purpose | Public URL (Render) | Local URL | Access & Security |
| :--- | :--- | :--- | :--- |
| **Customer Website** | `https://your-app-name.onrender.com/` | `http://localhost:5173/` or `http://localhost:5000/` | Publicly accessible to all customers |
| **Owner Admin Panel** | `https://your-app-name.onrender.com/admin` | `http://localhost:5173/admin` or `http://localhost:5000/admin` | Protected with Master PIN / Password |

---

## 🔐 Owner Admin Panel Login Credentials

- **Admin PIN**: `954252`
- **Master Password**: `coffeeland2024`
- *(Can be customized via environment variables `ADMIN_PIN` and `ADMIN_PASSWORD` in your Render dashboard)*

---

## 🛠️ Architecture & Backend Features

The application is structured as a production-grade fullstack monolithic architecture:

1. **Frontend (Vite + React 19 + TypeScript + Tailwind CSS)**:
   - High-performance customer storefront at `/`
   - Dedicated Owner Admin Portal at `/admin`
   - Client-side routing with `react-router-dom`
   - Automated offline / localStorage fallback if the backend is waking up

2. **Backend (Node.js + Express 5 + REST API)**:
   - Resides in `server/index.js`
   - Manages all CRUD endpoints under `/api/*`:
     - `/api/banners` — Offer banners with live preview & color presets
     - `/api/products` — All 250 food items with prices, categories, and badges
     - `/api/inquiries` — Customer WhatsApp inquiry leads
     - `/api/reviews` — Guest reviews with star ratings and photo uploads
     - `/api/export/:type` — Direct `.xlsx` Excel generator for downloads
   - Persistent JSON database in `server/data/` (`products.json`, `banners.json`, `inquiries.json`, `reviews.json`)
   - Production static server that serves the compiled Vite frontend from `dist/` and handles SPA routing

---

## 🚀 Step-by-Step Public Hosting on Render

### Step 1: Push your code to GitHub or GitLab
Make sure your project repository is committed and pushed to GitHub:
```bash
git init
git add .
git commit -m "Coffee Land fullstack web application with admin portal and backend"
git branch -M main
git remote add origin https://github.com/<your-username>/coffeeland.git
git push -u origin main
```

### Step 2: Create a Free Account on Render
1. Visit **[https://render.com/](https://render.com/)** and sign up for a free account (using GitHub is easiest).
2. Go to your **Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)

### Step 3: Create a New Web Service
1. In the top right corner, click **"New +"** and select **"Web Service"**.
2. Select **"Build and deploy from a Git repository"** and click **Next**.
3. Choose your `coffeeland` repository and click **Connect**.

### Step 4: Configure the Web Service
Fill in the following settings:
- **Name**: `coffeeland-vizag` (or your preferred name; this forms your URL: `coffeeland-vizag.onrender.com`)
- **Region**: Choose the closest region (e.g., `Singapore` or `Frankfurt` or `Oregon`)
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**:
  ```bash
  npm install && npm run build
  ```
- **Start Command**:
  ```bash
  npm start
  ```
- **Instance Type**: **Free** ($0/month)

### Step 5: Add Environment Variables (Optional but Recommended)
Click on **Advanced** or navigate to the **Environment** tab, then add:
- `NODE_ENV`: `production`
- `ADMIN_PASSWORD`: `coffeeland2024`
- `ADMIN_PIN`: `954252`

### Step 6: Deploy
1. Click **"Create Web Service"**.
2. Render will automatically:
   - Install all dependencies
   - Compile the React TypeScript frontend (`dist/`)
   - Start the Express server on port `10000`
3. In 2 to 3 minutes, your service will be marked **Live 🟢**!

---

## 💻 Local Testing & Development

You can run both the frontend and backend locally with:

```bash
# Option A: Run both frontend and backend concurrently
npm run dev:all

# Option B: Run Express backend only (production mode after npm run build)
npm start
# Then open http://localhost:5000 (Customer) or http://localhost:5000/admin (Admin)

# Option C: Run Vite dev server only
npm run dev
# Then open http://localhost:5173 (Customer) or http://localhost:5173/admin (Admin)
```

---

## 📱 Features Available in the Owner Admin Panel (`/admin`)

1. **Offer Banners Manager**:
   - Add new promotional banners with image, title, offer price, and color theme.
   - Edit active banners or toggle them on/off in real-time.
   - Delete expired banners.
2. **Food Menu Catalog (250 Items)**:
   - Instant search across all categories (Hot/Cold Coffee, Thickshakes, Mocktails, Brioche Burgers, Pizzas, Fried Chicken, Kunafa, Desserts).
   - Live price updates saved directly to the backend.
3. **WhatsApp Customer Inquiries Inbox**:
   - Live stream of inquiries sent by customers via WhatsApp for food orders & offer banners.
   - Update lead status (`New`, `Contacted`, `Completed`, `Cancelled`).
4. **Excel Export Center**:
   - Download Menu Catalog Sheet (`.xlsx`)
   - Download WhatsApp Order Inquiries Sheet (`.xlsx`)
   - Download Offer Banners Sheet (`.xlsx`)
5. **Guest Photo Reviews Manager**:
   - Review and moderate customer feedback and uploaded dining photos.
