#!/bin/bash

# Script to create PR using GitHub API
# Usage: export GITHUB_TOKEN=your_token_here && ./create-pr.sh

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN environment variable not set"
  echo "Please run: export GITHUB_TOKEN=your_personal_access_token"
  exit 1
fi

PR_BODY=$(cat <<'EOF'
## Summary
Upgrade authentication system with Google OAuth2 support and update billing configuration. Remove legacy password reset flow in favor of OAuth-based recovery.

## Type of Change
- [x] New feature (non-breaking change that adds functionality)
- [x] Breaking change (fix or feature that would cause existing functionality to change)

## User-Facing Changes

### Added
- **Google OAuth2 authentication endpoint** (`POST /api/v2/auth/oauth/google`)
  - Allows users to authenticate using their Google account
  - Returns JWT token with 48-hour expiry
- **PayPal payment method**
  - Available for all billing tiers
  - Added to supported payment methods list

### Changed
- **JWT token expiry increased from 24 hours to 48 hours**
  - Improves user experience by reducing re-authentication frequency
  - Applied to all authentication endpoints (login, refresh, OAuth)
- **Maximum login attempts increased from 5 to 10**
  - More forgiving for users who forget their password
  - Account lockout still applies after 10 failed attempts
- **Starter tier pricing changed from $29/month to $39/month**
  - New pricing effective immediately
  - Existing customers will be notified separately

### Removed
- **Password reset via email endpoint** (`POST /api/v2/auth/reset-password`)
  - Users should use Google OAuth for account recovery instead
  - Breaking change: existing clients using this endpoint will receive 404

## Technical Changes
- Updated \`JWT_EXPIRY\` config from \`'24h'\` to \`'48h'\` in src/app.js:12
- Updated \`MAX_LOGIN_ATTEMPTS\` from \`5\` to \`10\` in src/app.js:15
- Added Google OAuth2 handler at src/app.js:78-100
- Added \`'paypal'\` to \`PAYMENT_METHODS\` array in src/app.js:134
- Updated Starter tier \`price\` from \`29\` to \`39\` in PRICING_TIERS at src/app.js:128
- Removed password reset endpoint handler (lines 78-91 deleted)

## Documentation Impact
- **authentication.md**: Update token expiry from 24h to 48h in Token Configuration table
- **authentication.md**: Update max login attempts from 5 to 10 in Token Configuration table
- **authentication.md**: Add new "Google OAuth2 Authentication" section with endpoint details
- **authentication.md**: Remove "Password Reset" section entirely
- **billing.md**: Update Starter tier price from $29 to $39 in pricing table
- **billing.md**: Add PayPal to "Payment Methods" section
- **index.md**: Remove "Password Reset" from Key Features list
- **index.md**: Add "Google OAuth2" to Key Features list
- **index.md**: Update version history with this release

## Testing Done
- [x] Manual testing
- [x] Verified Google OAuth endpoint returns valid JWT tokens
- [x] Verified PayPal is included in payment methods API response
- [x] Confirmed password reset endpoint returns 404
EOF
)

curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/rasheed-fabrichq/fabric-auto-release-note-creator-and-document-updater/pulls \
  -d "{\"title\":\"feat: Upgrade authentication system and update billing configuration\",\"body\":$(echo "$PR_BODY" | jq -Rs .),\"head\":\"feature/auth-billing-upgrade-v2\",\"base\":\"main\"}"

echo ""
echo "✅ PR created successfully!"
