# MES CORE V28 Enterprise

Enterprise Manufacturing Execution System for refrigerator production operations.

## Core Modules

- Authentication & role-based access
- Executive Dashboard
- Production tracking
- Quality / defect tracking
- Waste tracking & cost
- TPM activities
- Analytics & Pareto
- Reports & multi-domain export
- Offline-first queue & cloud synchronization
- Firebase Firestore
- PWA / Service Worker
- Backup and restore

## Architecture

```text
UI
 ↓
Application Shell / Router
 ↓
Domain Services
 ├── Production
 ├── Quality
 ├── Waste
 ├── TPM
 └── Analytics
 ↓
Repository / API Layer
 ↓
Firestore + Offline Queue
```

## Main Technologies

- HTML5 / CSS3 / JavaScript ES2023
- Firebase Authentication / Firestore / Storage
- Bootstrap 5
- Chart.js
- XLSX
- jsPDF
- Vite

## Security

Firestore rules enforce roles server-side. Supported roles:

`admin` · `production_manager` · `engineer` · `supervisor` · `operator` · `viewer`

A newly registered account is restricted to `viewer` until an administrator changes its role.

## Offline Mode

Production, Quality, Waste, and TPM writes are queued locally when the browser is offline and synchronized when connectivity returns.

## Firebase Setup

1. Configure the Firebase project values in `js/firebase.js`.
2. Enable Authentication, Firestore, and Storage.
3. Deploy rules and indexes.
4. Deploy Firebase Hosting.

```bash
npm install
npm run build
npm run hosting
npm run rules
npm run indexes
```

## CI

GitHub Actions runs an automated Vite build on pushes and pull requests to `main`.

## Version

**MES CORE V28 Enterprise**
