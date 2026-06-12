'use server';

import { writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/webp',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg'];

function isAllowedFile(file) {
  const ext = path.extname(file.name).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext) && ALLOWED_TYPES.includes(file.type);
}

function generateSafeFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const uuid = uuidv4();
  return `${base}-${uuid}${ext}`;
}

export async function uploadFile(formData) {
  try {
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return { success: false, error: 'No file provided' };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'File too large. Max size is 10MB.' };
    }

    if (!isAllowedFile(file)) {
      return { success: false, error: 'File type not allowed.' };
    }

    const filename = generateSafeFilename(file.name);
    const filepath = path.join(UPLOAD_DIR, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filepath, buffer);

    return { success: true, filePath: `/uploads/${filename}` };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload file.' };
  }
}
