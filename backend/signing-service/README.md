Agroisync Signing Service (R2 presign)

Purpose
This tiny service generates presigned PUT URLs for Cloudflare R2 (S3-compatible) so clients can upload directly to R2 without sending file bytes through the Worker.

Setup
1. Copy .env.example -> .env and fill values with your R2 ACCESS KEY, SECRET KEY, BUCKET and ENDPOINT.
2. npm install
3. npm start

Example
$ node presign.js avatars/user-123.png
Returns a presigned PUT URL (valid for 600s) and an example public URL.

Notes
- Keep ACCESS_KEY and SECRET_KEY secret.
- In production you should wrap this CLI into a small authenticated HTTP service (Express or another Worker) and protect the endpoint with JWT.
- Alternatively, you can store the credentials as `wrangler secret put` and implement signing inside a Worker (requires AWSv4 signing logic or using a library compiled for Workers).