require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const ACCESS_KEY = process.env.R2_ACCESS_KEY;
const SECRET_KEY = process.env.R2_SECRET_KEY;
const BUCKET = process.env.R2_BUCKET;
const ENDPOINT = process.env.R2_ENDPOINT; // e.g. https://<account_id>.r2.cloudflarestorage.com

if (!ACCESS_KEY || !SECRET_KEY || !BUCKET || !ENDPOINT) {
  console.error('Missing env vars. Copy .env.example to .env and fill values.');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: ENDPOINT,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
  forcePathStyle: false
});

async function getPresignedPutUrl(key, contentType = 'application/octet-stream', expiresSeconds = 600) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType
  });
  return await getSignedUrl(s3, cmd, { expiresIn: expiresSeconds });
}

// Small CLI usage example
(async () => {
  const key = process.argv[2] || `avatars/test-${Date.now()}.png`;
  const url = await getPresignedPutUrl(key, 'image/png', 600);
  console.log('Presigned PUT URL (use with PUT):', url);
  console.log('Public URL (if bucket public):', `${ENDPOINT}/${BUCKET}/${key}`);
})();
