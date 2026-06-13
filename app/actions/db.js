'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { hasLegacyContentFormat, normalizeStoredContent } from '@/lib/article-content';

// ==================== PROFILE ====================

export async function getProfile() {
  return await prisma.profile.findFirst();
}

export async function updateProfile(data) {
  try {
    const existing = await prisma.profile.findFirst();
    if (existing) {
      const updated = await prisma.profile.update({
        where: { id: existing.id },
        data: {
          heroBadge: data.heroBadge,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroDescription: data.heroDescription,
          articleCount: data.articleCount ? parseInt(data.articleCount) : existing.articleCount,
          profileImage: data.profileImage,
          resumePath: data.resumePath,
        },
      });
      revalidatePath('/');
      return { success: true, data: updated };
    } else {
      const created = await prisma.profile.create({
        data: {
          heroBadge: data.heroBadge || 'Dedicated Entertainment Journalist',
          heroTitle: data.heroTitle || "Hi, I'm Urmi Chakraborty",
          heroSubtitle: data.heroSubtitle || 'I am an entertainment and lifestyle journalist',
          heroDescription: data.heroDescription || '',
          articleCount: data.articleCount ? parseInt(data.articleCount) : 0,
          profileImage: data.profileImage || '/Urmi.webp',
          resumePath: data.resumePath || '/Urmi_Chakraborty_CV.pdf',
        },
      });
      revalidatePath('/');
      return { success: true, data: created };
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
}

// ==================== SKILLS ====================

export async function getSkills() {
  return await prisma.skill.findMany({
    orderBy: { displayOrder: 'asc' },
  });
}

export async function createSkill(data) {
  try {
    const maxOrder = await prisma.skill.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        icon: data.icon,
        displayOrder: maxOrder ? maxOrder.displayOrder + 1 : 0,
      },
    });
    revalidatePath('/');
    return { success: true, data: skill };
  } catch (error) {
    console.error('Create skill error:', error);
    return { success: false, error: 'Failed to create skill.' };
  }
}

export async function updateSkill(id, data) {
  try {
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name: data.name,
        icon: data.icon,
      },
    });
    revalidatePath('/');
    return { success: true, data: skill };
  } catch (error) {
    console.error('Update skill error:', error);
    return { success: false, error: 'Failed to update skill.' };
  }
}

export async function deleteSkill(id) {
  try {
    await prisma.skill.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete skill error:', error);
    return { success: false, error: 'Failed to delete skill.' };
  }
}

export async function reorderSkills(orderedIds) {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.skill.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Reorder skills error:', error);
    return { success: false, error: 'Failed to reorder skills.' };
  }
}

// ==================== DIFFERENTIATORS ====================

export async function getDifferentiators() {
  return await prisma.differentiator.findMany({
    orderBy: { displayOrder: 'asc' },
  });
}

export async function createDifferentiator(data) {
  try {
    const maxOrder = await prisma.differentiator.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    const diff = await prisma.differentiator.create({
      data: {
        title: data.title,
        description: data.description,
        displayOrder: maxOrder ? maxOrder.displayOrder + 1 : 0,
      },
    });
    revalidatePath('/');
    return { success: true, data: diff };
  } catch (error) {
    console.error('Create differentiator error:', error);
    return { success: false, error: 'Failed to create differentiator.' };
  }
}

export async function updateDifferentiator(id, data) {
  try {
    const diff = await prisma.differentiator.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
      },
    });
    revalidatePath('/');
    return { success: true, data: diff };
  } catch (error) {
    console.error('Update differentiator error:', error);
    return { success: false, error: 'Failed to update differentiator.' };
  }
}

export async function deleteDifferentiator(id) {
  try {
    await prisma.differentiator.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete differentiator error:', error);
    return { success: false, error: 'Failed to delete differentiator.' };
  }
}

export async function reorderDifferentiators(orderedIds) {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.differentiator.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Reorder differentiators error:', error);
    return { success: false, error: 'Failed to reorder differentiators.' };
  }
}

// ==================== BRANDS ====================

export async function getBrands() {
  return await prisma.brand.findMany({
    orderBy: { displayOrder: 'asc' },
  });
}

export async function createBrand(data) {
  try {
    const maxOrder = await prisma.brand.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        logo: data.logo,
        alt: data.alt || data.name,
        displayOrder: maxOrder ? maxOrder.displayOrder + 1 : 0,
      },
    });
    revalidatePath('/');
    return { success: true, data: brand };
  } catch (error) {
    console.error('Create brand error:', error);
    return { success: false, error: 'Failed to create brand.' };
  }
}

