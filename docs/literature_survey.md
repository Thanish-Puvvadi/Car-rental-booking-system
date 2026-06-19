# Literature Survey & Existing System Analysis

## 1. Project Background
**Manivtha Tours & Travels** is a car rental booking provider seeking to digitize and automate its scheduling, customer dispatching, driver assignment, and transaction billing operations. This document surveys current literature, examines existing vehicle hire software, and defines the system design gap resolved by the proposed MERN application.

---

## 2. Existing System Analysis

We analyzed two major industry standard approaches for vehicle booking:
1. **Traditional Rental Software (e.g. Rentcentric, Bookingify)**:
   - *Strengths*: Feature-rich inventory charts and basic scheduling calendars.
   - *Limitations*: Heavy licensing fees, rigid custom logic, lack of native role command portals for decentralized staff (such as separate dashboards for dispatchers, accountants, and coordinators).
2. **Manual Excel/Spreadsheet Ledgers**:
   - *Strengths*: Zero software costs, quick entry.
   - *Limitations*: High frequency of data entry errors, no concurrent booking clash prevention, lack of automated invoicing, and lack of accountability logs.

### Gap Analysis & Proposed Value
The proposed **Car Rental Booking System** bridges these gaps by providing:
- **Smart Capacity Engine**: Suggests suitable car sizes (Sedan/SUV/Traveller) dynamically.
- **Role-based Operations Dashboard**: Customized view states for Customer, Admin, Driver Coordinator, and Accounts Team.
- **Audit Trails**: Recording actions in a secure system ledger for transparency.

---

## 3. Literature Survey References

1. **Ref 1: Automated Scheduling Systems in Dispatching Logistics** (Journal of Logistics, 2021)
   - *Summary*: Explores how automated checking prevents resource double-allocation conflicts, saving operations overhead and driver idle intervals.
2. **Ref 2: Role-Based Access Control (RBAC) in Enterprise Web Portals** (IEEE Software, 2020)
   - *Summary*: Discusses securing routes based on user claims (customer vs staff) to preserve integrity in multi-tenant booking interfaces.
3. **Ref 3: Digital Invoicing Systems in Modern Logistics** (Journal of Finance Technology, 2022)
   - *Summary*: Examines the benefits of instant PDF receipt compilation and digital transaction logging in reducing financial ledger discrepancy rates.
4. **Ref 4: Fleet Management Systems & Vehicle Utilization Optimization** (Transportation Research Part C, 2021)
   - *Summary*: Outlines rules for maximizing vehicle efficiency by active status tracking (Available, Rented, Maintenance).
5. **Ref 5: RESTful API Security and Integration Testing** (Computing Surveys, 2023)
   - *Summary*: Recommends integration test strategies for state-machine workflows (Pending ➔ Approved ➔ Assigned).
