# System Architecture & Component Mapping

Below is the design schematic and component interaction map for the **Car Rental Booking System**.

## 1. Interaction Diagram
```mermaid
graph TD
    subgraph Frontend Client (Vite + React)
        Navbar[Navigation Header]
        Login[Auth Pages]
        CustDash[Customer Portal]
        OpsDash[Operations Command Command]
    end

    subgraph Backend Server (Node + Express)
        Router[Router Middleware]
        AuthCtrl[Auth & JWT guards]
        BookCtrl[Booking Controller]
        RptCtrl[Analytics & CSV Exporter]
        PayCtrl[PDF Receipt Engine]
    end

    subgraph Database Layer
        Mongo[(MongoDB Database)]
    end

    Navbar --> Router
    Login --> AuthCtrl
    CustDash --> BookCtrl
    OpsDash --> BookCtrl
    OpsDash --> RptCtrl
    OpsDash --> PayCtrl

    AuthCtrl --> Mongo
    BookCtrl --> Mongo
    RptCtrl --> Mongo
    PayCtrl --> Mongo
```

---

## 2. Component Design System
- **Frontend Core**: Built with React (Vite-powered SPA), styled with custom CSS gradients and Tailwind utility classes.
- **Backend API Core**: Express.js server providing CORS compliance, JWT token validation, and error translation.
- **Database Schema**:
  - `User`: Roles (`customer`, `admin`, `driver_coordinator`, `accounts`).
  - `Vehicle`: Status (`Available`, `Rented`, `Maintenance`).
  - `Driver`: Status (`Available`, `Busy`).
  - `Booking`: State (`Pending`, `Approved`, `Driver Assigned`, `Payment Completed`, `Trip Started`, `Trip Completed`).
  - `Payment`: Financial ledger transaction logs.
  - `AuditLog`: Action tracking for Admin.
