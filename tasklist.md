# Portfolio CMS Implementation - Task List

## Overview
Replace all static data on the `/` page with dynamic content from a NeonDB PostgreSQL database managed by Prisma. Build a fully functional CMS dashboard with CRUD operations and file uploads.

## Decisions
- **Icons**: Phosphor Icons (store icon name string, map client-side)
- **Article Content**: JSONB chunks via `ArticleContentBlock` table (one row per block)
- **Files**: Upload to `public/uploads/`, delete old file before saving new one
- **No seeding**: Database starts empty, content entered via CMS
- **Removed**: `my-chat-lesson-script` article and all related infrastructure

---

## Phase 1: Prisma Foundation & Database Schema

### 1.1 Install Prisma
- [ ] `npm install prisma @prisma/client`
- [ ] `npm install -D @prisma/client` (if needed)
- [ ] Run `npx prisma init` to create `prisma/schema.prisma`

### 1.2 Configure Prisma
- [ ] Update `prisma/schema.prisma` generator block for `prisma-client-js`
- [ ] Set `datasource db` to `provider = "postgresql"` with `env("DATABASE_URL")`
- [ ] Ensure `DATABASE_URL` is already in `.env` (it is)

### 1.3 Write Schema Models

#### Profile Model
- `id` (UUID, PK)
- `heroBadge` (String)
- `heroTitle` (String)
- `heroSubtitle` (String)
- `heroDescription` (String)
- `articleCount` (Int)
- `profileImage` (String) - path to image
- `resumePath` (String) - path to CV PDF
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### Skill Model
- `id` (UUID, PK)
- `name` (String)
- `icon` (String) - Phosphor icon name
- `displayOrder` (Int, default 0)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### Differentiator Model
- `id` (UUID, PK)
- `title` (String)
- `description` (String)
- `displayOrder` (Int, default 0)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### Brand Model
- `id` (UUID, PK)
- `name` (String)
- `logo` (String) - path to logo image
- `alt` (String)
- `displayOrder` (Int, default 0)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### Experience Model
- `id` (UUID, PK)
- `period` (String) - e.g. "Nov 2024 - Present"
- `role` (String)
- `company` (String)
- `location` (String)
- `type` (String) - e.g. "Current Role", "Full-time"
- `description` (String)
- `icon` (String) - Phosphor icon name
- `color` (String) - gradient class
- `darkColor` (String) - dark mode gradient class
- `displayOrder` (Int, default 0)
- `achievements` (relation to ExperienceAchievement)
- `skills` (relation to ExperienceSkill)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### ExperienceAchievement Model
- `id` (UUID, PK)
- `experienceId` (UUID, FK -> Experience)
- `text` (String)
- `displayOrder` (Int, default 0)

#### ExperienceSkill Model
- `id` (UUID, PK)
- `experienceId` (UUID, FK -> Experience)
- `name` (String)
- `displayOrder` (Int, default 0)

#### ContactInfo Model
- `id` (UUID, PK)
- `label` (String) - e.g. "Email", "Location"
- `value` (String)
- `href` (String?, nullable)
- `icon` (String) - Phosphor icon name
- `type` (String) - email, location, social, action
- `displayOrder` (Int, default 0)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### Resource Model
- `id` (UUID, PK)
- `title` (String) - e.g. "Download CV"
- `description` (String)
- `filePath` (String) - path to file in public/uploads/
- `icon` (String) - Phosphor icon name
- `gradient` (String) - gradient class
- `displayOrder` (Int, default 0)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### Article Model
- `id` (UUID, PK)
- `title` (String)
- `slug` (String, unique)
- `excerpt` (String)
- `image` (String) - path to featured image
- `category` (String)
- `type` (String) - journalism, content-writing
- `articleType` (String) - "Published Article", "Content Writing", etc.
- `readingTime` (Int?, nullable)
- `author` (String, default "Urmi Chakraborty")
- `isExternal` (Boolean, default false)
- `externalLink` (String?, nullable)
- `publication` (String?, nullable)
- `status` (String, default "draft") - draft, published, archived
- `displayOrder` (Int, default 0)
- `metrics` (Json?, nullable) - array of { label, value }
- `tags` (relation via ArticleTagRelation)
- `contentBlocks` (relation to ArticleContentBlock)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### ArticleTag Model
- `id` (UUID, PK)
- `name` (String, unique)
- `articles` (relation via ArticleTagRelation)
- `createdAt` (DateTime)

