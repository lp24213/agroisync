R2 Upload and Public Endpoint Checks

1) R2 Upload flow (recommended: direct client upload)

- Server (Worker) provides a lightweight endpoint `POST /api/uploads/r2-info` (authenticated) that returns:
  {
    success: true,
    data: { uploadUrl, method: 'PUT', headers: { 'Content-Type': 'image/png' }, key }
  }

- Client: GET this endpoint passing Authorization header. Then perform a PUT to the provided uploadUrl with the binary image bytes and the provided Content-Type header.

- After successful upload, call backend `PUT /api/users/profile` to set `avatar_url` to the public URL (uploadUrl or constructed public URL).

Notes:
- Creating true signed URLs for R2 requires account-level signing and is outside the Worker sandbox without account keys. If you need signed URLs, configure an external signing service or make the bucket public with restricted keys.

2) Run public endpoints checker (local)

- Ensure the Worker is running locally (wrangler dev) on port 8787
- From repo root run (PowerShell):

  cd scripts
  node check-public-endpoints.js

This will call /api/products, /api/freight, /api/plans and report any occurrences of sensitive substrings.

3) Migrations

- Migrations were added in `backend/migrations/`:
  - 2025-10-18-add-user-avatar-cpf-payment-columns.sql
  - 2025-10-18-products-autoincrement-safe.sql

- To apply migrations on D1 remote, use your usual migration runner (wrangler d1 execute or via dashboard). Be careful: the products migration recreates the table.

4) Important

- Replace placeholders like {R2_ACCOUNT_ID} with your account-specific values or set `R2_PUBLIC_URL` binding in wrangler.toml.
- Test migrations on a copy of DB first.
