# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public issue
2. Email the maintainer directly or use GitHub's private vulnerability reporting
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Best Practices

This project implements:

- **Authentication**: NextAuth.js v5 with secure session handling
- **Password Hashing**: bcrypt for password storage
- **Input Validation**: Zod schemas for API validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security Headers**: HSTS, X-Frame-Options, CSP headers
- **Environment Variables**: Sensitive data stored in env vars

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Fix Timeline**: Depends on severity (critical: ASAP, high: 30 days)

Thank you for helping keep this project secure!
