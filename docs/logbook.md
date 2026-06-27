# Project Logbook: Car Rental Booking System

**Project Title**: Car Rental Booking System  
**Company**: Manivtha Tours & Travels  
**Duration**: 01 June 2026 - 30 June 2026  
**Roles**:  
- Student 1: Frontend Developer  
- Student 2: Backend Developer  
- Student 3: Testing & Deployment  

---

## Week 1
**Day 1: 01 June 2026 (Mon) - Introduction Session**  
- **Student 1 (Frontend)**: Watched the intro session. Reviewed requirements for the car selection, date picker, and dashboard screens. Sketched 3 preliminary wireframe screens on paper.
- **Student 2 (Backend)**: Reviewed the problem statement. Identified required APIs: bookings, vehicles, drivers, validations. Prepared 5 questions regarding business rules.
- **Student 3 (Testing & Deployment)**: Researched testing methodologies. Studied Git workflow. Created GitHub account and joined the team repository.

**Day 2: 02 June 2026 (Tue) - Problem Statement + Abstract**  
- **Student 1 (Frontend)**: Drafted user-focused problem statement focusing on UI usability. Outlined the screens for customers and admins. Wrote abstract from a UI perspective.
- **Student 2 (Backend)**: Drafted technical problem statement. Listed backend CRUD operations and workflows. Expanded the abstract to include API and DB details.
- **Student 3 (Testing & Deployment)**: Initialized the GitHub repository with folders `/frontend`, `/backend`, `/docs`, `/tests`. Pushed the initial `README.md`.

**Day 3: 03 June 2026 (Wed) - Project Objectives + Tech Stack Setup**  
- **Student 1 (Frontend)**: Wrote 5 UI objectives. Installed Node.js and VS Code. Created React frontend folder and a basic "Hello World" component.
- **Student 2 (Backend)**: Wrote 5 backend objectives. Initialized Node.js Express setup. Created a test route (`GET /`).
- **Student 3 (Testing & Deployment)**: Wrote 5 quality objectives. Installed Postman. Tested the backend test route and documented the response in the test tracker.

**Day 4: 04 June 2026 (Thu) - Use Case Design + Wireframes**  
- **Student 1 (Frontend)**: Designed wireframes for the booking form, workflow screen, and dashboard. Uploaded them to `/docs`.
- **Student 2 (Backend)**: Drew use case diagram with actors. Finalized endpoint list containing POST/create, GET/list, GET/detail, etc.
- **Student 3 (Testing & Deployment)**: Reviewed wireframes and use cases. Drafted initial test cases for the main scenarios and pushed to `/docs`.

**Day 5: 05 June 2026 (Fri) - Review 1 Preparation**  
- **Student 1 (Frontend)**: Prepared PPT slides covering wireframes and UI design. Conducted a mock presentation for the team.
- **Student 2 (Backend)**: Prepared PPT slides for problem statement and tech stack. Simplified the explanation of the backend architecture for the presentation.
- **Student 3 (Testing & Deployment)**: Added GitHub link, test plan, and abstract to the PPT. Verified all docs were pushed to main.

**Day 6: 06 June 2026 (Sat) - Review Presentation 1**  
- **Student 1 (Frontend)**: Presented wireframes and UI strategies to the instructor. Documented feedback on layout.
- **Student 2 (Backend)**: Presented the problem statement, proposed system, and tech stack. Addressed questions about database choice.
- **Student 3 (Testing & Deployment)**: Presented testing strategies and GitHub repository. 

---

## Week 2
**Day 7: 08 June 2026 (Mon) - Review 1 Feedback + Week 2 Prep**  
- **Student 1 (Frontend)**: Updated wireframes according to Review 1 feedback. Began coding HTML/Tailwind layout for the main input screen.
- **Student 2 (Backend)**: Refined problem statement and objectives. Researched REST API structure for the booking endpoints.
- **Student 3 (Testing & Deployment)**: Updated the test tracker formatting. Found 3 references for the literature survey.

**Day 8: 09 June 2026 (Tue) - Literature Survey + Existing System Analysis**  
- **Student 1 (Frontend)**: Studied 2 existing car rental dashboards. Documented UI limitations and took notes for our proposed improvements.
- **Student 2 (Backend)**: Analyzed existing systems' backend workflows. Identified gaps in current manual processes and how our automated workflow resolves them.
- **Student 3 (Testing & Deployment)**: Summarized 3 references for the literature survey. Ensured citations were formatted properly.

