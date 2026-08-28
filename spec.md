Project Overview & Tech Stack
Project Overview
Build a full-stack, centralized web-based platform called College Complaint Management System (EduFix) that digitizes campus issue tracking. The system enables students to report problems related to facilities (classrooms, labs, hostels, Wi-Fi, transportation, cleanliness), routes complaints to designated campus administrative departments, tracks progress through a standard lifecycle (Submitted → Under Review → Assigned → In Progress → Resolved → Closed), provides automated escalation and AI-powered categorizations, and delivers real-time status updates via WebSockets and email alerts.

Tech Stack
Frontend: React 19, Next.js (Pages Router), Tailwind CSS, Zustand (state management), Axios, Socket.IO client, Lucide React (icons), and Recharts (analytics charts).

Backend: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens (JWT), Socket.IO server, Helmet, Morgan, Express-Rate-Limit, Express-Validator, Nodemailer, and Bcryptjs.

AI Integration: Google Generative AI SDK (Gemini) / OpenRouter API for automated complaint categorization, duplicate detection, image issue classification, and resolution summary generation.

Storage & Infrastructure: Cloudinary SDK for complaint image/attachment uploads, Redis with BullMQ for escalation queues and notification background processing (with in-memory fallback).

Authentication, Workflows, and Role-Based Access Control
Authentication
The authentication system supports student registration and login with domain-restricted email checks (e.g., @college.edu), JWT-based session management, role-based authorization middleware, an /api/auth/me profile endpoint, bcrypt password hashing (cost factor 12), and persistent state on the client via Zustand.

Complaint Lifecycle Workflow
Users and administrators interact with complaints across a structured lifecycle:

Submitted⟶Under Review⟶Assigned⟶In Progress⟶Resolved⟶Closed
Student Actions: Submit complaints with title, category, priority, description, precise campus location, and optional media attachments. Students view live progress, receive notifications, comment on open tickets, and rate/review resolved complaints.

Admin Actions: Review incoming tickets, adjust priorities (Low, Medium, High, Critical), reassign complaints to specific departments (e.g., IT Support, Facilities, Hostel Admin), post internal notes or public status updates, and approve/close resolved tickets.

Escalation Service: Automatically identifies complaints remaining in Submitted or Assigned states beyond department SLAs and escalates priority or notifies higher admins.

Role Separation
Student: Create complaints, view personal complaint history, comment on owned tickets, provide feedback and ratings upon resolution.

Department Staff: View and manage complaints assigned to their specific department, update status (In Progress, Resolved), upload proof of resolution images, add comments.

Super Admin: Manage departments, assign staff, view system-wide analytics, reassign tickets across departments, manage user roles, and adjust SLA parameters.

Integrations, AI Features, and Real-Time Layer
AI-Powered Complaint Intelligence
Auto-Categorization & Priority Suggestion: Evaluates incoming complaint text and suggests optimal category and default priority using Gemini/OpenRouter.

Image Issue Classification: Scans attached images to verify relevance and infer problem context (e.g., broken furniture, water leakage, burnt wiring).

Duplicate Detection: Scans recent open complaints within the same location/category using semantic similarity to flag potential duplicates and merge ticket interest.

Resolution Summarization: Summarizes long comment threads into concise resolution summaries for administrative reporting.

Real-Time Layer & Email Notifications
Socket.IO Real-Time Events: Emits live events (complaint:created, complaint:status_updated, complaint:comment_added, complaint:escalated) to room channels partitioned by userId, departmentId, and complaintId.

Nodemailer Integration: Sends asynchronous email notifications for ticket confirmation, status progression, staff assignment, and escalation alerts via background queue workers.

Frontend Pages
The application utilizes the Next.js Pages Router. Unauthenticated users visiting / are routed to /login, while authenticated users route to their designated role dashboard.

/ – Landing page highlighting platform features, SLA transparency dashboard, public notice board, and login/register CTAs.

/login – Domain-restricted authentication form with JWT management, validation errors, and Zustand session binding.

/register – Student registration page requiring full name, student ID, department, batch, and college email address.

/dashboard – Student central console displaying active complaints, status timelines, quick report button, and notification updates.

/admin/dashboard – Executive administrative hub featuring complaint volume metrics, department resolution SLA tracking, priority breakdown charts, and real-time activity feeds.

/complaints/new – Form for submitting complaints with location pickers, category dropdowns, file/photo upload preview, and AI smart tagging suggestions.

/complaints – Searchable, filterable list of complaints with status badges, category tags, creation date, and priority indicators.

/complaints/[id] – Detailed complaint view containing status stepper, department assignments, attached media, public timeline, internal admin notes, comment thread, and rating widget.

