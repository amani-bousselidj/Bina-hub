# Architecture Unification Audit (User vs Dashboard duplication)

This document tracks duplications and the unification actions.

Findings:
- Duplicate dashboard: `src/domains/user/components/dashboard/*` vs `src/app/user/dashboard/*` (App route proxies to domain component). Keep App Router pages as thin wrappers.
- Duplicate project create flows: `src/app/user/projects/create` (Unified) vs domain `src/domains/user/components/projects/create/*` and `.../construction/page.tsx` (Deprecated).

Actions taken:
- Redirected domain create pages to `/user/projects/create` unified wizard.
- Replaced legacy `.../create/construction/page.tsx` with a minimal redirect page.
- Added a project-level layout (`src/app/user/projects/[projectId]/layout.tsx`) with a sidebar to surface: marketplace, expenses, warranties, photos, team, report, settings.

Next steps:
- Team/Permissions: add `project_members` table and API with roles (owner, supervisor, worker). Add UI under `/user/projects/[projectId]/team` to invite/remove members.
- Project settings page: allow editing name, description, location, coordinates, picture.
- Expenses filtering: already supports `?projectId=`; ensure pages pass it from project layout links.
- Cart project context: marketplace already sets projectId into CartContext within project marketplace. Ensure checkout includes it (already wired).
