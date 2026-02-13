// Helper to generate a simple R2 upload URL placeholder
// NOTE: Cloudflare Workers cannot generate real pre-signed URLs for R2 without account keys.
// This file contains helper to build an object describing an upload; the actual signing
// is done via account-level API or via a service worker exposing PUT to R2 with proper ACL.
export function getR2UploadInfo({ key, contentType, expiresIn = 3600 }) {
  // Return a structured object; developer must replace R2_ACCOUNT_ID and setup proper signed URL flow
  return {
    uploadUrl: `https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${encodeURIComponent(key)}`,
    method: 'PUT',
    headers: {
      'Content-Type': contentType
    },
    // Client should PUT the raw bytes to uploadUrl
    expiresIn
  };
}