export async function updateBrand(id, data) {
  try {
    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: data.name,
        logo: data.logo,
        alt: data.alt,
      },
    });
    revalidatePath('/');
    return { success: true, data: brand };
  } catch (error) {
    console.error('Update brand error:', error);
    return { success: false, error: 'Failed to update brand.' };
  }
}

export async function deleteBrand(id) {
  try {
    await prisma.brand.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete brand error:', error);
    return { success: false, error: 'Failed to delete brand.' };
  }
}

export async function reorderBrands(orderedIds) {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.brand.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Reorder brands error:', error);
    return { success: false, error: 'Failed to reorder brands.' };
  }
}

// ==================== EXPERIENCES ====================

export async function getExperiences() {
  return await prisma.experience.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      achievements: { orderBy: { displayOrder: 'asc' } },
      skills: { orderBy: { displayOrder: 'asc' } },
    },
  });
}

export async function createExperience(data) {
  try {
    const maxOrder = await prisma.experience.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    const experience = await prisma.experience.create({
      data: {
        period: data.period,
        role: data.role,
        company: data.company,
        location: data.location,
        type: data.type,
        description: data.description,
        icon: data.icon || '',
        color: data.color || '',
        darkColor: data.darkColor || '',
        logo: data.logo || null,
        displayOrder: maxOrder ? maxOrder.displayOrder + 1 : 0,
      },
    });
    revalidatePath('/');
    return { success: true, data: experience };
  } catch (error) {
    console.error('Create experience error:', error);
    return { success: false, error: 'Failed to create experience.' };
  }
}

export async function updateExperience(id, data) {
  try {
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        period: data.period,
        role: data.role,
        company: data.company,
        location: data.location,
        type: data.type,
        description: data.description,
        icon: data.icon || '',
        color: data.color || '',
        darkColor: data.darkColor || '',
        logo: data.logo || null,
      },
    });
    revalidatePath('/');
    return { success: true, data: experience };
  } catch (error) {
    console.error('Update experience error:', error);
    return { success: false, error: 'Failed to update experience.' };
  }
}

export async function deleteExperience(id) {
  try {
    await prisma.experience.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete experience error:', error);
    return { success: false, error: 'Failed to delete experience.' };
  }
}

export async function createAchievement(experienceId, text) {
  try {
    const maxOrder = await prisma.experienceAchievement.findFirst({
      where: { experienceId },
      orderBy: { displayOrder: 'desc' },
    });
    const achievement = await prisma.experienceAchievement.create({
      data: {
        experienceId,
        text,
        displayOrder: maxOrder ? maxOrder.displayOrder + 1 : 0,
      },
    });
    revalidatePath('/');
    return { success: true, data: achievement };
  } catch (error) {
    console.error('Create achievement error:', error);
    return { success: false, error: 'Failed to create achievement.' };
  }
}

export async function updateAchievement(id, text) {
  try {
    const achievement = await prisma.experienceAchievement.update({
      where: { id },
      data: { text },
    });
    revalidatePath('/');
    return { success: true, data: achievement };
  } catch (error) {
    console.error('Update achievement error:', error);
    return { success: false, error: 'Failed to update achievement.' };
  }
}

export async function deleteAchievement(id) {
  try {
    await prisma.experienceAchievement.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete achievement error:', error);
    return { success: false, error: 'Failed to delete achievement.' };
  }
}

export async function createExperienceSkill(experienceId, name) {
  try {
    const maxOrder = await prisma.experienceSkill.findFirst({
      where: { experienceId },
      orderBy: { displayOrder: 'desc' },
    });
    const skill = await prisma.experienceSkill.create({
      data: {
        experienceId,
        name,
        displayOrder: maxOrder ? maxOrder.displayOrder + 1 : 0,
      },
    });
    revalidatePath('/');
    return { success: true, data: skill };
  } catch (error) {
    console.error('Create experience skill error:', error);
    return { success: false, error: 'Failed to create experience skill.' };
  }
}

export async function updateExperienceSkill(id, name) {
  try {
    const skill = await prisma.experienceSkill.update({
      where: { id },
      data: { name },
    });
    revalidatePath('/');
    return { success: true, data: skill };
  } catch (error) {
    console.error('Update experience skill error:', error);
    return { success: false, error: 'Failed to update experience skill.' };
  }
}

