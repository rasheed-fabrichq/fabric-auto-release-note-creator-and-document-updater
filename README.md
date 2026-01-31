# Automated Release Notes & Documentation Updater

A pipeline that automatically generates release notes and updates product
documentation when pull requests are merged to main.

## How It Works

```
Developer creates PR ──> PR merged to main ──> GitHub Action triggers
                                                      │
                                    ┌─────────────────┼─────────────────┐
                                    ▼                  ▼                 ▼
                              Release Notes      Slack + Email     Claude AI compares
                              generated          notifications     docs vs PR changes
                                                                        │
                                                                        ▼
                                                                  Auto-generated
                                                                  docs update PR
                                                                        │
                                                                        ▼
                                                              PM reviews & merges
                                                                        │
                                                                        ▼
                                                              GitHub Pages updated
```

### Pipeline Steps

1. Developer creates a PR with a detailed description using the PR template
2. PR is reviewed and merged to `main`
3. The `release-notes.yml` workflow triggers automatically:
   - **Job 1 (Release Notes):** Extracts PR info, sends to Slack and email via AWS SES
   - **Job 2 (Documentation Update):** Uses `anthropics/claude-code-action` to
     compare the PR changes against current documentation, edits the docs, and
     creates a PR with proposed updates
4. Product manager reviews the auto-generated documentation PR
5. Merging the docs PR updates GitHub Pages

## Repository Structure

```
.github/
  workflows/
    release-notes.yml          Main automation workflow
    claude.yml                 Interactive @claude bot for PRs/issues
  pull_request_template.md     Structured PR description template
docs/
  index.md                     Documentation home page (GitHub Pages)
  authentication.md            JWT authentication guide
  billing.md                   Billing and pricing guide
src/
  app.js                       Sample Express.js application
CLAUDE.md                      Instructions for Claude Code Action
```

## Setup

### Prerequisites

- GitHub repository with Actions enabled
- [Claude GitHub App](https://github.com/apps/claude) installed on the repository
- Slack workspace with an incoming webhook
- AWS account with SES configured
- Anthropic API key

### Required Secrets

Configure these in repository **Settings > Secrets and variables > Actions**:

| Secret                | Description                                |
|-----------------------|--------------------------------------------|
| `ANTHROPIC_API_KEY`   | Anthropic API key for Claude               |
| `SLACK_WEBHOOK_URL`   | Slack incoming webhook URL                 |
| `AWS_ACCESS_KEY_ID`   | AWS IAM access key for SES                 |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key for SES               |
| `AWS_REGION`          | AWS region (e.g., `us-east-1`)             |
| `SES_SENDER_EMAIL`    | Verified SES sender email address          |
| `SES_RECIPIENT_EMAIL` | Recipient email for release notes          |
| `PAT_TOKEN`           | GitHub Personal Access Token (repo scope)  |

### GitHub Pages

1. Go to repository **Settings > Pages**
2. Set **Source** to "Deploy from a branch"
3. Set **Branch** to `main` and folder to `/docs`
4. Save

### Workflow Permissions

1. Go to **Settings > Actions > General**
2. Under "Workflow permissions", enable **"Allow GitHub Actions to create and approve pull requests"**

## Demo Scenarios

This repository demonstrates three documentation update scenarios in a single PR:

### 1. Updating Existing Documentation

Change a value in `src/app.js` (e.g., JWT expiry from `24h` to `48h`). The
pipeline detects the mismatch and updates `docs/authentication.md`.

### 2. Adding New Documentation

Add a new feature to `src/app.js` (e.g., Google OAuth2 endpoint or PayPal
payment method). The pipeline adds the corresponding section to the docs.

### 3. Removing Outdated Documentation

Remove a feature from `src/app.js` (e.g., the password reset endpoint). The
pipeline removes the documentation section and cleans up cross-references.

## Testing the Pipeline

1. Create a new branch from `main`
2. Make changes to `src/app.js`
3. Push the branch and open a PR using the template
4. Fill in all sections, especially **User-Facing Changes** (Added/Changed/Removed)
5. Merge the PR
6. Watch the workflow in the **Actions** tab
7. Check Slack for release notes and documentation comparison
8. Review the auto-generated documentation update PR

## Interactive Claude Bot

You can also use `@claude` in any PR comment or issue to get help from Claude:

```
@claude review this PR for potential issues
@claude help me write a detailed PR description for these changes
@claude explain how the authentication module works
```
