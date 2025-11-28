# University Digital Library                             

A full-stack web application for university students to access books, past questions, notes, and digital resources.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (Local) / PostgreSQL (Production-ready) via Prisma ORM
- **Authentication**: NextAuth.js v5

## Features

- **User Roles**: Admin and Student.
- **Resource Management**: Upload PDFs, add external links, categorize by department/course.
- **Search & Filter**: Browse resources by category, department, semester.
- **Bookmarks**: Save resources for later.
- **File Uploads**: Local file storage for PDFs.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Setup Database**:
    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open Browser**:
    Visit [http://localhost:3000](http://localhost:3000)

## Default Users (from Seed)

- **Admin**: `admin@example.com` / `password123`
- **Student**: `student@example.com` / `password123`

## Project Structure

- `app/`: Next.js App Router pages and API routes.
- `prisma/`: Database schema and seed script.
- `public/uploads/`: Stored PDF files.
- `lib/`: Utility functions (Prisma client).