export async function deleteExperienceSkill(id) {
  try {
    await prisma.experienceSkill.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete experience skill error:', error);
    return { success: false, error: 'Failed to delete experience skill.' };
  }
}

export async function reorderExperiences(orderedIds) {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.experience.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Reorder experiences error:', error);
    return { success: false, error: 'Failed to reorder experiences.' };
  }
}

// ==================== CONTACT INFO ====================

export async function getContactInfo() {
  return await prisma.contactInfo.findMany({
    orderBy: { displayOrder: 'asc' },
  });
}

export async function createContactInfo(data) {
  try {
    const maxOrder = await prisma.contactInfo.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    const info = await prisma.contactInfo.create({
      data: {
        label: data.label,
        value: data.value,
        href: data.href,
        icon: data.icon,
        type: data.type,
        displayOrder: maxOrder ? maxOrder.displayOrder + 1 : 0,
      },
    });
    revalidatePath('/');
    return { success: true, data: info };
  } catch (error) {
    console.error('Create contact info error:', error);
    return { success: false, error: 'Failed to create contact info.' };
  }
}

export async function updateContactInfo(id, data) {
  try {
    const info = await prisma.contactInfo.update({
      where: { id },
      data: {
        label: data.label,
        value: data.value,
        href: data.href,
        icon: data.icon,
        type: data.type,
      },
    });
    revalidatePath('/');
    return { success: true, data: info };
  } catch (error) {
    console.error('Update contact info error:', error);
    return { success: false, error: 'Failed to update contact info.' };
  }
}

export async function deleteContactInfo(id) {
  try {
    await prisma.contactInfo.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete contact info error:', error);
    return { success: false, error: 'Failed to delete contact info.' };
  }
}

export async function reorderContactInfo(orderedIds) {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.contactInfo.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Reorder contact info error:', error);
    return { success: false, error: 'Failed to reorder contact info.' };
  }
}

// ==================== RESOURCES ====================

export async function getResources() {
  return await prisma.resource.findMany({
    orderBy: { displayOrder: 'asc' },
  });
}

export async function createResource(data) {
  try {
    const maxOrder = await prisma.resource.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        description: data.description,
        filePath: data.filePath,
        displayOrder: maxOrder ? maxOrder.displayOrder + 1 : 0,
      },
    });
    revalidatePath('/');
    return { success: true, data: resource };
  } catch (error) {
    console.error('Create resource error:', error);
    return { success: false, error: 'Failed to create resource.' };
  }
}

export async function updateResource(id, data) {
  try {
    const resource = await prisma.resource.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        filePath: data.filePath,
      },
    });
    revalidatePath('/');
    return { success: true, data: resource };
  } catch (error) {
    console.error('Update resource error:', error);
    return { success: false, error: 'Failed to update resource.' };
  }
}

export async function deleteResource(id) {
  try {
    await prisma.resource.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete resource error:', error);
    return { success: false, error: 'Failed to delete resource.' };
  }
}

export async function reorderResources(orderedIds) {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.resource.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Reorder resources error:', error);
    return { success: false, error: 'Failed to reorder resources.' };
  }
}

// ==================== ARTICLES ====================

function parseJsonValue(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    return JSON.parse(value);
  }
  return value;
}

function normalizeTagsInput(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))];
  }

  return [...new Set(
    String(tags)
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  )];
}