**Day 9: 10 June 2026 (Wed) - Proposed System Description + DB Design**  
- **Student 1 (Frontend)**: Wrote the proposed system description for the frontend screens. Finalized the wireframes.
- **Student 2 (Backend)**: Designed the MongoDB database schema including models for Booking, Vehicle, User, and Driver. Created an ER diagram equivalent.
- **Student 3 (Testing & Deployment)**: Wrote test plans mapping to database schemas and features. Uploaded the ER diagram to `/docs`.

**Day 10: 11 June 2026 (Thu) - Database Setup + First Backend Route + Main Form**  
- **Student 1 (Frontend)**: Built the full booking form structure with React state for all required fields (pickup, drop, dates, passengers, etc.).
- **Student 2 (Backend)**: Connected Express server to MongoDB. Built the `POST /api/bookings` route.
- **Student 3 (Testing & Deployment)**: Tested the `POST /api/bookings` route in Postman with valid and missing data. Recorded results in the test tracker.

**Day 11: 12 June 2026 (Fri) - List API + Dashboard HTML**  
- **Student 1 (Frontend)**: Built the Operations Dashboard UI with a data table and status cards using dummy records.
- **Student 2 (Backend)**: Built the `GET /api/bookings` route to return all bookings. Implemented basic filtering by status.
- **Student 3 (Testing & Deployment)**: Tested the GET route JSON response structure. Verified filters worked with dummy data.

**Day 12: 13 June 2026 (Sat) - GitHub Workflow + Environment Validation**  
- **Student 1 (Frontend)**: Pushed the frontend booking form and dashboard on a feature branch. Raised a PR.
- **Student 2 (Backend)**: Pushed API routes and database models on a feature branch. Raised a PR.
- **Student 3 (Testing & Deployment)**: Reviewed and merged PRs. Validated the integrated main branch locally to ensure everything ran properly.

---

## Week 3
**Day 13: 15 June 2026 (Mon) - Core Logic Design + Workflow Plan**  
- **Student 1 (Frontend)**: Designed the booking workflow UI. Created dynamic state for form steps and result screens.
- **Student 2 (Backend)**: Implemented the backend status workflow (Pending -> Approved -> Driver Assigned -> Completed). Wrote functions to check date conflicts.
- **Student 3 (Testing & Deployment)**: Prepared 10 edge-case test scenarios targeting the core logic (e.g. conflicting dates, invalid trip types).

**Day 14: 16 June 2026 (Tue) - Week 2 Review Prep + Lit Survey Final**  
- **Student 1 (Frontend)**: Cleaned up the form UI. Prepared PPT slides for Review 2 (wireframes vs actual implementation).
- **Student 2 (Backend)**: Finalized backend schemas. Prepared PPT slides explaining the core validation logic and DB models.
- **Student 3 (Testing & Deployment)**: Finalized the Literature Survey with 5 references. Prepped slides for the test plan.

**Day 15: 17 June 2026 (Wed) - System Architecture Diagram + Full Stack Plan**  
- **Student 1 (Frontend)**: Designed the system architecture diagram (Draw.io/Mermaid) mapping the React frontend to the Node API.
- **Student 2 (Backend)**: Confirmed API contracts with the frontend. Documented JSON response structures for the integration.
- **Student 3 (Testing & Deployment)**: Created a formal integration test plan covering end-to-end user journeys.

**Day 16: 18 June 2026 (Thu) - Connect Frontend Form to Backend API**  
- **Student 1 (Frontend)**: Used Axios to post form data to the backend API. Added client-side validation errors and success messages.
- **Student 2 (Backend)**: Validated incoming requests on the server-side. Checked date overlaps. Saved to DB and returned success JSON.
- **Student 3 (Testing & Deployment)**: Tested the integrated form end-to-end via the browser. Verified that MongoDB created the document correctly.

**Day 17: 19 June 2026 (Fri) - Review Presentation 2 - Day 1**  
- **Student 1 (Frontend)**: Showed the live React form and dashboard during the mock presentation. Answered UI questions.
- **Student 2 (Backend)**: Explained the database schema, architecture diagram, and core APIs. Showed Postman tests.
- **Student 3 (Testing & Deployment)**: Explained the test plan and current test results. Walked through the literature survey.

