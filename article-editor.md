What Library Is Used
The editor is built on BlockNote (@blocknote/core, @blocknote/react, @blocknote/mantine v0.49.0). BlockNote is a modern Notion-style block-based editor built on top of ProseMirror/TipTap. It provides a clean, customizable block-based editing experience.

Architecture
1. Editor Component (cms/components/blog/ArticleEditor.js)
This is the core editor component. Key setup:

Custom Schema: Defines which block types are available:
paragraph, heading (levels 2, 3, 4), bulletListItem, numberedListItem, quote, table
Custom blocks: image (with alt/caption support) and gallery (multi-image grid)
Image Upload: When users paste or upload images, the editor:
Resizes them to max 1200x900 using canvas
Converts them to WebP format (0.92 quality)
Uploads via presigned URLs to an object storage (R2/S3-compatible) through /api/cms/blog/articles/presigned-content-image
Slash Menu: Custom / menu with Heading 4 and Table options added to defaults
Paste Handler: Smart paste that preserves block types (e.g., pasting into a bullet list keeps bullet items, rather than creating a single paragraph)
UI Components: Uses BlockNoteView with custom FormattingToolbarController and SuggestionMenuController
2. Custom Blocks
ImageBlock.js: A custom image block with fields for url, caption, alt, name. Shows a placeholder when empty, and alt/caption input fields when an image is loaded.
GalleryBlock.js: A custom gallery block that renders a responsive CSS grid of images with captions. Images are managed via a separate "Gallery Settings" panel.
3. Data Transformation Layer (cms/lib/blog/article-content.js)
This is the bridge between BlockNote's internal format and the application's stored format. It provides three key functions:

Function	Purpose
blockNoteToBlocks(editorDocument)	Converts BlockNote's block array → the app's internal { blocks: [...] } JSON structure
blocksToBlockNote(contentJson)	Converts stored { blocks: [...] } → BlockNote format for editing
blocksToHtml(contentJson)	Renders the stored blocks to HTML for frontend display
Supported block types in storage:

heading (with level)
text (paragraphs with bold/italic/linked text)
quote (with optional attribution)
bulletList / numberedList
table (with headers, colspan/rowspan, column widths, alignment, colors)
image (with URL, caption, alt text)
gallery (array of images)
Inline content support:

Plain text, bold, italic
Links with href and optional rel attributes (for SEO: nofollow, sponsored, ugc)
4. Form Integration (cms/components/blog/ArticleForm.js)
This is the main article editing page UI:

Layout: Left side has the editor + outline panel; right sidebar has settings
Outline Panel: A sticky sidebar showing the article structure (headings) for navigation
Preview Mode: Toggles between the live editor and a rendered HTML preview
Settings Sidebar:
Publishing status (Draft / Published)
Author selection
Categories & Tags (checkboxes)
Link Relations panel: Auto-detects all links in the article and lets editors set rel attributes (nofollow, sponsored, ugc) for SEO
SEO fields (title, description)
Featured article toggle
Cover Image Upload: Separate from editor content, with its own caption field
5. Backend Integration
Content is saved as a JSON object { blocks: [...] } to the blog backend
Images uploaded in the editor go to object storage and are referenced by object key (e.g., blog/...)
The frontend uses blocksToHtml() to render articles as semantic HTML
Summary
The CMS blog editor is a customized BlockNote editor with:

A tailored block schema (no H1, custom H2-H4, image gallery support)
Built-in image optimization (resize + WebP conversion) and cloud storage upload
A custom data model that converts BlockNote blocks to a clean JSON structure
SEO-friendly features (link rel management, alt text enforcement, semantic HTML output)
A polished dark-themed UI with live preview, outline navigation, and collapsible settings sidebar