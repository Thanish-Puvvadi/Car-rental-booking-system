# Review 3 Deliverables
**Date:** 29-30 June 2026
**Team:** Student 1 (Frontend), Student 2 (Backend), Student 3 (Testing & Deployment)

---

## 1. Bug Report

**Known Issues & Resolutions during Final Testing:**

| Bug ID | Component | Description | Status | Resolution |
|---|---|---|---|---|
| **BUG-01** | Frontend | Operations Dashboard table overflows horizontally on small mobile screens. | Fixed | Applied Tailwind `overflow-x-auto` to the table wrapper div. |
| **BUG-02** | Backend | `POST /api/bookings` crashed when `specialInstructions` was extremely long (over 5000 chars). | Fixed | Added a Mongoose Schema `maxlength: 1000` validator and returned 400 Bad Request to frontend. |
| **BUG-03** | Backend | CORS error blocked frontend from communicating with the deployed backend API on Render. | Fixed | Updated `cors` middleware origin configuration to whitelist the Vercel frontend URL. |
| **BUG-04** | AI Layer | Recommendation engine occasionally suggested a "Tempo Traveller" for 4 passengers. | Fixed | Corrected passenger boundary condition logic (`>= 5` instead of `> 4`). |
| **BUG-05** | Database | MongoDB connection string timeout during high loads on free tier. | Known Issue | Added a retry strategy. Will upgrade to a higher tier for real production. |

---

## 2. Deployment Guide

**Backend Deployment (Render):**
1. Push the `/backend` folder to a GitHub repository.
2. Log into Render.com and select "New Web Service".
3. Connect the repository and configure the Root Directory to `backend`.
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add Environment Variables: `MONGODB_URI` (Atlas connection string) and `JWT_SECRET`.
7. Click "Deploy". The API URL will be available immediately.

**Frontend Deployment (Vercel):**
1. Push the `/frontend` folder to a GitHub repository.
2. Log into Vercel.com and select "Add New Project".
3. Import the repository and set the framework preset to "Vite".
4. Set the Root Directory to `frontend`.
5. Add the Environment Variable: `VITE_API_URL` pointing to the Render backend URL.
6. Ensure `vercel.json` exists for SPA routing rules.
7. Click "Deploy".

---

## 3. Project Report Final Chapters

### Introduction
The Car Rental Booking System addresses the severe operational inefficiencies observed at Manivtha Tours & Travels. By replacing manual logs, spreadsheets, and delayed communication with a robust web application, the system streamlines vehicle fleet management, driver assignment, and customer booking requests.

### System Architecture
The application follows a standard Client-Server architecture utilizing the MERN stack:
- **Presentation Layer (Frontend):** Built with React.js and styled using Tailwind CSS for a modern, responsive user experience.
- **Application Layer (Backend):** Built with Node.js and Express.js, exposing RESTful endpoints.
- **Data Layer (Database):** MongoDB managed via Mongoose. It persists the relational integrity between bookings, vehicles, and drivers using Object IDs.
- **AI/Logic Layer:** Rule-based functions process date validations, prevent booking overlaps, and suggest vehicle tiers based on passenger load.

### Implementation Details
The codebase ensures high reusability. The React frontend relies on shared layout components (`MainLayout`) and Context API (`AuthContext`) for global state. The Express backend employs customized middleware for JWT verification and Role-Based Access Control (RBAC), ensuring that only Coordinators or Admins can manipulate driver assignments.

### Testing & Quality Assurance
Extensive integration testing was conducted using Postman for API contracts and browser-based end-to-end testing for the user journey. The deployment pipeline was verified against edge cases such as missing inputs, conflicting booking dates, and unauthorized endpoint access.

### Conclusion and Future Scope
The successful deployment of the Car Rental Booking System fulfills the primary objective of digitizing Manivtha Tours & Travels' operations. Future iterations could integrate real-time GPS tracking for drivers, an automated WhatsApp Business API for instant SMS confirmations, and an advanced AI module (e.g., OpenAI) to predict high-demand rental periods based on historical analytics.

---

## 4. Review 3 PPT Presentation Outline

### Slide 1: Review 3 Title Slide
- Title: Car Rental Booking System - Final Prototype Demo
- Include names and roles.

### Slide 2: Project Recap
- Briefly restate the problem and the objectives.
- Reiterate the architecture (React + Node + MongoDB).

### Slide 3: Bug Report & Resolutions
- Highlight key bugs encountered during integration.
- Explain how the team fixed CORS issues and schema validations.

### Slide 4: Deployment & Infrastructure
- Explain the hosting environments: Vercel (Frontend) and Render (Backend).
- Show the Live URLs.

### Slide 5: LIVE DEMO (Video/Screen Share)
- Show the complete user journey:
  1. Customer selects a car.
  2. Customer fills out dates and checks availability.
  3. Booking is created.
  4. Admin logs in, views the dashboard, and approves the booking.
  5. Admin assigns a driver and generates an invoice.

### Slide 6: Learnings & Challenges
- Share individual learnings (React state management, MongoDB queries, API testing).
- Share challenges faced during integration.

### Slide 7: Conclusion & Future Scope
- Summarize the business impact of the prototype.
- Mention future enhancements (WhatsApp API, AI predictions).

### Slide 8: Thank You / Q&A
- Open the floor for final evaluations.
