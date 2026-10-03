# SmartHire (PathPilot) - AI-Assisted Student Placement & Resume Management System
### Full-Stack MERN Architecture • End-to-End SRS Implementation • 100% Free-Tier Operation

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-indigo.svg)](https://react.dev)
[![SRS Version](https://img.shields.io/badge/SRS-v1.0-emerald.svg)](#srs-traceability-matrix)
[![Zero Paid API](https://img.shields.io/badge/APIs-100%25%20Free%20Tier-purple.svg)](#free-tier-architecture--zero-api-keys)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 1. Project Overview & SRS Summary

**SmartHire** (also referenced as **PathPilot** in career advisory modules) is an end-to-end, AI-assisted web platform designed to streamline the complete student campus placement lifecycle for universities and colleges.

The platform bridges traditional campus placement-cell administrative overhead with transparent, explainable scoring algorithms. Unlike black-box automated systems, every score calculated by SmartHire (Resume ATS score, Job Match percentage, and 100-Point Placement Readiness Index) provides complete factor breakdowns and mathematical reasoning.

### Key Highlights
- **4 Distinct Stakeholder Personas**: Student, Recruiter / Company, Placement Officer, and System Administrator (enforced via JWT and Role-Based Access Control).
- **Zero Paid Dependencies**: Runs 100% without OpenAI/Gemini paid API keys or cloud billing. All scoring uses deterministic, explainable heuristic models.
- **Fail-Safe Offline Mode**: Intelligent dual-mode database layer in `server/config/db.js` that connects to MongoDB Atlas free tier or seamlessly transitions to an in-memory/JSON store with 20+ pre-seeded student records, 5+ companies, and 12+ jobs.

---

## 2. The 5 Core Features Mapped Exactly to SRS Section 3

| Feature # | SRS Functional Requirements | Core Platform Capability |
| :--- | :--- | :--- |
| **Feature 1** | **FR4, FR5, FR6** | **Resume Studio**: 5-template resume builder, open-source PDF text extraction, 5-factor ATS scoring, and job-specific keyword gap analysis. |
| **Feature 2** | **FR7, FR8, FR9** | **Job Board & Explainable Match Engine**: Multi-facet search/filtering and transparent 6-factor weighted job matching formula with ranked recommendations. |
| **Feature 3** | **FR10** | **Skill Gap Analyzer & Career Roadmaps**: Target role skill gap calculation (`Required Skills - Current Skills`) with interactive stage checklist and progress tracking. |
| **Feature 4** | **FR11, FR12** | **Mock Interview Simulator & Readiness Index**: 10 category-specific question banks with real-time keyword/depth scoring, plus a holistic 100-Point Placement Readiness Index. |
| **Feature 5** | **FR13, FR14, FR15, FR16, FR17, FR19** | **Placement Lifecycle Tracker & Analytics**: 7-stage visual application pipeline, interview calendar with reminders, officer placement drives, and Recharts institutional analytics. |

---

## 3. SRS Traceability Matrix (Section 7)

This matrix maps every Functional Requirement (FR) from Section 3 of the SRS document to its exact implementation, API endpoint, and frontend interface:

| SRS Req ID | Requirement Name | Implemented As | API Endpoint | Frontend Page / Route |
| :--- | :--- | :--- | :--- | :--- |
| **FR1** | Authentication & RBAC | JWT Auth, Bcrypt hashing, role guards | `POST /api/auth/register`<br>`POST /api/auth/login`<br>`GET /api/auth/me` | `/login`<br>`/register`<br>`ProtectedRoute.jsx` |
| **FR2** | Student Profile Management | Dynamic Profile Completion (`completed / 8 * 100`) | `GET /api/profile/me`<br>`PUT /api/profile/me` | `/profile` |
| **FR3** | Student Dashboard | Live metrics: Profile %, ATS score, Readiness, Apps | `GET /api/profile/me`<br>`GET /api/applications/my` | `/dashboard` |
| **FR4** | Multi-Template Resume Builder | 5 templates (Modern, Professional, Minimal, Software Dev, Fresher), live preview, PDF export | `POST /api/resumes`<br>`GET /api/resumes/my` | `/feature1`<br>`/resume-builder` |
| **FR5** | Resume Analyzer | Free PDF text parsing (`pdf-parse`), 5-factor ATS scoring, suggestions | `POST /api/resumes/upload-pdf`<br>`POST /api/resumes` | `/feature1` (Tab 2) |
| **FR6** | ATS-Style Resume Checker | Compares resume against job required skills, missing keyword alerts | `POST /api/resumes/ats-check` | `/feature1` (Tab 3) |
| **FR7** | Job Module | Search, filter (role, CGPA, branch, type, salary), details & bookmarking | `GET /api/jobs`<br>`GET /api/jobs/:id`<br>`POST /api/jobs/:id/save` | `/feature2`<br>`/jobs` |
| **FR8** | Job Matching Engine | 6-factor weighted algorithm (Skill 50%, Edu 15%, CGPA 15%, Exp 10%, Cert 5%, Loc 5%) | `GET /api/jobs/:id/match` | `/feature2` (Match Modal) |
| **FR9** | Job Recommendations | Ranked job list sorted by descending match score | `GET /api/jobs/recommendations` | `/feature2` (Tab 2) |
| **FR10** | Skill Gap & Career Roadmaps | Computes `Required - Current Skills`, multi-stage interactive roadmap checklist | `GET /api/roadmaps`<br>`POST /api/roadmaps/select-role`<br>`PUT /api/roadmaps/:id/item-status` | `/feature3`<br>`/roadmap` |
| **FR11** | Placement Readiness Index | 100-point holistic index across 7 weighted dimensions | `GET /api/interviews/placement-readiness` | `/feature4` (Tab 2) |
| **FR12** | Mock Interview System | 10 question banks, timer, rule-based keyword & length analysis, feedback | `GET /api/interviews/questions/:category`<br>`POST /api/interviews/evaluate-single`<br>`POST /api/interviews/submit-session` | `/feature4`<br>`/mock-interview` |
| **FR13** | Application Tracking & Calendar | 7-stage visual timeline, append-only history log, scheduled interview calendar | `POST /api/applications/apply`<br>`GET /api/applications/my`<br>`GET /api/applications/calendar` | `/feature5`<br>`/tracker`<br>`/applications` |
| **FR14** | Project Portfolio & Certifications | Projects with GitHub/demo links, credentials | `PUT /api/profile/me` | `/profile` (Section 3) |
| **FR15** | Recruiter Module | Post jobs with eligibility criteria, review applicants, update candidate stages | `POST /api/jobs`<br>`PUT /api/applications/:id/status`<br>`PUT /api/applications/:id/schedule-interview` | `/post-job`<br>`/feature5` |
| **FR16** | Placement Officer Module | Campus placement drives, auto-student eligibility filter, student registration | `GET /api/drives`<br>`POST /api/drives`<br>`POST /api/drives/:id/register` | `/feature5` (Tab 3)<br>`/drives` |
| **FR17** | Placement Analytics | Recharts: branch placements, package distributions, monthly activity, skill demand | `GET /api/analytics` | `/feature5` (Tab 4)<br>`/analytics` |
| **FR18** | Admin Module | Audit metrics, account status verification, role override | `GET /api/health`<br>`GET /api/analytics` | `/dashboard` (Admin View) |
| **FR19** | In-App Notification System | In-app alerts for status updates, interview schedules, drives; mark read/unread | `GET /api/notifications`<br>`PUT /api/notifications/:id/read`<br>`PUT /api/notifications/mark-all-read` | Navbar Notification Bell |

---

## 4. Technology Stack & Free-Tier Guarantees

### Frontend
- **Core**: React 18 LTS + Vite (ultra-fast Hot Module Replacement)
- **Styling**: Tailwind CSS + Custom Dark-Theme Glassmorphism
- **Routing**: React Router DOM v6
- **Data Fetching**: Axios instance with automatic JWT Bearer token interceptor
- **Analytics Visualization**: Recharts (Bar, Pie, Area, and Tooltip components)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js & Express.js REST API
- **Authentication**: Stateless JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` password hashing
- **File Uploads**: `multer` with PDF MIME validation and 5MB size limit
- **PDF Extraction**: Open-source `pdf-parse` (FR5 zero-cost resume text parsing)
- **CORS & Environment**: `cors` and `dotenv`

### Database Dual-Mode Adapter (`server/config/db.js`)
- **Primary**: MongoDB Atlas Free Tier (`MONGO_URI` configured in `.env`)
- **Automatic Fallback**: In-Memory Data Store populated with 20+ Students, 5+ Companies, 12+ Jobs, Placement Drives, and Question Banks. **The application never crashes if MongoDB Atlas credentials are not provided or if offline.**

---

## 5. Folder Structure

```
root/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Card.jsx                  # Glassmorphic container with badges
│   │   │   ├── Charts.jsx                # Recharts wrappers (Branch, Package, Monthly, Skills)
│   │   │   ├── Loader.jsx                # Pulse & spinner states
│   │   │   ├── Modal.jsx                 # Accessible backdrop-blur dialogs
│   │   │   ├── Navbar.jsx                # Dynamic role navigation & notification bell
│   │   │   └── ProtectedRoute.jsx        # JWT & RBAC route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Session state & 1-click test persona switcher
│   │   ├── pages/
│   │   │   ├── Landing.jsx               # Hero, metrics, 5 features & benefits
│   │   │   ├── Login.jsx                 # Login with 1-click quick-fill buttons
│   │   │   ├── Register.jsx              # Role-tailored signup form
│   │   │   ├── Dashboard.jsx             # Role-aware dashboard (Student FR3, Recruiter FR15, Officer FR16, Admin FR18)
│   │   │   ├── Feature1_ResumeStudio.jsx # FR4-6: Builder, 5 Templates, PDF upload, ATS scoring
│   │   │   ├── Feature2_JobMatching.jsx  # FR7-9: Job board, 6-factor match modal, recommendations
│   │   │   ├── Feature3_SkillRoadmap.jsx # FR10: Skill gap analysis & stage roadmap checklist
│   │   │   ├── Feature4_MockInterview.jsx# FR11-12: 10 category question banks, test runner, AI mentor
│   │   │   ├── Feature5_PlacementTracker.jsx # FR13-17: 7-stage pipeline, calendar, drives, analytics
│   │   │   ├── Profile.jsx               # FR2, FR14: Student records, portfolio projects, certs
│   │   │   └── PostJob.jsx               # FR15: Recruiter job creation form
│   │   ├── services/
│   │   │   ├── api.js                    # Axios instance & modular service callers
│   │   │   └── aiService.js              # Rule-based Mock AI (800ms delay, zero paid API)
│   │   ├── App.jsx                       # Master React Router layout
│   │   ├── index.css                     # Design system, glass-panel utilities, print CSS
│   │   └── main.jsx                      # Vite entry point
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── config/
│   │   ├── db.js                         # Dual MongoDB Atlas + In-Memory Fallback
│   │   └── seedData.js                   # Pre-populates 20+ students, jobs, drives, questions
│   ├── controllers/
│   │   ├── analyticsController.js        # Aggregates real placement telemetry
│   │   ├── applicationController.js      # 7-stage status transitions & interview booking
│   │   ├── authController.js             # Register, login, me, and password change
│   │   ├── driveController.js            # Campus drive creation & eligibility checks
│   │   ├── interviewController.js        # Question banks, rule evaluation & readiness score
│   │   ├── jobController.js              # Search, filter, 6-factor match, recommendations
│   │   ├── notificationController.js     # In-app alerts
│   │   ├── profileController.js          # Student profile CRUD & completion formula
│   │   ├── resumeController.js           # Multi-template builder, PDF extraction & ATS check
│   │   └── roadmapController.js          # Skill gap calculation & item status toggling
│   ├── middleware/
│   │   ├── authMiddleware.js             # JWT verification & RBAC authorization
│   │   ├── errorHandler.js               # Sanitized error handler (no stack trace leaks)
│   │   └── uploadMiddleware.js           # Multer PDF filter (5MB limit)
│   ├── models/
│   │   ├── dbAdapter.js                  # Seamless Mongoose & In-Memory dual-model wrapper
│   │   ├── Application.js                # 7-stage status workflow schema
│   │   ├── Drive.js                      # Placement drive schema
│   │   ├── Job.js                        # Job posting & 6-factor match algorithm
│   │   ├── MockInterview.js              # Mock interview evaluation & 100-pt readiness schema
│   │   ├── Notification.js               # User notification schema
│   │   ├── Resume.js                     # 5-template resume & ATS analysis schema
│   │   ├── Roadmap.js                    # Career roadmap stages schema
│   │   ├── StudentProfile.js             # Student profile & completion % formula
│   │   └── User.js                       # User credentials & RBAC schema
│   ├── routes/                           # Modular Express routes
│   ├── uploads/                          # Local PDF storage directory
│   ├── server.js                         # Express entry point
│   ├── test-api.js                       # 14-suite integration test runner
│   ├── .env.example
│   └── package.json
├── .env.example
├── package.json                          # Root package orchestrating client and server
└── README.md
```

---

## 6. How the Rule-Based Mock AI Works (`client/src/services/aiService.js`)

In accordance with the SRS and developer requirements:
1. **Zero External Billing**: The application makes **no outbound requests** to OpenAI, Google Cloud Vertex, Anthropic, or any paid API.
2. **Deterministic & Realistic**: Returns structured JSON mimicking LLM outputs with contextual advice tailored to the student's branch, CGPA, and missing skills.
3. **Simulated Latency**: Incorporates an `800ms` non-blocking timer (`setTimeout`) to give realistic user experience feedback (loading states, thinking indicators) without costing a cent.
4. **Key Functions**:
   - `getCareerRecommendations(profile)`: Predicts the top 3 best-fit roles with salary bands and market demand metrics.
   - `generateRoadmap(careerRole)`: Generates 3 sequential learning phases with milestone assessments.
   - `analyzeReadiness(studentSkills, jobDescription)`: Evaluates candidate alignment against job requirements.
   - `answerMentorQuestion(question)`: Provides career, resume, and interview advice for final-year students.

---

## 7. Pre-Seeded Demo Credentials (1-Click Login)

The platform includes pre-seeded fictional accounts for all four SRS user classes. You can log in using either the email/password below or the **1-Click Quick Fill buttons** on the `/login` page:

| Role | Email | Password | Persona Overview |
| :--- | :--- | :--- | :--- |
| **Student** | `student@smarthire.edu` | `password123` | Aditya Sharma (B.Tech CSE, 8.85 CGPA, 100% Profile Completion) |
| **Recruiter** | `recruiter@smarthire.edu` | `password123` | Priya Mehta (Talent Acquisition Specialist @ Razorpay Technologies) |
| **Placement Officer** | `officer@smarthire.edu` | `password123` | Dr. Ramesh Kumar (Dean of Training & Placement Cell) |
| **Admin** | `admin@smarthire.edu` | `password123` | System Administrator (Campus IT Infrastructure) |

---

## 8. How to Run Locally

### Prerequisites
- Node.js (v18.x or later)
- npm (v9.x or later)

### Step 1: Install Dependencies
```bash
# From the project root
npm run install-all
```
*(Or install separately in `server/` and `client/` via `npm install`)*

### Step 2: Configure Environment Variables (Optional)
The application comes pre-configured with zero-configuration defaults. If you wish to connect to a real MongoDB Atlas cluster:
```bash
# In server/.env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smarthire?retryWrites=true&w=majority
JWT_SECRET=smarthire_jwt_secret_super_secure_key_2026_dev
```
*(If `MONGO_URI` is left blank, the server automatically boots into the high-performance in-memory fallback store).*

### Step 3: Start the Backend Server
```bash
cd server
npm start
# Server listens at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### Step 4: Start the Frontend Client
```bash
cd client
npm run dev
# Frontend runs at http://localhost:5173
```

*(You can also run both simultaneously from the root with `npm run dev`).*

### Step 5: Run the Verification Test Suite
```bash
cd server
node test-api.js
# Runs all 14 end-to-end integration tests confirming 100% passing status
```

---

## 9. How to Deploy to Production (Free Tier)

### Client Deployment (Vercel)
1. Fork or push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and select this repo.
3. Configure settings:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://smarthire-api.onrender.com/api`)
5. Click **Deploy**.

### Server Deployment (Render Free Web Service)
1. In the [Render Dashboard](https://render.com), click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add Environment Variables:
   - `PORT`: `5000`
   - `CLIENT_URL`: Your Vercel frontend URL
   - `JWT_SECRET`: A secure random string
   - `MONGO_URI`: Your free MongoDB Atlas connection string (or leave blank to use the in-memory fallback)
5. Click **Create Web Service**.

---

## 10. Conclusion & Final Year Project Defense Notes

SmartHire demonstrates how enterprise-grade academic placement portals can be built with **transparency and explainability at their core**. By replacing opaque third-party API black boxes with deterministic algorithms:
- Institutions avoid expensive recurring software billing.
- Students understand the exact metrics required to improve their employability.
- Placement officers maintain an accountable, auditable record of every candidate status change.
#   s t u d e n t - p l a c e m e n t - r e s u m e - m a n a g e m e n t - s y s t e m  
 