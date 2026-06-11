'use server';

import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET, getR2PublicUrl } from '@/lib/r2';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/webp',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/jpg',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg'];

function isAllowedFile(file) {
  if (!file || typeof file === 'string') return false;
  const ext = file.name?.slice(file.name.lastIndexOf('.')).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

function generateSafeKey(originalName, prefix = '') {
  const ext = originalName.slice(originalName.lastIndexOf('.')).toLowerCase();
  const base = originalName.slice(0, originalName.lastIndexOf('.')).replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const uuid = uuidv4();
  return `${prefix}${base}-${uuid}${ext}`;
}

export async function uploadToR2(formData) {
  try {
    const file = formData.get('file');
    const prefix = formData.get('prefix') || '';

    if (!file || typeof file === 'string') {
      return { success: false, error: 'No file provided' };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'File too large. Max size is 20MB.' };
    }

    if (!isAllowedFile(file)) {
      return { success: false, error: 'File type not allowed.' };
    }

    const key = generateSafeKey(file.name, prefix);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'application/octet-stream',
      })
    );

    const publicUrl = getR2PublicUrl(key);

    return { success: true, filePath: publicUrl, key };
  } catch (error) {
    console.error('R2 upload error:', error);
    return { success: false, error: 'Failed to upload file to R2.' };
  }
}

export async function deleteFromR2(keyOrUrl) {
  try {
    if (!keyOrUrl || typeof keyOrUrl !== 'string') {
      return { success: false, error: 'Invalid key or URL.' };
    }

    // Extract key from public URL if needed
    let key = keyOrUrl;
    const publicUrlPrefix = getR2PublicUrl('');
    if (keyOrUrl.startsWith(publicUrlPrefix)) {
      key = keyOrUrl.slice(publicUrlPrefix.length);
    }

    if (!key || key.includes('..')) {
      return { success: false, error: 'Invalid key.' };
    }

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      })
    );

    return { success: true };
  } catch (error) {
    console.error('R2 delete error:', error);
    return { success: false, error: 'Failed to delete file from R2.' };
  }
}
