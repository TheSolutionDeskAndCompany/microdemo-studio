# Branch Protection (Recommended)

Enable the following on `main` in GitHub → Settings → Branches → Branch protection rules:

- Require a pull request before merging
  - Require approvals: 1+
  - Dismiss stale approvals
  - Require conversation resolution
- Require status checks to pass before merging
  - Status checks: CI, E2E, Release Player (if applicable)
  - Require branches to be up to date
- Require signed commits (optional)
- Restrict who can push to matching branches (optional)

CLI (optional, needs `gh` and admin permissions):

```bash
gh api \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  \
  /repos/TheSolutionDeskAndCompany/microdemo-studio/branches/main/protection \
  -f required_status_checks.strict=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f enforce_admins=true \
  -f required_linear_history=true \
  -f allow_force_pushes=false \
  -F required_status_checks.contexts='["CI","E2E","Release Player"]'
```