function slugifyValue(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeArticlePayload(data, { preserveStatus = false } = {}) {
  const isExternal = data.isExternal === true || data.isExternal === 'true';
  const parsedContent = parseJsonValue(data.content);
  const normalizedTitle = String(data.title || '').trim();
  const explicitSlug = String(data.slug || '').trim();
  const fallbackSlug = slugifyValue(normalizedTitle) || `article-${Date.now()}`;
  const slug = explicitSlug || (isExternal ? `${fallbackSlug}-${Date.now()}` : fallbackSlug);

  return {
    title: normalizedTitle,
    slug,
    excerpt: String(data.excerpt || '').trim(),
    image: String(data.image || '').trim(),
    category: String(data.category || '').trim(),
    type: String(data.type || 'journalism').trim(),
    articleType: String(data.articleType || (isExternal ? 'External Link' : 'Internal Article')).trim(),
    readingTime: data.readingTime ? parseInt(data.readingTime, 10) : null,
    author: String(data.author || 'Urmi Chakraborty').trim(),
    isExternal,
    externalLink: isExternal ? String(data.externalLink || '').trim() : null,
    publication: String(data.publication || '').trim() || null,
    status: preserveStatus ? undefined : (String(data.status || 'draft').trim() || 'draft'),
    metrics: parseJsonValue(data.metrics),
    content: isExternal ? null : (parsedContent ? normalizeStoredContent(parsedContent) : { blocks: [] }),
    tags: normalizeTagsInput(data.tags),
  };
}

async function syncArticleTags(articleId, tagNames) {
  await prisma.articleTagRelation.deleteMany({
    where: { articleId },
  });

  if (!tagNames.length) return;

  const existingTags = await prisma.articleTag.findMany({
    where: { name: { in: tagNames } },
  });

  const existingByName = new Map(existingTags.map((tag) => [tag.name, tag]));
  const missingNames = tagNames.filter((name) => !existingByName.has(name));

  if (missingNames.length) {
    await prisma.articleTag.createMany({
      data: missingNames.map((name) => ({ name })),
      skipDuplicates: true,
    });
  }

  const allTags = await prisma.articleTag.findMany({
    where: { name: { in: tagNames } },
  });

  await prisma.articleTagRelation.createMany({
    data: allTags.map((tag) => ({
      articleId,
      tagId: tag.id,
    })),
    skipDuplicates: true,
  });
}

async function getArticleWithRelations(id) {
  return prisma.article.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

function withComputedTags(article) {
  if (!article) return article;
  return {
    ...article,
    tagsText: article.tags?.map((relation) => relation.tag.name).join(', ') || '',
  };
}

export async function normalizeLegacyArticleContent() {
  try {
    const articles = await prisma.article.findMany({
      where: { isExternal: false, content: { not: null } },
      select: { id: true, content: true },
    });

    const legacyArticles = articles.filter((article) => hasLegacyContentFormat(article.content));

    await Promise.all(
      legacyArticles.map((article) =>
        prisma.article.update({
          where: { id: article.id },
          data: { content: normalizeStoredContent(article.content) },
        })
      )
    );

    if (legacyArticles.length) {
      revalidatePath('/articles');
    }

    return { success: true, count: legacyArticles.length };
  } catch (error) {
    console.error('Normalize legacy article content error:', error);
    return { success: false, error: 'Failed to normalize legacy article content.' };
  }
}

export async function getArticles() {
  const articles = await prisma.article.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return articles.map(withComputedTags);
}

export async function getPublishedArticles() {
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { displayOrder: 'asc' },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return articles.map(withComputedTags);
}

export async function getArticleBySlug(slug) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
      contentBlocks: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  return withComputedTags(article);
}

export async function createArticle(data) {
  try {
    const normalized = normalizeArticlePayload(data);

    if (normalized.isExternal && !normalized.externalLink) {
      return { success: false, error: 'External links require a URL.' };
    }

    const maxOrder = await prisma.article.findFirst({
      orderBy: { displayOrder: 'desc' },
    });

    const article = await prisma.article.create({
      data: {
        title: normalized.title,
        slug: normalized.slug,
        excerpt: normalized.excerpt,
        image: normalized.image,
        category: normalized.category,
        type: normalized.type,
        articleType: normalized.articleType,
        readingTime: normalized.readingTime,
        author: normalized.author,
        isExternal: normalized.isExternal,
        externalLink: normalized.externalLink,
        publication: normalized.publication,
        status: normalized.status || 'draft',
        displayOrder: maxOrder ? maxOrder.displayOrder + 1 : 0,
        metrics: normalized.metrics,
        content: normalized.content,
      },
    });

    await syncArticleTags(article.id, normalized.tags);
    const hydrated = await getArticleWithRelations(article.id);

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/cms/dashboard/articles');
    return { success: true, data: withComputedTags(hydrated) };
  } catch (error) {
    console.error('Create article error:', error);
    return { success: false, error: 'Failed to create article.' };
  }
}

export async function updateArticle(id, data) {
  try {
    const normalized = normalizeArticlePayload(data);

    if (normalized.isExternal && !normalized.externalLink) {
      return { success: false, error: 'External links require a URL.' };
    }

    const existing = await prisma.article.findUnique({
      where: { id },
      select: { slug: true },
    });

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: normalized.title,
        slug: normalized.slug,
        excerpt: normalized.excerpt,
        image: normalized.image,
        category: normalized.category,
        type: normalized.type,
        articleType: normalized.articleType,
        readingTime: normalized.readingTime,
        author: normalized.author,
        isExternal: normalized.isExternal,
        externalLink: normalized.externalLink,
        publication: normalized.publication,
        status: normalized.status || 'draft',
        metrics: normalized.metrics,
        content: normalized.content,
      },
    });

    await syncArticleTags(article.id, normalized.tags);
    const hydrated = await getArticleWithRelations(article.id);

    revalidatePath('/');
    revalidatePath('/articles');
    if (existing?.slug) revalidatePath(`/articles/${existing.slug}`);
    if (normalized.slug) revalidatePath(`/articles/${normalized.slug}`);
    revalidatePath('/cms/dashboard/articles');
    return { success: true, data: withComputedTags(hydrated) };
  } catch (error) {
    console.error('Update article error:', error);
    return { success: false, error: 'Failed to update article.' };
  }
}

