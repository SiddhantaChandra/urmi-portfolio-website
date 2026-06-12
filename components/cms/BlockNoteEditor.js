'use client';

import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { uploadToR2 } from '@/app/actions/r2';

// Image resize + WebP conversion before upload
async function resizeAndConvertToWebP(file, maxWidth = 1200, maxHeight = 900, quality = 0.92) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to convert image to WebP'));
            return;
          }
          const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), { type: 'image/webp' });
          resolve(webpFile);
        },
        'image/webp',
        quality
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

async function uploadFile(file) {
  const optimizedFile = await resizeAndConvertToWebP(file);
  const fd = new FormData();
  fd.append('file', optimizedFile);
  fd.append('prefix', 'articles/content/');
  const res = await uploadToR2(fd);
  if (res.success) {
    return res.filePath;
  }
  throw new Error(res.error || 'Upload failed');
}

export default function BlockNoteEditor({ initialBlocks, onChange }) {
  const editor = useCreateBlockNote({
    initialContent: initialBlocks || [
      { type: 'paragraph', content: '' },
    ],
    uploadFile,
  });

  // Sync changes to parent
  const handleChange = () => {
    if (onChange && editor) {
      onChange(editor.document);
    }
  };

  if (!editor) return null;

  return (
    <div className="bn-container dark">
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme="dark"
      />
    </div>
  );
}
