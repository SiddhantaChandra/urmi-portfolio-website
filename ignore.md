Plan: Neon CMS Content Model
Use a hybrid relational model in Neon, not one giant sections JSON table. In this codebase, the homepage is a fixed composition of sections in c:/Users/siddh/OneDrive/Desktop/New%20folder/urmi-portfolio-website/app/page.js, while the CMS is already grouped by section in c:/Users/siddh/OneDrive/Desktop/New%20folder/urmi-portfolio-website/app/cms/dashboard/layout.js. That makes section-specific tables plus normalized child tables the cleanest fit.

Recommended strategy

Keep one singleton table per homepage section header/config:
hero_sections, about_sections, experience_sections, work_sections, contact_sections.

Keep repeatable content in child tables with sort_order:
about_skills, about_highlights, brand_logos, experience_items, contact_points, social_links, resources.

Use one unified articles table for both journalism and content-writing entries.
The current Work section merges both sources already in c:/Users/siddh/OneDrive/Desktop/New%20folder/urmi-portfolio-website/sections/WorkSection.js, so splitting them into separate DB tables would add complexity without benefit.

Use relational tables for tags and metrics:
article_tags, article_metrics.

Use jsonb only where structure is naturally block-based:
article body blocks for internal long-form content-writing pieces.

Add a small registry table for editorial state across CMS areas:
site_sections.

Suggested tables and schemas

site_sections

id uuid pk
section_key text unique
section_name text
is_published boolean
last_updated_by text or uuid
published_at timestamptz null
created_at timestamptz
updated_at timestamptz
Purpose: track publish state and metadata for hero, about, experience, articles, socials, resources, contact.

hero_sections

id uuid pk
site_section_id uuid unique fk
badge_text text
headline_prefix text
headline_highlight text
subtitle text
description text
article_counter_start integer
article_counter_end integer
resume_cta_label text
resume_cta_url text
portfolio_cta_label text
portfolio_cta_target text
profile_image_url text
created_at timestamptz
updated_at timestamptz
This matches the hardcoded fields in c:/Users/siddh/OneDrive/Desktop/New%20folder/urmi-portfolio-website/sections/AceternityHero.js.

about_sections

id uuid pk
site_section_id uuid unique fk
badge_text text
heading_prefix text
heading_highlight text
skills_title text
highlights_title text
brands_title text
created_at timestamptz
updated_at timestamptz
about_skills

id uuid pk
about_section_id uuid fk
name text
icon_key text
sort_order integer
is_active boolean
created_at timestamptz
updated_at timestamptz
about_highlights

id uuid pk
about_section_id uuid fk
title text
description text
sort_order integer
is_active boolean
created_at timestamptz
updated_at timestamptz
brand_logos

id uuid pk
about_section_id uuid fk
name text
logo_url text
alt_text text
sort_order integer
is_active boolean
created_at timestamptz
updated_at timestamptz
These map to c:/Users/siddh/OneDrive/Desktop/New%20folder/urmi-portfolio-website/sections/AboutSection.js.

experience_sections

id uuid pk
site_section_id uuid unique fk
badge_text text
heading_prefix text
heading_highlight text
description text
created_at timestamptz
updated_at timestamptz
experience_items

id uuid pk
experience_section_id uuid fk
period_label text
role text
company text
location text
employment_type text
icon_key text
description text
color_from text
color_to text
dark_color_from text
dark_color_to text
sort_order integer
is_active boolean
created_at timestamptz
updated_at timestamptz
If you want achievements and skills editable independently:

experience_achievements with experience_item_id, content, sort_order
experience_skills with experience_item_id, name, sort_order
That matches c:/Users/siddh/OneDrive/Desktop/New%20folder/urmi-portfolio-website/sections/ExperienceSection.js.

work_sections

id uuid pk
site_section_id uuid unique fk
badge_text text
heading_prefix text
heading_highlight text
description text
desktop_limit integer default 9
mobile_limit integer default 6
reserved_content_count integer default 3
created_at timestamptz
updated_at timestamptz
articles

id uuid pk
article_kind text
status text
title text
slug text unique null
excerpt text
sub_heading text null
featured_image_url text
category text
publication_name text null
display_type text null
author_name text null
reading_time_minutes integer null
external_url text null
body_blocks jsonb null
sort_order integer null
is_featured boolean default false
published_at timestamptz null
created_at timestamptz
updated_at timestamptz
Recommended values:

article_kind: journalism or content_writing
status: draft or published
Rule:

Journalism entries usually have external_url and no body_blocks
Internal content-writing entries usually have slug and body_blocks
article_tags

id uuid pk
article_id uuid fk
tag text
sort_order integer
article_metrics

id uuid pk
article_id uuid fk
label text
value text
sort_order integer
This covers both current data shapes in c:/Users/siddh/OneDrive/Desktop/New%20folder/urmi-portfolio-website/components/JournalismData.js and c:/Users/siddh/OneDrive/Desktop/New%20folder/urmi-portfolio-website/components/ContentWritingData.js.

contact_sections

id uuid pk
site_section_id uuid unique fk
badge_text text
heading_prefix text
heading_highlight_primary text
heading_highlight_secondary text
intro_text text
sub_intro_text text
primary_email_cta_title text
primary_email_cta_subtitle text
response_time_label text
created_at timestamptz
updated_at timestamptz
contact_points

id uuid pk
contact_section_id uuid fk
label text
value text
href text null
icon_key text
sort_order integer
is_active boolean
social_links

id uuid pk
contact_section_id uuid fk
name text
url text
description text
icon_key text
sort_order integer
is_active boolean
resources

id uuid pk
contact_section_id uuid fk
title text
description text
button_label text
file_url text
file_type text
sort_order integer
is_active boolean
These match c:/Users/siddh/OneDrive/Desktop/New%20folder/urmi-portfolio-website/sections/ContactSection.js.

How this maps to the CMS sidebar

Hero editor:
hero_sections

About editor:
about_sections, about_skills, about_highlights, brand_logos

Experience editor:
experience_sections, experience_items, optionally achievements and skills child tables

Articles editor:
work_sections, articles, article_tags, article_metrics

Social links editor:
social_links

Resources editor:
resources

Gap in current sidebar:
Contact content exists on the homepage but does not have its own menu item. I would either add a dedicated Contact editor or intentionally fold contact_sections and contact_points into the Socials/Resources area.

Prisma with Neon

Yes, Prisma is a reasonable choice here.

Use Prisma if you want:

type-safe queries in Next.js server code
managed migrations
clean relations for CMS forms
one source of truth for the schema
For Neon specifically, the usual setup is:

DATABASE_URL for the pooled runtime connection
DIRECT_URL for Prisma Migrate and introspection
That matters because Prisma migrations want a direct connection, while serverless runtime traffic should generally go through Neon pooling.

My recommendation for this project is Prisma over raw SQL because your data model is relational and admin-heavy, not analytics-heavy. The main rule is to keep Prisma server-only in route handlers/server components, not in client components.

Verification

Check every field currently hardcoded in the section files has a home in one of the tables above.
Keep jsonb limited to article body blocks, not full sections.
Make sort_order explicit on every repeatable table so CMS drag-and-drop or manual ordering stays predictable.
Add the missing Contact CMS surface before implementation so the schema and sidebar stay aligned.