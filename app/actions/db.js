'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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
        icon: data.icon,
        color: data.color,
        darkColor: data.darkColor,
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
        icon: data.icon,
        color: data.color,
        darkColor: data.darkColor,
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
        icon: data.icon,
        gradient: data.gradient,
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
        icon: data.icon,
        gradient: data.gradient,
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

export async function getArticles() {
  return await prisma.article.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

export async function getPublishedArticles() {
  return await prisma.article.findMany({
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
}

export async function getArticleBySlug(slug) {
  return await prisma.article.findUnique({
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
}

export async function createArticle(data) {
  try {
    const maxOrder = await prisma.article.findFirst({
      orderBy: { displayOrder: 'desc' },
    });

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        image: data.image,
        category: data.category,
        type: data.type,
        articleType: data.articleType,
        readingTime: data.readingTime ? parseInt(data.readingTime) : null,
        author: data.author || 'Urmi Chakraborty',
        isExternal: data.isExternal || false,
        externalLink: data.externalLink,
        publication: data.publication,
        status: data.status || 'draft',
        displayOrder: maxOrder ? maxOrder.displayOrder + 1 : 0,
        metrics: data.metrics ? JSON.parse(data.metrics) : null,
        content: data.content ? (typeof data.content === 'string' ? JSON.parse(data.content) : data.content) : null,
      },
    });

    revalidatePath('/');
    revalidatePath('/articles');
    return { success: true, data: article };
  } catch (error) {
    console.error('Create article error:', error);
    return { success: false, error: 'Failed to create article.' };
  }
}

export async function updateArticle(id, data) {
  try {
    const article = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        image: data.image,
        category: data.category,
        type: data.type,
        articleType: data.articleType,
        readingTime: data.readingTime ? parseInt(data.readingTime) : null,
        author: data.author,
        isExternal: data.isExternal,
        externalLink: data.externalLink,
        publication: data.publication,
        status: data.status,
        metrics: data.metrics ? (typeof data.metrics === 'string' ? JSON.parse(data.metrics) : data.metrics) : null,
        content: data.content ? (typeof data.content === 'string' ? JSON.parse(data.content) : data.content) : null,
      },
    });

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath(`/articles/${data.slug}`);
    return { success: true, data: article };
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
    return { success: true };
  } catch (error) {
    console.error('Delete article error:', error);
    return { success: false, error: 'Failed to delete article.' };
  }
}

export async function publishArticle(id) {
  try {
    const article = await prisma.article.update({
      where: { id },
      data: { status: 'published' },
    });
    revalidatePath('/');
    revalidatePath('/articles');
    return { success: true, data: article };
  } catch (error) {
    console.error('Publish article error:', error);
    return { success: false, error: 'Failed to publish article.' };
  }
}

export async function archiveArticle(id) {
  try {
    const article = await prisma.article.update({
      where: { id },
      data: { status: 'archived' },
    });
    revalidatePath('/');
    revalidatePath('/articles');
    return { success: true, data: article };
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
