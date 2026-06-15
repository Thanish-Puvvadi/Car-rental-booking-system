# Manivtha Tours & Travels - Car Rental Booking System

A complete, production-ready, full-stack car rental booking and fleet management system built with the MERN stack (MongoDB, Express, React, Node) and Tailwind CSS.

---

## 🚀 Key Features

* **Smart Rule-Based Recommendation Engine**: Automatically suggests vehicle categories matching passenger counts:
  * 1–4 Passengers ➔ Sedan
  * 5–7 Passengers ➔ SUV
  * 8+ Passengers ➔ Tempo Traveller
* **Multi-Role Portal Dashboards**: Role-based layouts customized for:
  * **Customer**: Browse cars, inspect calendar availability, book trips, track status, download PDF invoices.
  * **Admin**: Fleet inventory CRUD, system analytics charts, audit logs, billing tracking.
  * **Driver Coordinator**: Track driver schedules, allocate chauffeurs, progress trip states.
  * **Accounts Team**: Transaction ledger logs, record client payments, export billing reports.
* **Progressive Status Workflow**: Follows state transformations:
  `Pending ➔ Approved ➔ Driver Assigned ➔ Payment Completed ➔ Trip Started ➔ Trip Completed`
* **Real-time Cost Estimator**: Calculates billing totals dynamically based on date selections and base rates.
* **PDF Invoice Generation**: Creates styled PDF transaction receipts with tax calculations (CGST/SGST).
* **CSV Report Exporter**: Streams spreadsheet reports of bookings for finance audits.
* **Premium UI/UX**: Designed with glassmorphism overlays, custom dark/light modes, and clean card grids.

---

## 📂 Project Structure

```
/
├── backend/                  # Node.js + Express.js API
│   ├── config/               # Database connection setups
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # JWT & Role authentication guards
│   ├── models/               # MongoDB Mongoose schemas
│   ├── routes/               # Express endpoints routers
│   ├── utils/                # PDF invoicing & seeding scripts
│   ├── .env.example          # Environment template
│   ├── render.yaml           # Render blueprint configuration
│   └── server.js             # API entrance point
│
└── frontend/                 # Vite + React client app
    ├── public/               # Static assets
    ├── src/
    │   ├── components/       # Navbars, layout wrappers, modals
    │   ├── context/          # Auth & Theme providers
    │   ├── pages/            # Public, Customer, and Admin dashboards
    │   ├── services/         # Axios wrapper config
    │   ├── App.jsx           # App routing trees
    │   ├── index.css         # Styling system & utility layers
    │   └── main.jsx          # React renderer
    ├── tailwind.config.js    # Tailwind styling tokens
    ├── vercel.json           # Vercel SPA redirects configuration
    └── package.json          # Client configurations
```

---

## 🛠️ Local Installation & Run Guide (Unified Full-Stack)

### Prerequisite
* Install [Node.js](https://nodejs.org/) (which includes npm)
* Install [MongoDB](https://www.mongodb.com/try/download/community) or prepare a MongoDB Atlas connection string.

### 1. Quick Setup & Run (Single Server Mode)
You can install dependencies, build the frontend bundles, seed the database, and launch both layers on a single port from the root directory:

1. **Configure Environment Variables**:
   Create a `backend/.env` file from the `backend/.env.example` template and enter your database connection string and JWT secret.
2. **Install All dependencies**:
   ```bash
   npm run install-all
   ```
3. **Build the React Frontend Static Assets**:
   ```bash
   npm run build
   ```
4. **Seed Database with Demo Data**:
   ```bash
   npm run seed
   ```
5. **Start Server**:
   ```bash
   npm start
   ```
   *The integrated application will launch at: **[http://localhost:5000](http://localhost:5000)**.*

---

### 2. Dual-Terminal Setup (For Active Development with Hot-Reloading)
If you want to edit code and see browser updates instantly with hot-reloading, run both layers in parallel:

1. **Start Backend API (Port 5000)**:
   ```bash
   cd backend
   npm install
   npm run seed
   npm run dev
   ```
2. **Start Frontend Dev Server (Port 3000)**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Navigate to: **[http://localhost:3000](http://localhost:3000)**. The client server automatically relays API operations to port 5000.*

---

## 🔑 Quick-Access Demo Credentials

We have embedded quick-click buttons on the **Login Page** to instantly pre-fill credentials for testing, or you can key them in manually:

| Portal Role | Demo Email | Password | Allowed Operations |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@gmail.com` | `customer123` | Request bookings, inspect dates, print invoices, edit profile |
| **Admin** | `admin@manivtha.com` | `admin123` | Full dashboard access, edit fleet/drivers, view logs, view reports |
| **Coordinator** | `coordinator@manivtha.com` | `coordinator123` | Roster drivers, approve booking steps, start/conclude trips |
| **Accounts** | `accounts@manivtha.com` | `accounts123` | View payment records, log manual clearings, download CSV sheets |

---

## 🔌 API Endpoints Reference

### 1. Authentication
* `POST /api/auth/register` - Create customer account
* `POST /api/auth/login` - Login user & return token
* `GET /api/auth/profile` - Get user profile details (JWT protected)
* `PUT /api/auth/profile` - Update user coordinates (JWT protected)
* `GET /api/auth/users` - List all registered users (Admin only)

### 2. Fleet Vehicles
* `GET /api/vehicles` - List fleet with filters (seating, price, fuel)
* `GET /api/vehicles/:id` - Inspect vehicle details
* `GET /api/vehicles/:id/availability` - Verify date availability calendar
* `POST /api/vehicles` - Create vehicle (Admin only)
* `PUT /api/vehicles/:id` - Edit vehicle details (Admin only)
* `DELETE /api/vehicles/:id` - Remove vehicle (Admin only)

### 3. Drivers
* `GET /api/drivers` - List driver roster (Admin & Coordinator)
* `POST /api/drivers` - Create driver profile (Admin only)
* `PUT /api/drivers/:id` - Update driver coordinates (Admin & Coordinator)
* `DELETE /api/drivers/:id` - Remove driver (Admin only)

### 4. Booking Trips
* `POST /api/bookings` - Submit reservation request (Customer/Admin)
* `GET /api/bookings` - List bookings (Conditional: customer sees own; staff sees all)
* `GET /api/bookings/:id` - Inspect booking parameters
* `PUT /api/bookings/:id/status` - Move booking status workflow
* `PUT /api/bookings/:id/assign-driver` - Roster driver to booking (Coordinator/Admin)
* `DELETE /api/bookings/:id` - Cancel/Remove booking (Admin only)

### 5. Invoicing & Ledger
* `POST /api/payments` - Record transaction payment (Accounts/Admin)
* `GET /api/payments` - List transactions logs
* `GET /api/payments/:id/invoice` - Stream styled PDF Invoices

### 6. Analytics Reports
* `GET /api/reports/dashboard-stats` - Get charts and logs (Staff only)
* `GET /api/reports/export-bookings` - Download Excel-compatible CSV sheet of bookings (Accounts/Admin)

---

## 🌐 Production Deployment ready

### Vercel (Frontend)
The frontend contains `vercel.json` configured with SPA routing support. You can deploy by connecting your GitHub repo to Vercel and linking the `frontend` root.

### Render (Backend)
The backend contains `render.yaml` defining service blueprints. Deploy by clicking "New Web Service" in Render, uploading your repository, and pointing to the `backend` directory. Fill in environment variable values for `MONGODB_URI` and `JWT_SECRET`.