/admin/departments – Super-admin panel for creating departments, managing department staff memberships, and defining resolution SLA targets.

/settings – Profile configuration, password updates, notification preference toggles, and UI theme controls.

Backend Architecture & Database Collections
Backend Architecture
Routes: Express routers declaring routes, binding middleware (protect, authorize, validate), and mapping to controllers.

Controllers: Thin handlers for parsing request payloads, delegating execution to services, and returning structured JSON responses.

Services: Business logic layer handling complaint state transitions, duplicate detection, SLA calculation, and image processing.

AI Layer: Service abstraction wrapping Gemini / OpenRouter API calls with fallbacks to regex/keyword rules.

Queues Layer: BullMQ setup backed by Redis handling async background emails and time-based SLA escalation jobs.

Database Collections
Users
TypeScript
{
  _id: ObjectId,
  name: String,
  email: String, // Unique, domain validated
  passwordHash: String, // select: false
  role: 'student' | 'staff' | 'admin',
  departmentId: ObjectId, // Ref: Departments (for staff)
  studentId: String,
  contactNumber: String,
  createdAt: Date
}
Complaints
TypeScript
{
  _id: ObjectId,
  ticketId: String, // Unique auto-generated ID (e.g., CMP-2026-0891)
  title: String,
  description: String,
  category: 'Classroom' | 'Laboratory' | 'Hostel' | 'Wi-Fi' | 'Infrastructure' | 'Transportation' | 'Cleanliness' | 'Other',
  priority: 'Low' | 'Medium' | 'High' | 'Critical',
  status: 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed',
  location: {
    building: String,
    floor: String,
    roomNumber: String,
    additionalDetails: String
  },
  attachments: [{ url: String, publicId: String, fileType: String }],
  studentId: ObjectId, // Ref: Users
  assignedDepartmentId: ObjectId, // Ref: Departments
  assignedStaffId: ObjectId, // Ref: Users
  aiMetadata: {
    suggestedCategory: String,
    confidenceScore: Number,
    isPotentialDuplicate: Boolean,
    duplicateOfComplaintId: ObjectId
  },
  resolutionDetails: {
    summary: String,
    resolvedAt: Date,
    proofAttachments: [{ url: String }]
  },
  feedback: {
    rating: Number, // 1 - 5 stars
    comment: String,
    createdAt: Date
  },
  slaDueDate: Date,
  isEscalated: Boolean,
  createdAt: Date,
  updatedAt: Date
}
Departments
TypeScript
{
  _id: ObjectId,
  name: String, // e.g., "IT & Network Infrastructure"
  code: String, // e.g., "IT-DEPT"
  headStaffId: ObjectId, // Ref: Users
  slaHours: {
    Low: Number,
    Medium: Number,
    High: Number,
    Critical: Number
  },
  createdAt: Date
}
ComplaintComments
TypeScript
{
  _id: ObjectId,
  complaintId: ObjectId, // Ref: Complaints
  authorId: ObjectId, // Ref: Users
  isInternalNote: Boolean, // True for admin/staff internal notes
  message: String,
  attachments: [{ url: String }],
  createdAt: Date
}
Notifications
TypeScript
{
  _id: ObjectId,
  recipientId: ObjectId, // Ref: Users
  complaintId: ObjectId, // Ref: Complaints
  title: String,
  message: String,
  type: 'STATUS_CHANGE' | 'ASSIGNMENT' | 'COMMENT' | 'ESCALATION',
  isRead: Boolean,
  createdAt: Date
}
API Endpoints
Auth & User Management
POST /api/auth/register – Register new student/staff account.

POST /api/auth/login – Authenticate user and issue JWT.

GET /api/auth/me – Get authenticated user details.

PUT /api/auth/profile – Update profile settings and notification preferences.

Complaints Core API
POST /api/complaints – Submit a new complaint (supports multipart/form-data attachments).

GET /api/complaints – Query user or system complaints (supports filter by category, status, priority, building; pagination).

GET /api/complaints/:id – Fetch single complaint timeline and full details.

PUT /api/complaints/:id/status – Update complaint lifecycle status (Admin/Staff).

PUT /api/complaints/:id/assign – Assign complaint to department and specific staff member (Admin).

POST /api/complaints/:id/comments – Add a public comment or internal admin note.

POST /api/complaints/:id/feedback – Submit resolution rating and feedback (Student).

Admin & Department Management
GET /api/admin/stats – Aggregated metric endpoint (open tickets, avg resolution time, SLA breach rate, category breakdown).

GET /api/admin/departments – List all departments and member counts.

POST /api/admin/departments – Create a new campus administrative department.

PUT /api/admin/departments/:id – Update department settings and SLA targets.

