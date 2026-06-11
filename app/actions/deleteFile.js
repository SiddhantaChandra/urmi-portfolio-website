'use server';

import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const PUBLIC_UPLOADS_PREFIX = '/uploads/';

function isSafePath(filePath) {
  if (!filePath || typeof filePath !== 'string') return false;
  if (!filePath.startsWith(PUBLIC_UPLOADS_PREFIX)) return false;
  
  const filename = path.basename(filePath);
  const fullPath = path.join(UPLOAD_DIR, filename);
  const resolvedPath = path.resolve(fullPath);
  const resolvedUploadDir = path.resolve(UPLOAD_DIR);
  
  return resolvedPath.startsWith(resolvedUploadDir);
}

export async function deleteFile(filePath) {
  try {
    if (!isSafePath(filePath)) {
      return { success: false, error: 'Invalid file path.' };
    }

    const filename = path.basename(filePath);
    const fullPath = path.join(UPLOAD_DIR, filename);

    if (!existsSync(fullPath)) {
      return { success: false, error: 'File does not exist.' };
    }

    await unlink(fullPath);

    return { success: true };
  } catch (error) {
    console.error('Delete file error:', error);
    return { success: false, error: 'Failed to delete file.' };
  }
}
