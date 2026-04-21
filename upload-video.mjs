import { Storage } from '@google-cloud/storage';
import { statSync } from 'fs';

const storage = new Storage();
const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;

console.log('Bucket:', bucketId);
if (!bucketId) { console.error('No bucket ID'); process.exit(1); }

const bucket = storage.bucket(bucketId);
const videoPath = '/home/runner/workspace/artifacts/landing/public/founder-video.mp4';
console.log(`Uploading ${(statSync(videoPath).size / 1024 / 1024).toFixed(1)}MB...`);

await bucket.upload(videoPath, {
  destination: 'public/founder-video.mp4',
  metadata: { contentType: 'video/mp4', cacheControl: 'public, max-age=86400' },
});

const file = bucket.file('public/founder-video.mp4');
await file.makePublic();

console.log(`URL: https://storage.googleapis.com/${bucketId}/public/founder-video.mp4`);