export async function deleteArticle(id) {
  try {
    await prisma.article.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/cms/dashboard/articles');
    return { success: true };
  } catch (error) {
    console.error('Delete article error:', error);
    return { success: false, error: 'Failed to delete article.' };
  }
}

export async function publishArticle(id) {
  try {
    await prisma.article.update({
      where: { id },
      data: { status: 'published' },
    });
    const article = await getArticleWithRelations(id);
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/cms/dashboard/articles');
    return { success: true, data: withComputedTags(article) };
  } catch (error) {
    console.error('Publish article error:', error);
    return { success: false, error: 'Failed to publish article.' };
  }
}

export async function archiveArticle(id) {
  try {
    await prisma.article.update({
      where: { id },
      data: { status: 'archived' },
    });
    const article = await getArticleWithRelations(id);
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/cms/dashboard/articles');
    return { success: true, data: withComputedTags(article) };
  } catch (error) {
    console.error('Archive article error:', error);
    return { success: false, error: 'Failed to archive article.' };
  }
}

export async function addTagToArticle(articleId, tagName) {
  try {
    let tag = await prisma.articleTag.findUnique({
      where: { name: tagName },
    });

    if (!tag) {
      tag = await prisma.articleTag.create({
        data: { name: tagName },
      });
    }

    const relation = await prisma.articleTagRelation.create({
      data: {
        articleId,
        tagId: tag.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/articles');
    return { success: true, data: relation };
  } catch (error) {
    console.error('Add tag error:', error);
    return { success: false, error: 'Failed to add tag.' };
  }
}

export async function removeTagFromArticle(articleId, tagId) {
  try {
    await prisma.articleTagRelation.delete({
      where: {
        articleId_tagId: {
          articleId,
          tagId,
        },
      },
    });

    revalidatePath('/');
    revalidatePath('/articles');
    return { success: true };
  } catch (error) {
    console.error('Remove tag error:', error);
    return { success: false, error: 'Failed to remove tag.' };
  }
}

export async function createContentBlock(articleId, blockData) {
  try {
    const maxOrder = await prisma.articleContentBlock.findFirst({
      where: { articleId },
      orderBy: { displayOrder: 'desc' },
    });

    const block = await prisma.articleContentBlock.create({
      data: {
        articleId,
        type: blockData.type,
        content: blockData.content,
        displayOrder: maxOrder ? maxOrder.displayOrder + 1 : 0,
      },
    });

    revalidatePath(`/articles/${articleId}`);
    return { success: true, data: block };
  } catch (error) {
    console.error('Create content block error:', error);
    return { success: false, error: 'Failed to create content block.' };
  }
}

export async function updateContentBlock(id, blockData) {
  try {
    const block = await prisma.articleContentBlock.update({
      where: { id },
      data: {
        type: blockData.type,
        content: blockData.content,
      },
    });

    revalidatePath(`/articles`);
    return { success: true, data: block };
  } catch (error) {
    console.error('Update content block error:', error);
    return { success: false, error: 'Failed to update content block.' };
  }
}

export async function deleteContentBlock(id) {
  try {
    await prisma.articleContentBlock.delete({ where: { id } });
    revalidatePath('/articles');
    return { success: true };
  } catch (error) {
    console.error('Delete content block error:', error);
    return { success: false, error: 'Failed to delete content block.' };
  }
}

export async function reorderContentBlocks(articleId, orderedIds) {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.articleContentBlock.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );
    revalidatePath('/articles');
    return { success: true };
  } catch (error) {
    console.error('Reorder content blocks error:', error);
    return { success: false, error: 'Failed to reorder content blocks.' };
  }
}

export async function reorderArticles(orderedIds) {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.article.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );
    revalidatePath('/');
    revalidatePath('/articles');
    return { success: true };
  } catch (error) {
    console.error('Reorder articles error:', error);
    return { success: false, error: 'Failed to reorder articles.' };
  }
}