#### ArticleTagRelation Model (Explicit Join Table)
- `articleId` (UUID, FK -> Article)
- `tagId` (UUID, FK -> ArticleTag)
- Composite PK on [articleId, tagId]

#### ArticleContentBlock Model
- `id` (UUID, PK)
- `articleId` (UUID, FK -> Article)
- `type` (String) - paragraph, heading, image, list, quote
- `content` (Json) - { text, level, src, alt, items, caption, listType }
- `displayOrder` (Int, default 0)

### 1.4 Migration
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Verify tables created in NeonDB
- [ ] Run `npx prisma generate` to generate client

### 1.5 Prisma Client Singleton
- [ ] Create `lib/prisma.js`
- [ ] Export singleton PrismaClient instance
- [ ] Handle hot-reload in development (attach to `global`)

---

## Phase 2: File Upload Infrastructure

### 2.1 Create Upload Directory
- [ ] Create `public/uploads/` directory
- [ ] Add to `.gitignore` (optional, but good practice)

### 2.2 Upload Server Action
- [ ] Create `app/actions/upload.js` (Server Action)
- [ ] Accept `FormData` with `file` field
- [ ] Validate file type (PDF, DOCX, WEBP, JPG, PNG)
- [ ] Validate file size (max 10MB)
- [ ] Generate unique filename with UUID
- [ ] Write file to `public/uploads/`
- [ ] Return the public path `/uploads/filename`

### 2.3 Delete File Server Action
- [ ] Create `app/actions/deleteFile.js` (Server Action)
- [ ] Accept file path
- [ ] Validate path is within `public/uploads/` (security)
- [ ] Use `fs.unlink` to delete
- [ ] Return success/error

### 2.4 Update File Server Action (Wrapper)
- [ ] Create `app/actions/updateFile.js` (Server Action)
- [ ] Accept old file path and new FormData
- [ ] Delete old file first
- [ ] Upload new file
- [ ] Return new file path
- [ ] Handle errors: if new upload fails, old file is already gone (need atomicity or recovery strategy)

---

## Phase 3: Data Layer - Server Actions for CRUD

### 3.1 Profile Actions
- [ ] `getProfile()` - fetch single profile record (returns first/only)
- [ ] `updateProfile(formData)` - update profile fields
- [ ] `updateProfileImage(formData)` - update image using upload action
- [ ] `updateResume(formData)` - update resume using upload action

### 3.2 Skill Actions
- [ ] `getSkills()` - fetch all, ordered by displayOrder
- [ ] `createSkill(formData)` - create new skill
- [ ] `updateSkill(id, formData)` - update skill
- [ ] `deleteSkill(id)` - delete skill
- [ ] `reorderSkills(orderedIds)` - update displayOrder

### 3.3 Differentiator Actions
- [ ] `getDifferentiators()` - fetch all, ordered
- [ ] `createDifferentiator(formData)` - create
- [ ] `updateDifferentiator(id, formData)` - update
- [ ] `deleteDifferentiator(id)` - delete
- [ ] `reorderDifferentiators(orderedIds)` - reorder

### 3.4 Brand Actions
- [ ] `getBrands()` - fetch all, ordered
- [ ] `createBrand(formData)` - create with logo upload
- [ ] `updateBrand(id, formData)` - update with logo replacement
- [ ] `deleteBrand(id)` - delete (also delete logo file)
- [ ] `reorderBrands(orderedIds)` - reorder

### 3.5 Experience Actions
- [ ] `getExperiences()` - fetch all with nested achievements and skills, ordered
- [ ] `createExperience(formData)` - create experience
- [ ] `updateExperience(id, formData)` - update experience
- [ ] `deleteExperience(id)` - delete with cascade
- [ ] `createAchievement(experienceId, text)` - add achievement
- [ ] `updateAchievement(id, text)` - update achievement
- [ ] `deleteAchievement(id)` - delete achievement
- [ ] `createExperienceSkill(experienceId, name)` - add skill
- [ ] `updateExperienceSkill(id, name)` - update skill
- [ ] `deleteExperienceSkill(id)` - delete skill
- [ ] `reorderExperiences(orderedIds)` - reorder

