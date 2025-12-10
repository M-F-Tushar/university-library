# University Digital Library

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A full-stack web application for university students to access books, past questions, notes, and digital resources.

## ✨ Features

- **User Roles**: Admin and Student with role-based access control
- **Resource Management**: Upload PDFs, add external links, categorize by department/course
- **Search & Filter**: Browse resources by category, department, semester
- **Bookmarks**: Save resources for later
- **PWA Support**: Works offline with service worker caching
- **Responsive Design**: Mobile-first approach with modern UI

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | SQLite (Dev) / PostgreSQL (Prod) |
| ORM | Prisma 5.22 |
| Authentication | NextAuth.js v5 |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/M-F-Tushar/university-library.git
   cd university-library
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your settings:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup Database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open Browser**
   Visit [http://localhost:3000](http://localhost:3000)

### Default Users (from Seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `password123` |
| Student | `student@example.com` | `password123` |

## 📁 Project Structure

```
university-library/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   ├── resources/          # Resource pages
│   └── ui/                 # Shared UI components
├── components/             # Reusable React components
│   ├── ui/                 # Base UI components
│   └── search/             # Search components
├── lib/                    # Utility functions
│   ├── prisma.ts           # Database client
│   ├── security/           # Rate limiting, validation
│   └── analytics/          # Metrics tracking
├── prisma/                 # Database schema & migrations
├── public/                 # Static assets
└── tests/                  # Test files
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
   
   Click the "Fork" button on GitHub to create your own copy.

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/university-library.git
   cd university-library
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes:
   git checkout -b fix/bug-description
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic

5. **Test your changes**
   ```bash
   npm run build          # Ensure build passes
   npm run typecheck      # Check TypeScript
   npm test               # Run tests
   ```

6. **Commit with meaningful messages**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   # or
   git commit -m "fix: resolve issue description"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes clearly

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style (formatting, semicolons) |
| `refactor:` | Code refactoring |
| `test:` | Adding or updating tests |
| `chore:` | Build process, dependencies |

### Code Style Guidelines

- Use **TypeScript** for all new files
- Follow **ESLint** rules (`npm run lint`)
- Use **Prettier** for formatting
- Component files: PascalCase (`Button.tsx`)
- Utility files: camelCase (`formatDate.ts`)
- Use React Server Components where possible
- Prefer `const` over `let`

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript check
npm test             # Run tests
npx prisma studio    # Open database GUI
```

### Areas for Contribution

- 🐛 Bug fixes
- 📝 Documentation improvements
- ♿ Accessibility enhancements
- 🎨 UI/UX improvements
- ✅ Test coverage
- 🌐 Internationalization (i18n)
- ⚡ Performance optimization

## 📋 Issues & Feature Requests

- Check [existing issues](https://github.com/M-F-Tushar/university-library/issues) before creating new ones
- Use issue templates when available
- Provide clear descriptions and steps to reproduce bugs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons

---

<p align="center">
  Made with ❤️ for university students
</p>
