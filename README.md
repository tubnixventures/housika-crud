House Rental Marketplace Backend
A secure, scalable, and audit‑friendly backend for a global rental marketplace. Built with Node.js, Hono, BunnyDB, Upstash Redis, and JWT authentication. Designed for long‑lived sessions with session IDs, modular controllers, and strict role hierarchies.

📂 Project Structure
Code
/src
  /utils          → Shared helpers (validation, logging, error handling)
  /models         → Database models (BunnyDB schema bindings)
  /controllers    → Business logic per collection
  /routes         → Hono routes mapped to controllers
  /middleware     → Auth, role checks, rate limiting
🔐 Authentication & Security
JWT issued via HTTPS from the auth backend.

Session IDs stored in Redis for long sessions.

Custom role hierarchy:

CEO → Full visibility and control (can see Admin, Customer Care, Users).

Admin → Cannot see CEO and other admins and but can see Customer Care, but cannot create fellow Admins/CEOs.

Customer Care → Limited scope; cannot see Admin or CEO data or fellow customer care but can see and create other roles.

Users → Standard marketplace participants.

Verification rules:

Only verified accounts can list properties.

Any user (verified or not) can book rooms.

Global marketplace: bookings are open across countries, currencies, and timezones.

📑 Collections & Endpoints
Each collection (except users) exposes at least 5 endpoints for CRUD + extended operations. Example:

Users
Registration (with verification flow)

Login (JWT issuance)

Profile update

Role assignment (restricted to Admin/CEO)

Session management (global logout)

Properties
Create property (verified users only)

Get property list (public)

Get property by ID

Update property (owner/admin only)

Delete property (owner/admin only)

Rooms
Add room to property

Get rooms by property

Update room details

Mark room as occupied/vacant

Delete room

Bookings
Create booking (any user)

Get booking by ID

List bookings by user/property

Update booking status

Cancel booking

Payments
Initiate payment

Verify payment gateway reference

Get payment by booking

Update payment status

Refund/rollback

Receipts
Issue receipt

Verify receipt (QR code)

Get receipt by number

Update receipt metadata

Expire receipt

Chats & Messages
Start conversation

Send message

Get chat history

Attach files

Close conversation

Contact Messages
Submit contact form

Get messages by status

Assign agent

Reply to message

Close ticket

⚙️ Setup
Clone repository

Install dependencies:

bash
npm install
Configure environment:

env
BUNNY_DATABASE_URL=libsql://your-db.bunny.net
authToken=your-bunnydb-token
REDIS_URL=your-upstash-url
JWT_SECRET=your-secret
Run schema setup:

bash
ts-node src/setup.ts
Start server:

bash
npm run dev
🛡️ Security Considerations
Role enforcement at middleware level.

Audit‑friendly logging for all CRUD operations.

Global logout invalidates all sessions across devices.

Schema‑level validation ensures airtight flows.

No raw error leaks: user‑friendly hints only.

🌍 Marketplace Rules
Verified landlords list properties.

Any user can book globally.

Currency normalization enforced at receipts/payments.

Hierarchical visibility ensures higher roles control lower roles, never vice versa.

🚀 Roadmap
Multi‑currency payment gateways

Advanced analytics dashboards

Automated compliance reports

Scalable microservice deployment