# Security and Privacy

This is a public website and a public repository. Everything committed may be indexed.

- Never commit secrets, tokens, credentials, or `.env` files.
- Do not publish confidential employer information, internal project names, or client details unless the owner explicitly confirms they are public.
- Publish contact details (email, location, phone) only when the owner explicitly asks for them to be public.
- GitHub Actions workflows use minimal `permissions` and avoid unnecessary third-party actions; pin third-party actions to a version.
- Do not load third-party scripts, trackers, or analytics without an explicit decision recorded in `docs/decisions/`.
