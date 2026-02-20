# Splitr 💸

A modern expense splitting app that makes it easy to track shared expenses and settle up with friends and groups — built with Next.js, Convex, and Clerk.

---

## Features

- **Group Expense Tracking** — Create groups and add shared expenses between members
- **Balance Calculation** — Automatically calculates who owes who and how much
- **Authentication** — Secure sign-in and user management via Clerk
- **Real-time Updates** — Live syncing powered by Convex
- **Add Expenses** — Log new expenses with amounts, descriptions, and splits

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js](https://nextjs.org/) | React framework (App Router) |
| [Convex](https://convex.dev/) | Backend, database & real-time sync |
| [Clerk](https://clerk.com/) | Authentication & user management |
| [Inngest](https://www.inngest.com/) | Background jobs & event-driven functions |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Convex](https://dashboard.convex.dev/) account
- A [Clerk](https://dashboard.clerk.com/) account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/splitr.git
cd splitr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of your project:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

### 4. Start the Convex development server

```bash
npx convex dev
```

### 5. Run the Next.js development server

In a separate terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
splitr/
├── app/                    # Next.js App Router pages
│   ├── api/
│   │   └── inngest/        # Inngest serverless functions route
│   ├── expenses/
│   │   └── new/            # Add new expense page
│   └── layout.js           # Root layout with Clerk provider
├── convex/                 # Convex backend
│   ├── groups.js           # Group & balance logic
│   └── schema.js           # Database schema
├── lib/
│   └── inngest/
│       └── client.js       # Inngest client setup
├── public/
│   └── logos/              # Static assets
└── .env.local              # Environment variables (not committed)
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (from Clerk dashboard) |
| `CLERK_SECRET_KEY` | Clerk secret key (from Clerk dashboard) |
| `NEXT_PUBLIC_CONVEX_URL` | Your Convex deployment URL |

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request