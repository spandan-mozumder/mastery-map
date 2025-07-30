# 🧠 MasteryMap

MasteryMap is a sleek skill-tracking app that helps you break down goals into topics and subtopics, monitor your progress, and stay accountable with deadlines — all in a clean, interactive UI.

## 🚀 Features

- ✅ Create and manage **Skill Goals** with structured **Topics** and **Subtopics**
- 📈 Real-time **progress tracking** with visual progress bars
- 📅 Assign **deadlines** to your goals for accountability
- 🖱️ One-click checkboxes for completion
- ✏️ Easily **edit** goals, topics, and subtopics
- 🔐 Auth with **Clerk**
- 🌘 Dark mode support with **ThemeProvider**
- 🍞 Toast notifications with `sonner`

---

## 🛠️ Tech Stack

- **Next.js 14 App Router**
- **React** + **TypeScript**
- **Tailwind CSS** for styling
- **Prisma** + **PostgreSQL (Neon)** for database
- **Clerk** for authentication
- **Sonner** for toast notifications
- **Google Fonts** (`Ubuntu Mono`)

---

## 📦 Installation

```bash
git clone https://github.com/your-username/masterymap.git
cd masterymap
npm install
```


## ENV EXAMPLE

DATABASE_URL=your_neon_postgres_url
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api