# Working agreements

## Git workflow — always commit to `develop`, never directly to `main`

This repo deploys via CI on push, so branches map directly to environments:

- Push to `develop` → `.github/workflows/deploy-staging.yml` deploys to staging (port 3001)
  and `.github/workflows/sync-to-main.yml` opens/updates a PR `develop → main`.
- Push to `main` → `.github/workflows/deploy.yml` deploys to production.

**Rule: all commits go to `develop`.** `main` is only ever updated by merging the
auto-generated `develop → main` PR — never commit or push directly to `main`.

When making changes in this repo:
1. Make sure you're on `develop` (`git checkout develop && git pull --ff-only origin develop`)
   before committing.
2. Commit and push to `develop`.
3. Let the `sync-to-main` GitHub Action open/update the PR into `main`. Do not create that PR
   manually and do not push to `main` yourself — merging to `main` ships to production, so it
   should go through the PR review step, not a direct push.

If a commit accidentally lands on `main` (e.g. it was the default checked-out branch), move it
to `develop` (cherry-pick or rebase) and reset local `main` back to `origin/main` rather than
pushing `main` directly.
