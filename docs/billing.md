# Billing Guide

This guide covers SecureAPI pricing tiers, payment methods, and invoice
management.

## Pricing Tiers

SecureAPI offers four pricing tiers to fit your needs:

| Tier       | Monthly Price | API Requests | Storage | Support     |
|------------|---------------|--------------|---------|-------------|
| Free       | $0            | 1,000        | 1 GB    | Community   |
| Starter    | $39/month     | 10,000       | 10 GB   | Email       |
| Pro        | $129/month    | 100,000      | 100 GB  | Priority    |
| Enterprise | $499/month    | Unlimited    | 1 TB    | Dedicated   |

### Free Tier

The Free tier is perfect for development and testing. It includes:
- 1,000 API requests per month
- 1 GB storage
- Community forum support
- No credit card required

### Starter Tier

For small projects and startups:
- 10,000 API requests per month
- 10 GB storage
- Email support (response within 48 hours)
- Usage analytics dashboard

### Pro Tier

For growing businesses:
- 100,000 API requests per month
- 100 GB storage
- Priority support (response within 4 hours)
- Advanced analytics and reporting
- Custom webhooks

### Enterprise Tier

For large-scale deployments:
- Unlimited API requests
- 1 TB storage
- Dedicated account manager
- 24/7 phone support
- Custom SLA
- On-premise deployment option

## Payment Methods

SecureAPI currently accepts the following payment methods:

- **Credit Card** - Visa, Mastercard, American Express
- **Bank Transfer** - Available for annual plans only
- **PayPal** - Accepted for all billing tiers
- **Stripe** - Accepted for all billing tiers

### Retrieving Available Payment Methods

To get a list of all supported payment methods programmatically:

    GET /api/v2/billing/payment-methods

**Response:**

```json
{
  "methods": ["credit_card", "bank_transfer", "paypal", "stripe"]
}
```

## Changing Your Plan

To upgrade or downgrade your plan:

    POST /api/v2/billing/change-plan

**Request Body:**

```json
{
  "newPlan": "pro"
}
```

Plan changes take effect immediately. When upgrading, you will be charged
the prorated difference. When downgrading, credit will be applied to your
next invoice.

## Invoices

Invoices are generated on the **1st of each month** and sent to the email
address associated with your account.

### Viewing Invoices

    GET /api/v2/billing/invoices

**Response:**

```json
{
  "invoices": [
    {
      "id": "INV-2026-001",
      "date": "2026-01-01",
      "amount": 99.00,
      "status": "paid",
      "plan": "pro"
    }
  ]
}
```

### Invoice Status Values

| Status    | Description                    |
|-----------|--------------------------------|
| paid      | Payment received               |
| pending   | Awaiting payment               |
| overdue   | Payment past due (> 30 days)   |
| cancelled | Invoice cancelled              |

## Refund Policy

Refunds are available within 14 days of payment. Contact support to request
a refund. Enterprise customers should contact their dedicated account manager.