### 3.6 Contact Info Actions
- [ ] `getContactInfo()` - fetch all, ordered, grouped by type
- [ ] `createContactInfo(formData)` - create
- [ ] `updateContactInfo(id, formData)` - update
- [ ] `deleteContactInfo(id)` - delete
- [ ] `reorderContactInfo(orderedIds)` - reorder

### 3.7 Resource Actions
- [ ] `getResources()` - fetch all, ordered
- [ ] `createResource(formData)` - create with file upload
- [ ] `updateResource(id, formData)` - update with file replacement
- [ ] `deleteResource(id)` - delete (also delete file)
- [ ] `reorderResources(orderedIds)` - reorder

### 3.8 Article Actions
- [ ] `getArticles()` - fetch all articles with tags
- [ ] `getPublishedArticles()` - fetch only published, with tags
- [ ] `getArticleBySlug(slug)` - fetch single article with tags and content blocks
- [ ] `createArticle(formData)` - create article
- [ ] `updateArticle(id, formData)` - update article
- [ ] `deleteArticle(id)` - delete with cascade
- [ ] `publishArticle(id)` - set status to published
- [ ] `archiveArticle(id)` - set status to archived
- [ ] `addTagToArticle(articleId, tagName)` - create tag if not exists, add relation
- [ ] `removeTagFromArticle(articleId, tagId)` - remove relation
- [ ] `createContentBlock(articleId, blockData)` - create content block
- [ ] `updateContentBlock(id, blockData)` - update content block
- [ ] `deleteContentBlock(id)` - delete content block
- [ ] `reorderContentBlocks(articleId, orderedIds)` - reorder blocks
- [ ] `reorderArticles(orderedIds)` - reorder articles

---

## Phase 4: Frontend - Dynamic Home Page

### 4.1 Update `app/page.js`
- [ ] Convert to Server Component (remove "use client" if present)
- [ ] Fetch all data via Prisma client directly:
  - Profile
  - Skills
  - Differentiators
  - Brands
  - Experiences (with achievements and skills)
  - Contact Info
  - Resources
- [ ] Pass data as props to all section components

### 4.2 Update `sections/AceternityHero.js`
- [ ] Remove hardcoded text
- [ ] Accept `profile` prop
- [ ] Keep article count animation logic, use `profile.articleCount` as start
- [ ] Use `profile.heroBadge`, `profile.heroTitle`, `profile.heroSubtitle`, `profile.heroDescription`
- [ ] Use `profile.profileImage` for Image src
- [ ] Use `profile.resumePath` for download button
- [ ] Keep Phosphor/Hi icons for UI elements (search, sparkle, etc.)
- [ ] Map Phosphor icon names from DB to actual icon components

### 4.3 Update `sections/AboutSection.js`
- [ ] Remove hardcoded skills array
- [ ] Accept `skills` prop (array of Skill objects)
- [ ] Map `skill.icon` (string name) to Phosphor icon components dynamically
- [ ] Remove hardcoded differentiators
- [ ] Accept `differentiators` prop
- [ ] Remove hardcoded brands array
- [ ] Accept `brands` prop
- [ ] Use `brand.logo` for Image src

### 4.4 Update `sections/ExperienceSection.js`
- [ ] Remove hardcoded experiences array
- [ ] Accept `experiences` prop
- [ ] Map `experience.icon` (string) to Phosphor/Hi icon components
- [ ] Map `experience.color` and `experience.darkColor` for gradients
- [ ] Use nested `achievements` and `skills` from props
- [ ] Keep scroll animation and timeline logic

### 4.5 Update `sections/WorkSection.js`
- [ ] Remove hardcoded content projects
- [ ] Accept `articles` prop
- [ ] Filter articles by type (journalism vs content-writing)
- [ ] Keep card layout, animation, and responsive logic
- [ ] Use article data from props instead of imported JS files

### 4.6 Update `sections/ContactSection.js`
- [ ] Remove hardcoded contactInfo, socialLinks, quickActions
- [ ] Accept `contactInfo` and `resources` props
- [ ] Map `contactInfo.icon` to Phosphor icons
- [ ] Map `resources.icon` to Phosphor icons
- [ ] Use `resource.filePath` for download actions
- [ ] Group contact info by type (email, location, social, action)
- [ ] Keep email action functions (sendEmail, sendEmailWithProject, sendEmailWithCollaboration)

