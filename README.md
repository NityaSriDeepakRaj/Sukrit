# 🌱 Sukrit

**Where emotion meets understanding**

Sukrit is a **privacy-first digital mental wellness platform** designed for academic communities.  
It provides **early, stigma-free, and personalized mental health support** for students, teachers, and counsellors, while enabling institutions to understand overall well-being trends through **anonymous insights** — without exposing individual identities.

---

## 🎯 Purpose

Mental health challenges among students, teachers, and counsellors in academic institutions are increasing rapidly due to **academic pressure, workload, burnout, and lack of emotional support**.  

Although counselling centers exist, they are often **underutilized** because of:
- Stigma and fear of judgment  
- Lack of awareness  
- Limited accessibility  

Additionally, **teachers and counsellors**, who are caregivers themselves, rarely receive mental wellness support. This leads to burnout and reduced effectiveness, affecting the entire academic ecosystem.

**Sukrit exists to solve this gap.**

Sukrit focuses on:
- **Prevention over crisis**
- **Support over surveillance**
- **Empathy over judgment**

---

## Features

- **Multi-role Authentication** - Separate login systems for institutes, students, teachers, and psychologists
- **Confidential Chat System** - Secure messaging between students and counselors
- **Institute Management** - CRUD operations for managing staff, students, and institute details
- **Wellness Tracking** - Data visualization and tracking of student wellness metrics
- **Session Management** - Tagging and updating counseling sessions


---

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
# MONGODB_URI=your_mongodb_uri_here

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
---

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

---

## 🌍 Impact

Sukrit creates a **safe digital ecosystem** where:
- Students feel heard before reaching a breaking point
- Teachers and counsellors receive the care they provide to others
- Institutions gain awareness **without surveillance**
- Mental health support becomes **accessible, ethical, and stigma-free**

---

## 🧭 Vision

Sukrit aims to redefine how mental wellness is approached in academic environments —  
by building systems that **listen first**, **protect privacy**, and **support everyone in the ecosystem**, not just those in crisis.

---

## 🤝 Contributing

This project is being built with a strong focus on **ethics, privacy, and social impact**.  
Contributions, feedback, and collaborations are welcome.

---

## 📄 License

This project is intended for **social good and responsible use**.  

---

> **Sukrit — Where emotion meets understanding.**
