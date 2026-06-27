# Review 1 Deliverables
**Date:** 06 June 2026
**Team:** Student 1 (Frontend), Student 2 (Backend), Student 3 (Testing & Deployment)

---

## 1. Company Introduction
**Manivtha Tours & Travels** is a business specializing in car rental bookings, vehicle availability management, driver assignments, and travel operations. They currently handle daily customer requests, operational updates, and booking records through scattered manual channels (phone calls, WhatsApp, spreadsheets).

## 2. Project Title
**Car Rental Booking System**

## 3. Problem Statement
Every day, Manivtha Tours & Travels receives numerous customer requests and operational updates that require immediate action. At present, the workflow—from car selection to rental dates and pickup/drop arrangements—depends entirely on manual logging via calls and spreadsheets. 
This results in:
- Wasted time for the team.
- Slow responses to priority customers.
- Missed revenue opportunities due to delayed follow-ups.
- A lack of a clean, unified system to track booking progress, driver ownership, and trip history.

## 4. Project Objectives
**Frontend Objectives (Student 1):**
1. Design a clean, responsive Car Selection page with filtering capabilities.
2. Build an intuitive booking form featuring interactive rental date pickers and pickup/drop location inputs.
3. Develop a multi-role Operations Dashboard for admins and booking executives.
4. Ensure cross-platform UI responsiveness using modern CSS frameworks.
5. Create a visually clear Workflow/Assistant screen that shows booking progress.

**Backend Objectives (Student 2):**
1. Develop secure RESTful APIs for vehicle management, booking creation, and driver assignments.
2. Implement server-side validation to prevent date overlaps and booking conflicts.
3. Design a scalable MongoDB database schema to store customers, bookings, vehicles, and billing details.
4. Build a state-machine workflow transitioning bookings from Pending to Trip Completed.
5. Provide endpoints to generate dynamic recommendations, summaries, and PDF export logic.

**Testing & Quality Objectives (Student 3):**
1. Establish a structured GitHub version control workflow for the team.
2. Develop comprehensive test plans mapping to every user story and feature.
3. Use Postman to validate API contracts, boundary conditions, and error handling.
4. Conduct end-to-end integration testing on the live deployed environment.
5. Ensure a zero-bug deployment pipeline with proper documentation and reporting.

## 5. Project Abstract
The **Car Rental Booking System** is a comprehensive web-based platform designed to digitize and automate the day-to-day travel operations for Manivtha Tours & Travels. Currently, the company suffers from inefficiencies, delayed responses, and a lack of consolidated tracking due to manual booking processes. This prototype solves these issues end-to-end by providing a centralized hub where customers can browse the vehicle fleet, check availability, and submit booking requests directly. 

Under the hood, the system is powered by a robust backend API using Node.js and MongoDB that automatically validates rental dates, handles availability conflict checks, and stores booking workflows. An intelligent rule-based engine provides vehicle recommendations based on passenger counts. Furthermore, a multi-role administrative dashboard empowers the booking executives and driver coordinators to assign drivers, update booking statuses, and generate automated PDF invoices. Ultimately, the system improves response times, secures revenue, and provides complete operational transparency.

---

## 6. Review 1 PPT Presentation Outline

### Slide 1: Title Slide
- **Project Title:** Car Rental Booking System
- **Company:** Manivtha Tours & Travels
- **Team Members:** Student 1, Student 2, Student 3

### Slide 2: Company Overview
- Brief introduction to Manivtha Tours & Travels.
- Explain their core business: vehicle booking, driver assignments, trip scheduling.

### Slide 3: The Problem Statement
- Manual tracking (WhatsApp, Spreadsheets).
- Slow responses, wasted time, missing revenue opportunities.

### Slide 4: Our Proposed Solution
- A centralized, digital "Car Rental Booking System".
- Web-based interface for both customers and travel administrators.

### Slide 5: Project Objectives
- Briefly summarize Frontend, Backend, and Testing goals.

### Slide 6: Technology Stack
- **Frontend:** React, HTML/CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Testing/Version Control:** Postman, GitHub

### Slide 7: UI Wireframes & Architecture Plan
- Display the initial 3 wireframes (Booking Form, Fleet Page, Dashboard).
- Overview of the system architecture.

### Slide 8: Q&A
- Open the floor to instructor feedback and questions.