### 4.7 Update `components/Footer.js`
- [ ] Check if footer has static data that needs to be dynamic
- [ ] Update if necessary

---

## Phase 5: Articles Pages - Database Driven

### 5.1 Remove `my-chat-lesson-script`
- [ ] Delete `app/articles/my-chat-lesson-script/page.js`
- [ ] Delete `app/articles/my-chat-lesson-script/MyChatLessonClient.js`
- [ ] Remove from `components/ContentWritingData.js`
- [ ] Update any references to `my-chat-lesson-script`

### 5.2 Update `app/articles/page.js`
- [ ] Convert to Server Component (or keep client with server fetch)
- [ ] Fetch articles from DB using Prisma
- [ ] Filter by status = published
- [ ] Keep search/filter UI logic
- [ ] Use fetched articles instead of imported JS files
- [ ] Handle external vs internal links

### 5.3 Update `app/articles/[slug]/page.js`
- [ ] Fetch article from DB by slug using Prisma
- [ ] Fetch content blocks for the article
- [ ] Generate metadata from DB data
- [ ] Generate structured data from DB data
- [ ] Pass article + content blocks to ArticleClient

### 5.4 Update `app/articles/[slug]/ArticleClient.js`
- [ ] Accept `article` prop with nested `contentBlocks`
- [ ] Render content blocks from DB instead of static data
- [ ] Keep all existing UI/animation logic

### 5.5 Update `app/articles/[slug]/not-found.js`
- [ ] Keep existing not-found page

### 5.6 Update `components/RecommendedArticles.js`
- [ ] Fetch recommended articles from DB (excluding current)
- [ ] Use Prisma instead of static data

---

## Phase 6: CMS Dashboard - Functional Pages

### 6.1 Update `app/cms/dashboard/layout.js`
- [ ] Keep existing layout and sidebar
- [ ] Add loading states if needed

### 6.2 Update `app/cms/dashboard/page.js`
- [ ] Add actual stats cards (article count, published count, etc.)
- [ ] Fetch data from DB for the dashboard

### 6.3 Update `app/cms/dashboard/hero/page.js`
- [ ] Create form for editing Profile
- [ ] Fields: heroBadge, heroTitle, heroSubtitle, heroDescription, articleCount
- [ ] File upload for profile image
- [ ] File upload for resume
- [ ] Connect to `updateProfile` server action
- [ ] Add save/loading states

### 6.4 Update `app/cms/dashboard/about/page.js`
- [ ] Create tabs or sections for Skills, Differentiators, Brands
- [ ] **Skills CRUD**:
  - List all skills with drag-to-reorder (or up/down buttons)
  - Add new skill (name + icon dropdown)
  - Edit skill inline
  - Delete skill with confirmation
- [ ] **Differentiators CRUD**:
  - List all differentiators
  - Add new (title + description)
  - Edit inline
  - Delete with confirmation
- [ ] **Brands CRUD**:
  - List all brands
  - Add new (name + logo upload + alt)
  - Edit (replace logo upload)
  - Delete (also delete logo file)
  - Reorder

### 6.5 Update `app/cms/dashboard/experience/page.js`
- [ ] List all experiences as cards
- [ ] Add new experience (full form with nested achievements/skills)
- [ ] Edit experience inline or in modal
- [ ] Add achievement to experience
- [ ] Add skill to experience
- [ ] Delete experience, achievement, skill
- [ ] Reorder experiences
- [ ] Icon selector for Phosphor icons
- [ ] Color picker/selector for gradient classes

### 6.6 Update `app/cms/dashboard/articles/page.js`
- [ ] List all articles as table/cards
- [ ] Show status (draft/published/archived)
- [ ] Quick actions: Publish, Archive, Edit, Delete
- [ ] Add new article button -> link to article editor
- [ ] Search/filter by title, category, status

