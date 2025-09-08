# Microdemo Studio

A modern web application for creating and managing interactive demos.

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL (for production) or SQLite (for development)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/microdemo-studio.git
   cd microdemo-studio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

4. **Set up the database**
   ```bash
   pnpm prisma migrate dev --name init
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Start the production server**
   ```bash
   pnpm start
   ```

## Deployment

### Vercel

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Import the repository to Vercel
3. Set up the following environment variables in Vercel:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A secure random string (use `openssl rand -base64 32` to generate one)
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.vercel.app`)
4. Deploy!

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Database connection string |
| `NODE_ENV` | No | Set to `production` in production |
| `NEXTAUTH_SECRET` | Yes | Secret used to encrypt cookies and tokens |
| `NEXTAUTH_URL` | Yes | The canonical URL of your site |

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type checking
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components

## License

MIT
