'use client';

import dynamic from 'next/dynamic';

const BlockNoteEditorClient = dynamic(() => import('./BlockNoteEditorClient'), {
  ssr: false,
  loading: () => (
    <div className="cms-editor-shell">
      <div className="bn-container">
        <div className="bn-editor p-4 text-sm text-[var(--cms-muted)]">
          Loading editor...
        </div>
      </div>
    </div>
  ),
});

export default function BlockNoteEditor(props) {
  return <BlockNoteEditorClient {...props} />;
}
