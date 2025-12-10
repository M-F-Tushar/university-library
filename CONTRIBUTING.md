# Contributing to University Digital Library

Thank you for your interest in contributing! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please:

- Be respectful and constructive in discussions
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other contributors

## Getting Started

### Find an Issue

1. Check the [Issues](https://github.com/M-F-Tushar/university-library/issues) page
2. Look for issues labeled `good first issue` or `help wanted`
3. Comment on the issue to let others know you're working on it

### No Suitable Issue?

- Open a new issue describing the bug or feature
- Wait for maintainer feedback before starting work
- This prevents duplicate effort

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/university-library.git
cd university-library

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Initialize database
npx prisma migrate dev --name init
npx prisma db seed

# Start development server
npm run dev
```

## Making Changes

### 1. Create a Branch

```bash
# For features
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/bug-description

# For documentation
git checkout -b docs/what-you-changed
```

### 2. Make Your Changes

- Write clean, readable code
- Add comments for complex logic
- Update documentation if needed
- Add tests for new functionality

### 3. Test Your Changes

```bash
npm run build        # Must pass
npm run typecheck    # Must pass
npm test             # Run tests
npm run lint         # Check style
```

### 4. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat: add search autocomplete"

# Bug fixes
git commit -m "fix: resolve login redirect loop"

# Documentation
git commit -m "docs: update API documentation"

# Style/formatting
git commit -m "style: format code with prettier"

# Refactoring
git commit -m "refactor: extract validation logic"

# Tests
git commit -m "test: add unit tests for auth"
```

## Pull Request Process

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch

3. **Fill out the PR template**
   - Describe what you changed
   - Link related issues
   - Add screenshots if applicable

4. **Wait for Review**
   - Maintainers will review your code
   - Make requested changes promptly
   - Be open to feedback

5. **Merge**
   - Once approved, a maintainer will merge
   - Delete your branch after merge

## Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Avoid `any` type - use `unknown` or proper types
- Use interfaces for object shapes
- Export types when needed by other files

### React

- Use functional components with hooks
- Prefer Server Components where possible
- Keep components focused and small
- Use proper prop types

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserCard.tsx` |
| Utilities | camelCase | `formatDate.ts` |
| Constants | UPPER_SNAKE | `MAX_FILE_SIZE` |
| CSS Classes | kebab-case | `user-card-header` |

### File Organization

```
components/
├── ui/           # Base components (Button, Input)
├── feature/      # Feature-specific components
└── layout/       # Layout components
```

## Questions?

- Open a [Discussion](https://github.com/M-F-Tushar/university-library/discussions)
- Check existing issues for answers
- Ask in your PR if related to your changes

---

Thank you for contributing! 🎉
