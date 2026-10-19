import { useMemo, useCallback } from 'react';
import { useBlogPosts } from '@/domains/blog/application/use-cases/useBlogPosts';
import { usePortfolioItems } from '@/domains/portfolio/application/use-cases/usePortfolioItems';
import { useConsultations } from '@/domains/consultations/application/use-cases/useConsultations';
import { useProducts } from '@/domains/products/application/use-cases/useProducts';
import { useSolutions } from '@/domains/solutions/application/use-cases/useSolutions';
import { useServices } from '@/domains/services/application/use-cases/useServices';
import { formatDate } from '@/shared/utils/format';
import { ConsultationType } from '@/domains/consultations/domain/enums/consultation-type.enum';

export type HeroUpdateType =
  | 'blog'
  | 'portfolio'
  | 'training'
  | 'consultation'
  | 'product'
  | 'solution'
  | 'service';

export interface HeroUpdateItem {
  id: string;
  type: HeroUpdateType;
  typeLabel: string;
  title: string;
  description: string;
  href: string;
  date?: string;
  dateFormatted?: string;
  isUpdated?: boolean;
  tag?: string;
  iconName: string;
  badgeVariant: 'brand' | 'neutral' | 'success' | 'warning' | 'info' | 'danger';
  image?: string;
  colorClasses: {
    badgeBg: string;
    badgeText: string;
    border: string;
    glow: string;
    iconBg: string;
    iconText: string;
    actionText: string;
  };
}

export interface UseHeroLatestUpdatesOptions {
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}

function toIsoDate(val?: string | Date | null): string | undefined {
  if (!val) return undefined;
  if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val.toISOString();
  if (typeof val === 'string') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  }
  return undefined;
}

function hasBeenUpdated(updatedAt?: string | Date | null, originalDate?: string | Date | null): boolean {
  if (!updatedAt || !originalDate) return false;
  const updatedTime = new Date(updatedAt).getTime();
  const origTime = new Date(originalDate).getTime();
  return !isNaN(updatedTime) && !isNaN(origTime) && updatedTime > origTime;
}