### 6.7 Create Article Editor Page
- [ ] Create `app/cms/dashboard/articles/[id]/page.js`
- [ ] Form for article metadata (title, slug, excerpt, category, type, etc.)
- [ ] Featured image upload
- [ ] Tag management (add/remove tags)
- [ ] Content block editor (add/remove/reorder blocks)
- [ ] Block type selector (paragraph, heading, image, list, quote)
- [ ] Rich text or simple textarea for block content
- [ ] Save as draft / Publish buttons
- [ ] Preview button

### 6.8 Update `app/cms/dashboard/articles/view/page.js`
- [ ] Display all articles in a read-only view
- [ ] Or repurpose to be the main articles list page

### 6.9 Update `app/cms/dashboard/socials/page.js`
- [ ] CRUD for ContactInfo where type = social or email
- [ ] Fields: label, value, href, icon, type
- [ ] Reorder

### 6.10 Update `app/cms/dashboard/resources/page.js`
- [ ] CRUD for Resource
- [ ] Fields: title, description, file upload, icon, gradient
- [ ] Reorder
- [ ] File upload/delete logic

---

## Phase 7: Cleanup & Static Data Removal

### 7.1 Remove Static Data Files
- [ ] Delete `components/JournalismData.js`
- [ ] Delete `components/ContentWritingData.js`
- [ ] Update any remaining imports

### 7.2 Update Utilities
- [ ] Check `utils/` for any static data references
- [ ] Update if needed

### 7.3 Update Sitemap
- [ ] Update `app/sitemap.js` to fetch articles from DB
- [ ] Generate dynamic sitemap entries

### 7.4 Update Components
- [ ] Check `components/ArticleFooter.js` for static references
- [ ] Check `components/StructuredData.js` for static references
- [ ] Update if needed

### 7.5 Verify No Broken Imports
- [ ] Search for imports from `JournalismData` or `ContentWritingData`
- [ ] Fix any remaining references

---

## Phase 8: Testing & Validation

### 8.1 Database Testing
- [ ] Verify all tables exist in NeonDB
- [ ] Test creating records via Prisma
- [ ] Test relations (cascade delete, etc.)

### 8.2 File Upload Testing
- [ ] Test uploading PDF files
- [ ] Test uploading image files
- [ ] Test deleting files
- [ ] Test file replacement (delete old, upload new)
- [ ] Verify security (path traversal prevention)

### 8.3 Frontend Testing
- [ ] Test `/` page loads with empty database (graceful handling)
- [ ] Test `/` page loads with data
- [ ] Test all sections render correctly
- [ ] Test `/articles` page
- [ ] Test `/articles/[slug]` page for internal articles
- [ ] Test external article links

### 8.4 CMS Testing
- [ ] Test login flow (already exists)
- [ ] Test each dashboard page
- [ ] Test CRUD operations
- [ ] Test file uploads in CMS
- [ ] Test reordering

### 8.5 Build Testing
- [ ] Run `npm run build`
- [ ] Fix any build errors
- [ ] Verify no Prisma client issues in build

---

## Phase 9: Documentation

### 9.1 Update README
- [ ] Add Prisma setup instructions
- [ ] Add database schema documentation
- [ ] Add CMS usage guide

### 9.2 Environment Variables
- [ ] Document required env vars
- [ ] Ensure `.env.example` exists if needed

---

## Notes

### Phosphor Icons Mapping
- Store icon name as string in DB (e.g., "Globe", "PencilSimple", "TrendUp")
- Import all icons dynamically or use a mapping object in client components
- Example: `import * as PhosphorIcons from '@phosphor-icons/react'` and access `PhosphorIcons[iconName]`

### File Upload Security
- Always validate file paths are within `public/uploads/`
- Never trust user-provided file paths for deletion
- Use UUID in filenames to prevent collisions
- Limit file types and sizes

### Empty State Handling
- All sections must handle empty database gracefully
- Show placeholder or default message when no data exists
- CMS will be the primary way to add data

### Performance
- Use Prisma's `select` to limit fields fetched
- Consider caching for homepage data (revalidate)
- Use `next/image` for all images

### Article Content Blocks JSON Schema
```json
{
  "paragraph": { "text": "content here" },
  "heading": { "text": "Heading", "level": 2 },
  "image": { "src": "/path", "alt": "desc", "caption": "optional" },
  "list": { "items": ["item1", "item2"], "listType": "numbered" },
  "quote": { "text": "quote content" }
}
```
