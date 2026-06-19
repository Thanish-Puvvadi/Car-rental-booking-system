# Use Case Design & API Contracts

## 1. System Actors
- **Rental Customer / Traveller**: Browse fleet, check availability, book trips, make payments, track trip logs.
- **Driver Coordinator**: Allocates available chauffeurs to approved bookings and manages driver roster details.
- **Accounts Team**: Records payments, prints transaction receipts, and reviews finance reports.
- **Admin**: Oversees inventory CRUD, audit trails, and performs any staff operations.

---

## 2. API Endpoint Registry

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register customer account |
| `POST` | `/api/auth/login` | Public | Login & get JWT token |
| `GET` | `/api/vehicles` | Public | List fleet vehicles |
| `POST` | `/api/bookings` | Customer | Create a booking request |
| `GET` | `/api/bookings` | Private | List bookings (role conditional) |
| `PUT` | `/api/bookings/:id/status` | Staff | Progress status state machine |
| `PUT` | `/api/bookings/:id/assign-driver`| Coordinator | Assign driver to booking |
| `POST` | `/api/payments` | Accounts | Record client payment transaction |
| `GET` | `/api/reports/dashboard-stats` | Staff | Retrieve analytics chart data |

---

## 3. Workflow State Machine Transitions
```
Pending [Customer submits]
  └─► Approved [Booking Executive verifies fleet availability]
        └─► Driver Assigned [Coordinator assigns available driver]
              └─► Payment Completed [Accounts records payment receipt]
                    └─► Trip Started [Journey commences]
                          └─► Trip Completed [Journey completes, assets freed]
```