export function useHeroLatestUpdates(options: UseHeroLatestUpdatesOptions = {}) {
  const {
    refetchOnWindowFocus = true,
    staleTime = 1000 * 30, // 30 seconds default freshness for latest hero feed
    refetchInterval,
  } = options;

  const queryOpts = {
    limit: 5,
    refetchOnWindowFocus,
    staleTime,
    ...(refetchInterval !== undefined ? { refetchInterval } : {}),
  };

  const {
    data: blogData,
    isLoading: isLoadingBlog,
    refetch: refetchBlog,
    isFetching: isFetchingBlog,
  } = useBlogPosts(queryOpts);

  const {
    data: portfolioData,
    isLoading: isLoadingPortfolio,
    refetch: refetchPortfolio,
    isFetching: isFetchingPortfolio,
  } = usePortfolioItems(queryOpts);

  const {
    data: consultationsData,
    isLoading: isLoadingConsultations,
    refetch: refetchConsultations,
    isFetching: isFetchingConsultations,
  } = useConsultations(queryOpts);

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
    isFetching: isFetchingProducts,
  } = useProducts(queryOpts);

  const {
    data: solutionsData,
    isLoading: isLoadingSolutions,
    refetch: refetchSolutions,
    isFetching: isFetchingSolutions,
  } = useSolutions(queryOpts);

  const {
    data: servicesData,
    isLoading: isLoadingServices,
    refetch: refetchServices,
    isFetching: isFetchingServices,
  } = useServices(queryOpts);

  const updates = useMemo<HeroUpdateItem[]>(() => {
    const collected: HeroUpdateItem[] = [];

    // 1. Blog posts
    if (blogData?.posts && Array.isArray(blogData.posts)) {
      for (const post of blogData.posts) {
        const originalDate = toIsoDate(post.publishedAt) || toIsoDate(post.createdAt);
        const updatedDate = toIsoDate(post.updatedAt);
        const isUpdated = hasBeenUpdated(updatedDate, originalDate);
        const rawDate = updatedDate || originalDate;

        collected.push({
          id: `blog-${post.id}`,
          type: 'blog',
          typeLabel: 'Engineering Blog',
          title: post.title,
          description: post.excerpt || (post.content ? post.content.slice(0, 140) + '...' : ''),
          href: `/blog/${post.slug || post.id}`,
          date: rawDate,
          dateFormatted: rawDate ? formatDate(rawDate, 'MMM d, yyyy') : undefined,
          isUpdated,
          tag: post.categoryName || (post.tags && post.tags[0]) || 'Article',
          iconName: 'BookOpen',
          badgeVariant: 'info',
          image: post.coverImage,
          colorClasses: {
            badgeBg: 'bg-sky-50 dark:bg-sky-950/60',
            badgeText: 'text-sky-700 dark:text-sky-300',
            border: 'border-sky-500/30',
            glow: 'from-sky-500/10',
            iconBg: 'bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400',
            iconText: 'text-sky-600 dark:text-sky-400',
            actionText: 'text-sky-600 dark:text-sky-400 hover:text-sky-700',
          },
        });
      }
    }

    // 2. Portfolio items
    if (portfolioData?.items && Array.isArray(portfolioData.items)) {
      for (const item of portfolioData.items) {
        const originalDate = toIsoDate(item.completedAt) || toIsoDate(item.createdAt);
        const updatedDate = toIsoDate(item.updatedAt);
        const isUpdated = hasBeenUpdated(updatedDate, originalDate);
        const rawDate = updatedDate || originalDate;

        collected.push({
          id: `portfolio-${item.id}`,
          type: 'portfolio',
          typeLabel: 'Portfolio Case Study',
          title: item.title,
          description: item.description || item.subtitle || 'Architectural project case study.',
          href: `/portfolio/${item.slug || item.id}`,
          date: rawDate,
          dateFormatted: rawDate ? formatDate(rawDate, 'MMM d, yyyy') : undefined,
          isUpdated,
          tag: item.client ? `${item.client} Delivery` : 'Client Delivery',
          iconName: 'FolderGit2',
          badgeVariant: 'brand',
          image: item.coverImage || (item.images && item.images[0]),
          colorClasses: {
            badgeBg: 'bg-orange-50 dark:bg-orange-950/60',
            badgeText: 'text-orange-700 dark:text-orange-300',
            border: 'border-orange-500/30',
            glow: 'from-orange-500/10',
            iconBg: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
            iconText: 'text-orange-600 dark:text-orange-400',
            actionText: 'text-orange-600 dark:text-orange-400 hover:text-orange-700',
          },
        });
      }
    }

    // 3. Consultation and Training
    if (consultationsData?.items && Array.isArray(consultationsData.items)) {
      for (const consultation of consultationsData.items) {
        const isTraining = (consultation.type as string) === ConsultationType.TRAINING;
        const originalDate = toIsoDate(consultation.preferredDate) || toIsoDate(consultation.createdAt);
        const updatedDate = toIsoDate(consultation.updatedAt);
        const isUpdated = hasBeenUpdated(updatedDate, originalDate);
        const rawDate = updatedDate || originalDate;

        if (isTraining) {
          collected.push({
            id: `training-${consultation.id}`,
            type: 'training',
            typeLabel: 'Corporate Workshop',
            title: consultation.trainingTopic || consultation.projectDescription || 'Hands-on Engineering Workshop',
            description: consultation.projectDescription || 'Hands-on architectural training cohort with live cloud sandbox labs.',
            href: `/consultations?type=training`,
            date: rawDate,
            dateFormatted: rawDate ? formatDate(rawDate, 'MMM d, yyyy') : 'Upcoming Cohort',
            isUpdated,
            tag: consultation.deliveryFormat || 'Training Workshop',
            iconName: 'GraduationCap',
            badgeVariant: 'warning',
            image: undefined,
            colorClasses: {
              badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
              badgeText: 'text-amber-700 dark:text-amber-300',
              border: 'border-amber-500/30',
              glow: 'from-amber-500/10',
              iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
              iconText: 'text-amber-600 dark:text-amber-400',
              actionText: 'text-amber-600 dark:text-amber-400 hover:text-amber-700',
            },
          });
        } else {
          collected.push({
            id: `consultation-${consultation.id}`,
            type: 'consultation',
            typeLabel: 'Architecture Advisory',
            title: consultation.projectDescription || 'Principal Architecture Discovery Call',
            description: consultation.company ? `Discovery advisory session for ${consultation.company}.` : '45-minute live whiteboard review and architectural roadmap evaluation.',
            href: `/consultations`,
            date: rawDate,
            dateFormatted: rawDate ? formatDate(rawDate, 'MMM d, yyyy') : 'Discovery Slot',
            isUpdated,
            tag: 'Technical Advisory',
            iconName: 'Video',
            badgeVariant: 'success',
            image: undefined,
            colorClasses: {
              badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
              badgeText: 'text-emerald-700 dark:text-emerald-300',
              border: 'border-emerald-500/30',
              glow: 'from-emerald-500/10',
              iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
              iconText: 'text-emerald-600 dark:text-emerald-400',
              actionText: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700',
            },
          });
        }
      }
    }

    // 4. Products
    if (productsData?.products && Array.isArray(productsData.products)) {
      for (const prod of productsData.products) {
        const originalDate = toIsoDate(prod.launchedAt) || toIsoDate(prod.createdAt);
        const updatedDate = toIsoDate(prod.updatedAt);
        const isUpdated = hasBeenUpdated(updatedDate, originalDate);
        const rawDate = updatedDate || originalDate;

        collected.push({
          id: `product-${prod.id}`,
          type: 'product',
          typeLabel: 'Product Release',
          title: prod.name,
          description: prod.tagline || prod.description,
          href: `/products/${prod.slug || prod.id}`,
          date: rawDate,
          dateFormatted: rawDate ? formatDate(rawDate, 'MMM d, yyyy') : 'Live Release',
          isUpdated,
          tag: prod.category ? `${prod.category} Product` : 'SaaS Platform',
          iconName: 'Package',
          badgeVariant: 'brand',
          image: (prod.screenshots && prod.screenshots[0]) || prod.logo,
          colorClasses: {
            badgeBg: 'bg-brand-50 dark:bg-brand-950/60',
            badgeText: 'text-brand-700 dark:text-brand-300',
            border: 'border-brand-500/30',
            glow: 'from-brand-500/10',
            iconBg: 'bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400',
            iconText: 'text-brand-600 dark:text-brand-400',
            actionText: 'text-brand-600 dark:text-brand-400 hover:text-brand-700',
          },
        });
      }
    }

    // 5. Solutions
    if (solutionsData?.solutions && Array.isArray(solutionsData.solutions)) {
      for (const sol of solutionsData.solutions) {
        const originalDate = toIsoDate(sol.createdAt);
        const updatedDate = toIsoDate(sol.updatedAt);
        const isUpdated = hasBeenUpdated(updatedDate, originalDate);
        const rawDate = updatedDate || originalDate;

        collected.push({
          id: `solution-${sol.id}`,
          type: 'solution',
          typeLabel: 'Enterprise Solution',
          title: sol.name,
          description: sol.tagline || sol.description,
          href: `/solutions/${sol.slug || sol.id}`,
          date: rawDate,
          dateFormatted: rawDate ? formatDate(rawDate, 'MMM d, yyyy') : 'Available',
          isUpdated,
          tag: sol.industries?.[0] ? `${sol.industries[0]} Blueprint` : 'Enterprise Blueprint',
          iconName: sol.icon || 'Layers',
          badgeVariant: 'info',
          image: sol.coverImage,
          colorClasses: {
            badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
            badgeText: 'text-indigo-700 dark:text-indigo-300',
            border: 'border-indigo-500/30',
            glow: 'from-indigo-500/10',
            iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
            iconText: 'text-indigo-600 dark:text-indigo-400',
            actionText: 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700',
          },
        });
      }
    }

    // 6. Services
    if (servicesData?.services && Array.isArray(servicesData.services)) {
      for (const serv of servicesData.services) {
        const isTrainingService = serv.category === 'training';
        const originalDate = toIsoDate(serv.createdAt);
        const updatedDate = toIsoDate(serv.updatedAt);
        const isUpdated = hasBeenUpdated(updatedDate, originalDate);
        const rawDate = updatedDate || originalDate;

        collected.push({
          id: `service-${serv.id}`,
          type: isTrainingService ? 'training' : 'service',
          typeLabel: isTrainingService ? 'Corporate Workshop' : 'Engineering Service',
          title: serv.name,
          description: serv.tagline || serv.shortDescription || serv.description,
          href: isTrainingService ? `/consultations?type=training` : `/services/${serv.slug || serv.id}`,
          date: rawDate,
          dateFormatted: rawDate ? formatDate(rawDate, 'MMM d, yyyy') : 'Available Track',
          isUpdated,
          tag: isTrainingService ? 'Workshop Syllabus' : 'Core Discipline',
          iconName: serv.icon || (isTrainingService ? 'GraduationCap' : 'Cpu'),
          badgeVariant: isTrainingService ? 'warning' : 'neutral',
          image: serv.coverImage,
          colorClasses: isTrainingService
            ? {
                badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
                badgeText: 'text-amber-700 dark:text-amber-300',
                border: 'border-amber-500/30',
                glow: 'from-amber-500/10',
                iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
                iconText: 'text-amber-600 dark:text-amber-400',
                actionText: 'text-amber-600 dark:text-amber-400 hover:text-amber-700',
              }
            : {
                badgeBg: 'bg-teal-50 dark:bg-teal-950/60',
                badgeText: 'text-teal-700 dark:text-teal-300',
                border: 'border-teal-500/30',
                glow: 'from-teal-500/10',
                iconBg: 'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400',
                iconText: 'text-teal-600 dark:text-teal-400',
                actionText: 'text-teal-600 dark:text-teal-400 hover:text-teal-700',
              },
        });
      }
    }

    // Sort all dynamically fetched items strictly by date descending (newest first)
    const sorted = [...collected].sort((a, b) => {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      return timeB - timeA;
    });

    // Strictly dynamic: maximum 5 latest items from any domain
    return sorted.slice(0, 5);
  }, [
    blogData,
    portfolioData,
    consultationsData,
    productsData,
    solutionsData,
    servicesData,
  ]);

  const isLoading =
    isLoadingBlog &&
    isLoadingPortfolio &&
    isLoadingConsultations &&
    isLoadingProducts &&
    isLoadingSolutions &&
    isLoadingServices;

  const isFetching =
    Boolean(isFetchingBlog) ||
    Boolean(isFetchingPortfolio) ||
    Boolean(isFetchingConsultations) ||
    Boolean(isFetchingProducts) ||
    Boolean(isFetchingSolutions) ||
    Boolean(isFetchingServices);

  const refetch = useCallback(async () => {
    const results = await Promise.allSettled([
      refetchBlog(),
      refetchPortfolio(),
      refetchConsultations(),
      refetchProducts(),
      refetchSolutions(),
      refetchServices(),
    ]);
    return results;
  }, [
    refetchBlog,
    refetchPortfolio,
    refetchConsultations,
    refetchProducts,
    refetchSolutions,
    refetchServices,
  ]);

  return { updates, isLoading, isFetching, refetch };
}
