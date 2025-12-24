# Sukrit - Project Documentation

A Next.js-based mental health and counseling platform that connects students, teachers, psychologists, and educational institutes. The platform provides confidential chat sessions, wellness tracking, and institute management capabilities.

## Table of Contents

- [Project Overview](#project-overview)
- [Dependencies](#dependencies)
- [Setup Instructions](#setup-instructions)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)

---

## Project Overview

**Sukrit** is a comprehensive mental health platform designed for educational institutions. It enables:

- **Multi-role Authentication**: Separate login systems for institutes, students, teachers, and psychologists
- **Confidential Chat System**: Secure messaging between students and counselors
- **Institute Management**: CRUD operations for managing staff, students, and institute details
- **Wellness Tracking**: Data visualization and tracking of student wellness metrics
- **Session Management**: Tagging and updating counseling sessions

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React & React Icons

---

## Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^14.2.16 | React framework with SSR/SSG |
| `react` | ^18.3.1 | UI library |
| `react-dom` | ^18.3.1 | React DOM renderer |
| `mongoose` | ^9.0.1 | MongoDB ODM |
| `jsonwebtoken` | ^9.0.3 | JWT authentication |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `cookies-next` | ^6.1.1 | Cookie management |
| `recharts` | ^3.5.1 | Chart/graph visualization |
| `lucide-react` | ^0.561.0 | Icon library |
| `react-icons` | ^5.5.0 | Additional icons |
| `formidable` | ^3.5.4 | Form data parsing |
| `papaparse` | ^5.5.3 | CSV parsing |
| `csv-parser` | ^3.2.0 | CSV file parsing |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5 | TypeScript compiler |
| `tailwindcss` | ^3.4.1 | Utility-first CSS framework |
| `postcss` | ^8.5.6 | CSS post-processor |
| `autoprefixer` | ^10.4.23 | CSS vendor prefixing |
| `eslint` | ^8.57.1 | Code linting |
| `eslint-config-next` | ^14.2.35 | Next.js ESLint config |
| `@types/node` | ^20 | Node.js type definitions |
| `@types/react` | ^19 | React type definitions |
| `@types/react-dom` | ^19 | React DOM type definitions |

---

## Setup Instructions

### Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **pnpm**
- **MongoDB** (local instance or MongoDB Atlas account)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd sukrit
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/sukrit
# or for MongoDB Atlas:
# MONGODB_URI=your mongodb uri

# Optional: JWT Secret (if not hardcoded in the application)
JWT_SECRET=your-secret-key-here
```

**Important**: 
- Replace `MONGODB_URI` with your actual MongoDB connection string
- For local MongoDB: `mongodb://localhost:27017/sukrit`
- For MongoDB Atlas: Use the connection string from your Atlas dashboard
- Keep `.env.local` in `.gitignore` (never commit secrets)

### Step 4: Database Setup

1. **Local MongoDB**: Ensure MongoDB is running on your system
   ```bash
   # Windows (if installed as service, it should auto-start)
   # Or start manually:
   mongod
   
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **MongoDB Atlas**: 
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string
   - Add your IP to the whitelist
   - Update `MONGODB_URI` in `.env.local`

### Step 5: Verify Installation

Check that all dependencies are installed correctly:

```bash
npm list --depth=0
```

---

## Running Locally

### Development Mode

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API Routes**: http://localhost:3000/api/*

The development server includes:
- Hot module replacement (HMR)
- Fast refresh for React components
- Error overlay in the browser

### Production Build

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

---

## Project Structure

```
sukrit/
├── Configuration Files
│   ├── next-env.d.ts          # Next.js TypeScript environment types
│   ├── next.config.js          # Next.js configuration
│   ├── package.json            # Project dependencies and scripts
│   ├── package-lock.json       # Locked dependency versions
│   ├── postcss.config.js       # PostCSS configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── README.md               # Basic Next.js README
│
└── src/
    ├── app/                    # Next.js App Router directory
    │   ├── api/                # API Routes (Backend endpoints)
    │   │   ├── auth/           # Authentication endpoints
    │   │   │   ├── login/      # General login
    │   │   │   ├── register/   # User registration
    │   │   │   ├── register-institute/  # Institute registration
    │   │   │   ├── staff-login/         # Staff login
    │   │   │   └── student-login/       # Student login
    │   │   │
    │   │   ├── chat/           # Chat functionality
    │   │   │   ├── inbox/      # Get user inbox
    │   │   │   ├── messages/   # Get messages for a session
    │   │   │   ├── send-message/        # Send a message
    │   │   │   ├── session/    # Session management
    │   │   │   │   └── update/ # Update session details
    │   │   │   └── tag-session/         # Tag sessions
    │   │   │
    │   │   ├── institute/      # Institute management
    │   │   │   ├── counselors/          # Get counselors list
    │   │   │   ├── delete-account/      # Delete institute account
    │   │   │   ├── delete-staff/        # Delete staff member
    │   │   │   ├── delete-student/      # Delete student
    │   │   │   ├── details/    # Get institute details
    │   │   │   ├── generate-staff/      # Generate staff accounts
    │   │   │   ├── list/       # List all institutes
    │   │   │   ├── staff-list/ # Get staff list
    │   │   │   ├── student-list/        # Get student list
    │   │   │   ├── tag-session/         # Tag sessions
    │   │   │   ├── update/     # Update institute
    │   │   │   ├── update-profile/      # Update profile
    │   │   │   ├── update-staff/        # Update staff details
    │   │   │   ├── update-whitelist/    # Update whitelist
    │   │   │   └── wellness-data/       # Get wellness metrics
    │   │   │
    │   │   ├── public/         # Public API endpoints
    │   │   │   └── institutes/ # Public institute listing
    │   │   │
    │   │   ├── fix-db/         # Database repair utility
    │   │   └── repair/         # Database repair endpoint
    │   │
    │   ├── dashboard/          # Dashboard page
    │   │   └── page.js
    │   │
    │   ├── login/              # General login page
    │   │   └── page.js
    │   │
    │   ├── psychologist/       # Psychologist pages
    │   │   ├── login/          # Psychologist login
    │   │   └── page.js         # Psychologist dashboard
    │   │
    │   ├── register/           # Registration page
    │   │   └── page.js
    │   │
    │   ├── student/            # Student pages
    │   │   ├── login/          # Student login
    │   │   └── page.js         # Student dashboard
    │   │
    │   ├── teacher/            # Teacher pages
    │   │   └── login/          # Teacher login
    │   │
    │   ├── globals.css         # Global styles
    │   ├── layout.js           # Root layout component
    │   └── page.js             # Home page
    │
    ├── components/             # Reusable React components
    │   ├── ChatLayout.js       # Chat interface layout
    │   ├── ConfidentialChat.js # Confidential chat component
    │   ├── CounselorLayout.js  # Counselor dashboard layout
    │   ├── InstituteSearch.js  # Institute search component
    │   ├── PasswordInput.js    # Password input with show/hide
    │   └── WellnessGraph.js    # Wellness data visualization
    │
    ├── lib/                    # Utility libraries
    │   └── db.js               # MongoDB connection utility
    │
    └── models/                 # Mongoose data models
        ├── ChatSession.js      # Chat session schema
        ├── Message.js          # Message schema
        ├── Session.js          # Counseling session schema
        └── User.js             # User schema (all roles)
```

### Directory Overview

#### Root Level
- **Configuration Files**: Next.js, TypeScript, Tailwind CSS, and PostCSS configuration
- **Package Management**: Dependencies and lock files

#### `src/app/` - Next.js App Router
- **API Routes** (`api/`): Backend REST API endpoints
  - **auth/**: Authentication and authorization
  - **chat/**: Real-time chat and messaging
  - **institute/**: Institute CRUD and management
  - **public/**: Public-facing endpoints
  - **fix-db/**, **repair/**: Database maintenance utilities

- **Pages**: Frontend routes and pages
  - Role-specific dashboards and login pages
  - Main layout and global styles

#### `src/components/` - React Components
- Reusable UI components for chat, counseling, and data visualization

#### `src/lib/` - Utilities
- Database connection handler with connection pooling

#### `src/models/` - Data Models
- Mongoose schemas for User, Session, ChatSession, and Message

---

## Usage Guide

### User Roles

The platform supports four main user roles:

1. **Institute**: Educational institutions that manage students and staff
2. **Student**: Students who can access counseling services
3. **Teacher**: Teaching staff with limited access
4. **Psychologist**: Counselors who provide mental health support

### Common Workflows

#### For Institutes

1. **Registration**: Register at `/register` with institute details
2. **Login**: Access dashboard at `/login` (institute role)
3. **Manage Staff**: Generate, update, or delete staff accounts
4. **Manage Students**: Add, update, or remove students
5. **View Analytics**: Access wellness data and metrics

#### For Students

1. **Login**: Use USN and password at `/student/login`
2. **Access Chat**: Start confidential chat sessions with counselors
3. **View Sessions**: Track counseling session history

#### For Psychologists

1. **Login**: Access at `/psychologist/login`
2. **View Sessions**: Manage assigned counseling sessions
3. **Chat**: Communicate with students through secure chat
4. **Tag Sessions**: Categorize and update session status

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - General login
- `POST /api/auth/student-login` - Student login
- `POST /api/auth/staff-login` - Staff login
- `POST /api/auth/register-institute` - Institute registration

#### Chat
- `GET /api/chat/inbox` - Get user's chat inbox
- `GET /api/chat/messages?sessionId=...` - Get messages
- `POST /api/chat/send-message` - Send a message
- `GET /api/chat/session` - Get session details
- `PUT /api/chat/session/update` - Update session

#### Institute Management
- `GET /api/institute/list` - List all institutes
- `GET /api/institute/details` - Get institute details
- `PUT /api/institute/update` - Update institute
- `GET /api/institute/student-list` - Get students
- `GET /api/institute/staff-list` - Get staff
- `POST /api/institute/generate-staff` - Generate staff accounts

### Environment Variables

Required environment variables:

- `MONGODB_URI`: MongoDB connection string (required)

Optional:
- `JWT_SECRET`: Secret key for JWT tokens (if not hardcoded)
- `NODE_ENV`: Environment (development/production)

### Troubleshooting

#### Database Connection Issues

If you encounter MongoDB connection errors:

1. Verify MongoDB is running:
   ```bash
   # Check MongoDB status
   mongosh --eval "db.version()"
   ```

2. Check connection string in `.env.local`:
   - Ensure `MONGODB_URI` is correctly formatted
   - For Atlas: Verify IP whitelist and credentials

3. Test connection:
   ```bash
   # Test MongoDB connection
   mongosh "your-connection-string"
   ```

#### Port Already in Use

If port 3000 is already in use:

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

#### Module Not Found Errors

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Additional Notes

- The application uses Next.js App Router (not Pages Router)
- All API routes are serverless functions
- Database models use Mongoose with connection pooling
- Authentication uses JWT tokens stored in cookies
- Password hashing uses bcryptjs
- The project supports CSV import for bulk operations

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Next.js documentation: https://nextjs.org/docs
3. Check MongoDB documentation: https://docs.mongodb.com

