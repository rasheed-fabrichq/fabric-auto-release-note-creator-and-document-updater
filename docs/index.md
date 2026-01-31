# SecureAPI Platform Documentation

Welcome to the SecureAPI Platform documentation. This guide covers everything
you need to integrate with our API.

## Quick Links

- [Authentication Guide](authentication.md) - JWT-based authentication setup
- [Billing Guide](billing.md) - Pricing, payments, and invoices

## Platform Overview

SecureAPI provides a RESTful API for managing user authentication and billing.
All endpoints use the base URL:

    https://api.secureapi.example.com/v2

### Current Version

| Property       | Value         |
|----------------|---------------|
| API Version    | v2            |
| Last Updated   | January 2026  |
| Status         | Stable        |

### Key Features

- **JWT Authentication** - Secure token-based auth with 24-hour expiry
- **Password Reset** - Email-based password recovery
- **Flexible Billing** - Four pricing tiers from Free to Enterprise
- **Invoice Management** - Monthly invoices generated on the 1st

### Supported Environments

| Environment | Base URL                                     |
|-------------|----------------------------------------------|
| Production  | https://api.secureapi.example.com/v2         |
| Staging     | https://staging-api.secureapi.example.com/v2 |

## Version History

| Version | Date         | Changes                          |
|---------|--------------|----------------------------------|
| 2.0     | January 2026 | JWT auth, new billing tiers      |
| 1.5     | October 2025 | Added password reset             |
| 1.0     | July 2025    | Initial release with basic auth  |
