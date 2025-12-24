# Sukrit

A Next.js-based mental health and counseling platform connecting students, teachers, psychologists, and educational institutes.

## Features

- 🔐 **Multi-role Authentication** - Separate login systems for institutes, students, teachers, and psychologists
- 💬 **Confidential Chat System** - Secure messaging between students and counselors
- 🏫 **Institute Management** - CRUD operations for managing staff, students, and institute details
- 📊 **Wellness Tracking** - Data visualization and tracking of student wellness metrics
- 📝 **Session Management** - Tagging and updating counseling sessions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Styling**: Tailwind CSS
- **Charts**: Recharts

## Prerequisites

- Node.js (v18+)
- npm/yarn/pnpm
- MongoDB (local or MongoDB Atlas)

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd sukrit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/sukrit
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sukrit
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── api/         # API routes (auth, chat, institute)
│   └── [pages]/     # Frontend pages
├── components/       # React components
├── lib/             # Utilities (db.js)
└── models/          # Mongoose models
```

## User Roles

- **Institute** - Manage students, staff, and view analytics
- **Student** - Access counseling services and chat
- **Teacher** - Limited access to student information
- **Psychologist** - Manage counseling sessions and chat with students

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - General login
- `POST /api/auth/student-login` - Student login
- `POST /api/auth/staff-login` - Staff login

### Chat
- `GET /api/chat/inbox` - Get user's chat inbox
- `GET /api/chat/messages` - Get messages
- `POST /api/chat/send-message` - Send a message

### Institute Management
- `GET /api/institute/list` - List all institutes
- `GET /api/institute/details` - Get institute details
- `GET /api/institute/student-list` - Get students
- `GET /api/institute/staff-list` - Get staff

## Dependencies

**Key Dependencies:**
- `next` ^14.2.16
- `react` ^18.3.1
- `mongoose` ^9.0.1
- `jsonwebtoken` ^9.0.3
- `bcryptjs` ^3.0.3
- `tailwindcss` ^3.4.1
- `recharts` ^3.5.1

See `package.json` for the complete list.

## Troubleshooting

**Database Connection Issues:**
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- For Atlas: Verify IP whitelist and credentials

**Port Already in Use:**
```bash
npm run dev -- -p 3001
```

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]