Folder Structure & Development Phases
Directory Structure
Plaintext
college-complaint-system/
├── client/                      # Next.js Frontend
│   └── src/
│       ├── components/
│       │   ├── layout/          # AppShell, Navbar, Sidebar
│       │   ├── dashboard/       # StatsCards, PriorityChart, TicketTable
│       │   ├── complaints/      # ComplaintCard, StatusStepper, CommentThread, RatingWidget
│       │   └── ui/              # Buttons, Modals, Badges, Inputs
│       ├── pages/
│       │   ├── _app.js
│       │   ├── index.js
│       │   ├── login.js
│       │   ├── register.js
│       │   ├── dashboard.js
│       │   ├── settings.js
│       │   ├── admin/
│       │   │   ├── dashboard.js
│       │   │   └── departments.js
│       │   └── complaints/
│       │       ├── index.js
│       │       ├── new.js
│       │       └── [id].js
│       ├── store/               # Zustand state modules
│       │   ├── authStore.js
│       │   └── complaintStore.js
│       └── services/            # Axios API instances & Socket hooks
│           ├── api.js
│           └── socket.js
└── server/                      # Express Backend
    └── src/
        ├── config/              # Environment variables, DB, Redis setup
        │   ├── env.js
        │   ├── db.js
        │   └── cloudinary.js
        ├── routes/              # Express endpoint definitions
        │   ├── authRoutes.js
        │   ├── complaintRoutes.js
        │   └── adminRoutes.js
        ├── controllers/         # Request handling & HTTP responses
        │   ├── authController.js
        │   ├── complaintController.js
        │   └── adminController.js
        ├── services/            # Business logic, SLA calculation, AI logic
        │   ├── complaintService.js
        │   ├── aiService.js
        │   ├── notificationService.js
        │   └── slaService.js
        ├── models/              # Mongoose schemas
        │   ├── User.js
        │   ├── Complaint.js
        │   ├── Department.js
        │   ├── ComplaintComment.js
        │   └── Notification.js
        └── queues/              # BullMQ queue handlers
            ├── emailQueue.js
            └── escalationQueue.js
Development Phases
Phase 1: Foundation & Auth: Database schemas, Express API boilerplate, JWT auth with role controls, Next.js AppShell layout, and Zustand authentication store.

Phase 2: Core Complaint Management: Ticket creation forms, Cloudinary attachment integration, student dashboard, and admin complaint listing with filters.

Phase 3: Workflows & Department Routing: Status lifecycle transitions (Submitted → Closed), department staff routing, internal notes, and complaint detail timeline pages.

Phase 4: Real-time Updates & Notifications: Socket.IO integration for instant UI updates, Nodemailer setup with background queues for email notifications on ticket progress.

Phase 5: AI Integration & SLA Automation: AI auto-categorization and duplicate detection using Gemini SDK, automated SLA tracking with background escalation queues.

Phase 6: Analytics, Ratings & Polish: Admin analytics dashboard with Recharts, student resolution rating system, UI responsive polishing, and test deployment execution.

UI, Security, Outcome, and Execution Rules
UI and UX Requirements
The interface must follow a clean modern campus dashboard aesthetic with dark/light mode compatibility using Tailwind CSS. It must feature responsive mobile-first layouts, crisp status badges (Submitted = Amber, In Progress = Blue, Resolved = Green, Critical = Red), clear stepper diagrams for resolution tracking, interactive chart visuals for admin metrics, and toast alerts for real-time Socket events.

Security Requirements
Data Protection: Hash all user passwords using bcrypt (cost 12), enforce JWT secret signature validation on all protected endpoints, and restrict cross-origin access using configured CORS policies.

API Hardening: Set HTTP security headers with Helmet, enforce endpoint rate limiting via Express-Rate-Limit on authentication routes, and validate and sanitize all input payloads using express-validator.

Credential Encryption: Encrypt API keys and external access tokens securely; never log unhandled exceptions or expose internal trace details to client consumers.

Final Expected Outcome
The complete platform replaces manual campus complaint logs with a structured, automated ticket hub. Students receive complete transparency over reported campus issues, department administrators gain automated complaint categorization and routing capabilities, and college leadership benefits from actionable analytics regarding department performance and infrastructure health.

Implementation Guidelines
Separation of Concerns: Keep Express controllers thin by delegating business logic and database mutations directly to service modules. Never write Mongoose queries directly inside controllers.

Resilient AI Layer: Always wrap AI API calls with default rule-based fallback handlers (e.g., keyword category mapping) so AI service outages do not crash ticket creation.

Data Integrity: Ensure status updates emit Socket.IO payload events and populate internal execution logs to maintain audit records for escalation history.

Environment Fallbacks: Provide fallback handling for Redis and Cloudinary connections to ensure local development remains functional without external dependencies.