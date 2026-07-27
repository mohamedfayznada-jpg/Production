# Contributing Guide

Thank you for contributing to **MES CORE V27 Enterprise**.

---

# Development Workflow

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test thoroughly.
5. Run formatting and linting.
6. Open a Pull Request.

---

# Branch Naming

```
feature/<feature-name>

bugfix/<issue-name>

hotfix/<issue-name>

release/<version>

refactor/<module-name>
```

---

# Commit Message Convention

```
feat:

fix:

docs:

style:

refactor:

perf:

test:

build:

ci:

chore:
```

Example:

```
feat: add hourly production dashboard

fix: resolve offline queue synchronization

refactor: optimize analytics engine
```

---

# Coding Standards

- Use ES Modules.
- Use `const` whenever possible.
- Avoid global variables.
- Keep functions focused and reusable.
- Use descriptive naming.
- Validate all user input.
- Handle exceptions gracefully.
- Maintain backward compatibility whenever possible.

---

# Testing Checklist

- Authentication
- Dashboard
- Production
- Quality
- Reports
- Analytics
- Export
- Backup
- Offline Mode
- Firebase Synchronization
- Mobile Responsiveness
- PWA Installation

---

# Pull Request Requirements

Before submitting a Pull Request:

- Ensure the project builds successfully.
- Resolve all ESLint warnings/errors.
- Format code using Prettier.
- Verify Firestore Rules if affected.
- Update Firestore Indexes if required.
- Update documentation when introducing new features.

---

# Review Process

Every Pull Request should be reviewed for:

- Code Quality
- Performance
- Security
- Maintainability
- Readability
- Business Logic Accuracy

---

# Thank You

Your contributions help improve the MES CORE Enterprise platform.
