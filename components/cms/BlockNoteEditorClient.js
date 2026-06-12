'use client';

import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { uploadToR2 } from '@/app/actions/r2';
import { blocksToBlockNote } from '@/lib/article-content';

async function resizeAndConvertToWebP(file, maxWidth = 1600, maxHeight = 1200, quality = 0.9) {
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

          resolve(
            new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp',
            })
          );
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
  const formData = new FormData();
  formData.append('file', optimizedFile);
  formData.append('prefix', 'articles/content/');

  const result = await uploadToR2(formData);
  if (!result.success) {
    throw new Error(result.error || 'Upload failed');
  }

  return result.filePath;
}

export default function BlockNoteEditorClient({ initialContent, onChange }) {
  const editor = useCreateBlockNote({
    initialContent: blocksToBlockNote(initialContent),
    uploadFile,
  });

  if (!editor) return null;

  return (
    <div className="cms-editor-shell">
      <BlockNoteView
        editor={editor}
        onChange={() => onChange?.(editor.document)}
        theme="light"
        slashMenu
        sideMenu
        formattingToolbar
        linkToolbar
        tableHandles
        filePanel
      />
    </div>
  );
}
