# Project Context

This is a demo repository for an automated release notes and documentation
update pipeline. It showcases how AI can keep product documentation in sync
with code changes.

## Repository Structure

- `src/app.js` - Express.js API with authentication and billing modules
- `docs/` - Product documentation served via GitHub Pages
  - `index.md` - Home page with platform overview and version history
  - `authentication.md` - JWT authentication guide
  - `billing.md` - Pricing tiers, payment methods, and invoicing
- `.github/workflows/release-notes.yml` - Main automation pipeline

## Documentation Conventions

- Documentation is plain Markdown (no Jekyll front matter)
- All values in docs (prices, expiry times, limits) match `src/app.js` exactly
- API endpoints in docs use the format: `POST /api/v2/path`
- Tables use GitHub-flavored Markdown pipe syntax

## Rules for Documentation Updates

When updating documentation based on a merged PR:

1. **Be precise** - Only change what the PR description and code indicate
2. **Preserve formatting** - Keep the same heading levels, table structure, and code block styles
3. **Update version history** - Add a new row to the version history table in `docs/index.md`
4. **Three types of changes:**
   - **ADD** - New sections for new features (place them logically near related content)
   - **UPDATE** - Change specific values (old value -> new value)
   - **DELETE** - Remove entire sections for removed features (clean up references too)
5. **Cross-references** - When removing a feature, also remove mentions from other docs (e.g., "Quick Links" in index.md, "Key Features" list)

## Comparison Report Format

When writing `comparison-report.md`, use this structure:

```markdown
## Documentation Comparison Report

### Items to ADD
- [description of new content needed]

### Items to UPDATE
- [file]: [what changed] (old value -> new value)

### Items to DELETE
- [file]: [section/content to remove]

### Changes by File
#### docs/filename.md
- [specific edit description]
```
