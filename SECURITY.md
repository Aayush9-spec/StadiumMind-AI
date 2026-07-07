# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| v1.0.x  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please **do not** open a public issue. Instead, report it privately:

1.  Send an email to `security@stadiummind.ai` (example placeholder, replace in actual deployment).
2.  Provide a clear description of the vulnerability, steps to reproduce, and possible mitigations.
3.  We will acknowledge your report within 48 hours and work with you to coordinate a disclosure timeline.

## Our Security Commitments

*   **Secrets Management:** No private keys, database passwords, or Gemini API keys are committed. All secrets must be injected via environments.
*   **Input Sanitization:** API inputs are fully typed and validated using Pydantic models to prevent injection and malicious payloads.
*   **XSS Protection:** Web output relies on Next.js standard escaping mechanisms to mitigate Cross-Site Scripting (XSS).
