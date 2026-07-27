# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 27.x | ✅ |
| 26.x | ❌ |
| 25.x | ❌ |

---

# Reporting a Vulnerability

If you discover a security vulnerability in MES CORE, please do not create a public GitHub issue.

Instead:

- Contact the project maintainers.
- Include detailed reproduction steps.
- Provide screenshots or logs when applicable.
- Include affected module(s).
- Include browser and operating system information.

---

## Scope

Security reports may include:

- Authentication
- Authorization
- Firestore Rules
- Firebase Storage
- Offline Cache
- IndexedDB
- Local Storage
- Queue Engine
- Synchronization
- Session Management
- Service Worker
- Cross-Site Scripting (XSS)
- Injection Attacks
- Privilege Escalation
- Data Leakage

---

## Response Timeline

| Stage | Target |
|--------|--------|
| Initial Response | 48 Hours |
| Investigation | 5 Business Days |
| Mitigation | As Soon As Possible |
| Public Disclosure | After Patch Release |

---

## Best Practices

- Always use HTTPS.
- Keep Firebase Security Rules up to date.
- Apply the principle of least privilege.
- Never expose Firebase API secrets in client code.
- Validate all user input.
- Sanitize exported data.
- Review authentication roles regularly.
- Keep dependencies updated.

---

## Disclosure Policy

Please allow adequate time for investigation and remediation before publicly disclosing any security issue.

Responsible disclosure helps protect all users of the MES CORE platform.