**Day 18: 20 June 2026 (Sat) - Review Presentation 2 - Day 2 + Core Feature Build**  
- **Student 1 (Frontend)**: Implemented the status updating UI on the dashboard. Added role-based access visual indicators.
- **Student 2 (Backend)**: Built the `PUT /api/bookings/:id/status` route to allow staff to progress the booking state.
- **Student 3 (Testing & Deployment)**: Wrote tests to ensure only authorized users could change booking statuses.

---

## Week 4
**Day 19: 22 June 2026 (Mon) - Core Workflow Complete + Alerts/Outputs**  
- **Student 1 (Frontend)**: Added visual badges and alerts on the dashboard based on booking status (e.g. Green for Approved, Yellow for Pending).
- **Student 2 (Backend)**: Completed the rule-based logic to auto-suggest vehicles based on passenger counts.
- **Student 3 (Testing & Deployment)**: Tested the full pipeline and verified the auto-suggestion logic worked properly in the frontend.

**Day 20: 23 June 2026 (Tue) - Detail Page + Full Integration Test**  
- **Student 1 (Frontend)**: Built the Booking Detail page (`/bookings/:id`) showing comprehensive trip information.
- **Student 2 (Backend)**: Built the `GET /api/bookings/:id` API ensuring joins/populations for Driver and Vehicle references.
- **Student 3 (Testing & Deployment)**: Ran a full end-to-end integration test creating 5 different records and progressing their statuses. Logged bugs.

**Day 21: 24 June 2026 (Wed) - UI Polish + Error Handling**  
- **Student 1 (Frontend)**: Polished the CSS using Tailwind. Added Spinners for loading states and empty state illustrations.
- **Student 2 (Backend)**: Standardized `try/catch` blocks in all controllers. Ensured 400/500 errors returned consistent JSON structures.
- **Student 3 (Testing & Deployment)**: Submitted bad data intentionally to test the frontend and backend error handling. Verified messages were user-friendly.

**Day 22: 25 June 2026 (Thu) - Deployment Setup**  
- **Student 1 (Frontend)**: Updated base URLs to point to the production API. Prepared Vercel deployment configuration.
- **Student 2 (Backend)**: Deployed the Node API to Render. Linked the production MongoDB Atlas cluster.
- **Student 3 (Testing & Deployment)**: Created the deployment guide. Verified that the deployed frontend successfully communicated with the deployed backend.

**Day 23: 26 June 2026 (Fri) - Final Testing + Bug Fixes + Report Part 1**  
- **Student 1 (Frontend)**: Fixed responsive layout issues on mobile devices. Wrote the Introduction and UI sections of the report.
- **Student 2 (Backend)**: Resolved an issue with CORS on the deployed API. Wrote the System Analysis and Implementation chapters of the report.
- **Student 3 (Testing & Deployment)**: Compiled the official bug report. Drafted the Testing chapter of the final project report.

**Day 24: 27 June 2026 (Sat) - Project Report Part 2 + Demo Video + Final PPT**  
- **Student 1 (Frontend)**: Recorded a 4-minute demo video of the user journey. Finalized the UI slides for the presentation.
- **Student 2 (Backend)**: Wrote the Conclusion chapter. Finalized the backend logic and database architecture slides.
- **Student 3 (Testing & Deployment)**: Proofread the entire PDF report. Finalized the Testing and Deployment slides.

---

## Week 5
**Day 25: 29 June 2026 (Mon) - Review Presentation 3 - Day 1 + Final Submissions**  
- **Student 1 (Frontend)**: Delivered the live frontend demo during the final presentation.
- **Student 2 (Backend)**: Defended technical decisions regarding MongoDB and the authentication flow.
- **Student 3 (Testing & Deployment)**: Presented the testing metrics, the deployment URL, and submitted the final project checklist.

**Day 26: 30 June 2026 (Tue) - Review Presentation 3 - Day 2 + Internship Closing**  
- **Student 1 (Frontend)**: Reflected on React component architecture learnings. Wrote final logbook entry.
- **Student 2 (Backend)**: Reflected on REST API best practices. Wrote final logbook entry.
- **Student 3 (Testing & Deployment)**: Completed the final sign-off. Confirmed all repository links and documents were successfully archived.
