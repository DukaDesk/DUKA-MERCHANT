# Configuration Policy

**KB-141-F — Configuration Policy**

| Metadata | Value |
|----------|-------|
| KB-ID | KB-141-F |
| Title | Configuration Policy |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Platform Engineering |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines conventions for repository configuration, environment management, and settings.

Consistent configuration practices reduce setup friction, prevent environment-specific bugs, and protect secrets.

---

## 2. Configuration Principles

1. **Configuration is separate from code.** Environment-specific values must not be hardcoded in source files.
2. **Defaults are safe for development.** A repository must run in a local development environment with minimal configuration.
3. **Secrets are never committed.** API keys, passwords, certificates, and tokens must use secret management.
4. **Configuration is documented.** Every configuration option must be documented with purpose, valid values, and default.

---

## 3. Required Configuration Files

Every repository must contain:

| File | Purpose |
|------|---------|
| `.gitignore` | Prevent committing secrets, build artifacts, and local files |
| `.editorconfig` | Consistent editor behavior |
| Environment example file | Template for required environment variables (e.g., `.env.example`) |
| README setup section | Instructions for configuring the repository |

---

## 4. Environment Variables

Environment variables must:

- Be declared in an example file (`.env.example`, `env.example.json`, etc.)
- Use consistent naming conventions
- Be validated at startup where possible
- Have sensible defaults for development

Environment variable names should be prefixed with `DUKADESK_` where they relate to platform-wide behavior.

---

## 5. Secrets Management

Secrets must be stored in:

- A platform-approved secret manager in production
- Local secret storage or environment files excluded from version control in development

Secrets must never appear in:

- Source code
- Configuration files committed to version control
- Logs or error messages
- CI configuration unless using secret injection

---

## 6. Configuration Validation

Repositories must validate configuration at startup or in a dedicated configuration check. Invalid or missing required configuration must fail loudly with a clear error message.

---

## 7. Documentation

Configuration documentation must include:

- Purpose of each configuration option
- Valid values and formats
- Default value
- Whether it is required in each environment
- Security classification (public, internal, secret)

---

## 8. CI Configuration

CI workflows must:

- Use minimal required permissions
- Inject secrets through platform-approved mechanisms
- Use pinned action versions where possible
- Be documented in `docs/` or `.github/workflows/README.md`

---

## 9. Prohibited Practices

- Hardcoding environment-specific values in source code
- Committing `.env` files or equivalent
- Using production secrets in development or test environments
- Silent fallback to insecure defaults
