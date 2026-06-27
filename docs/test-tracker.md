# Quality Assurance Roster & Test Tracker

This document maps all core features to test validation matrices to check system stability.

## 1. Core Logic Test Cases (10 Scenarios)

| Test ID | Area | Description | Expected Outcome | Actual Outcome | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Booking | Submitting booking request with missing pickup location | Form validation fails; POST rejects with 400 Bad Request | Rejects correctly | **PASS** |
| **TC-02** | Booking | Start date is set after return date | Validation blocks submit; displays return date after pickup date error | Blocks correctly | **PASS** |
| **TC-03** | Engine | Input 3 passengers in recommendation engine | Engine recommends "Sedan" class | Recommends Sedan | **PASS** |
| **TC-04** | Engine | Input 6 passengers in recommendation engine | Engine recommends "SUV" class | Recommends SUV | **PASS** |
| **TC-05** | Engine | Input 10 passengers in recommendation engine | Engine recommends "Tempo Traveller" class | Recommends Traveller | **PASS** |
| **TC-06** | Database | Create overlapping booking requests for same car | Database blocks overlapping range; returns 400 clashing booking error | Blocks overlaps | **PASS** |
| **TC-07** | Workflow | Approve Pending booking request | Status advances to Approved | Advances to Approved | **PASS** |
| **TC-08** | Workflow | Coordinator assigns available driver | Status advances to Driver Assigned; driver status becomes Busy | Roster updates | **PASS** |
| **TC-09** | Workflow | Accounts logs manual transaction code | Payment record logged; status advances to Payment Completed | Payment logged | **PASS** |
| **TC-10** | Roster | Trip completes successfully | Status becomes Trip Completed; driver and vehicle availability set back to Available | Assets freed | **PASS** |

---

## 2. Integration Test Verification Plan

- **Goal**: Validate data flow from frontend forms, backend API routers, and database updates.
- **Verification Strategy**:
  1. Login as Customer ➔ Book vehicle KA-03-MM-1234 from June 20 to June 22.
  2. Login as Coordinator ➔ Verify booking appears under Trips tab. Select Chauffeur and assign.
  3. Login as Accounts ➔ Verify booking is visible in Driver Assigned. Record manual UPI code for the transaction.
  4. Login as Coordinator ➔ Click Start Trip and then Complete Trip.
  5. Login as Customer ➔ Go to booking details page and download the compiled PDF Invoice. Verify that vehicle status returns to Available in the Fleet selection.
