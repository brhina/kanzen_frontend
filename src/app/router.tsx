import { createBrowserRouter } from 'react-router';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Core Top-Level Pages
      { index: true, lazy: () => import('../pages/HomePage') },
      { path: 'about', lazy: () => import('../pages/AboutPage') },
      { path: 'process', lazy: () => import('../pages/ProcessPage') },
      { path: 'dashboard', lazy: () => import('../pages/DashboardPage') },

      // Unified Domain Offerings & Management Pages
      { path: 'blog', lazy: () => import('../domains/blog/presentation/pages/BlogPage') },
      { path: 'blog/:slug', lazy: () => import('../domains/blog/presentation/pages/BlogPostPage') },
      { path: 'blog/category/:slug', lazy: () => import('../domains/blog/presentation/pages/BlogCategoryPage') },

      { path: 'services', lazy: () => import('../domains/services/presentation/pages/ServicesPage') },
      { path: 'services/:slug', lazy: () => import('../domains/services/presentation/pages/ServiceDetailPage') },

      { path: 'solutions', lazy: () => import('../domains/solutions/presentation/pages/SolutionsPage') },
      { path: 'solutions/:slug', lazy: () => import('../domains/solutions/presentation/pages/SolutionDetailPage') },

      { path: 'products', lazy: () => import('../domains/products/presentation/pages/ProductsPage') },
      { path: 'products/:slug', lazy: () => import('../domains/products/presentation/pages/ProductDetailPage') },

      { path: 'portfolio', lazy: () => import('../domains/portfolio/presentation/pages/PortfolioPage') },
      { path: 'portfolio/:slug', lazy: () => import('../domains/portfolio/presentation/pages/PortfolioItemPage') },

      { path: 'case-studies', lazy: () => import('../domains/case-studies/presentation/pages/CaseStudiesPage') },
      { path: 'case-studies/:slug', lazy: () => import('../domains/case-studies/presentation/pages/CaseStudyPage') },

      { path: 'testimonials', lazy: () => import('../domains/testimonials/presentation/pages/TestimonialsPage') },
      { path: 'leads', lazy: () => import('../domains/leads/presentation/pages/LeadsPage') },
      { path: 'leads/:id', lazy: () => import('../domains/leads/presentation/pages/LeadDetailPage') },

      { path: 'consultations', lazy: () => import('../domains/consultations/presentation/pages/ConsultationsPage') },
      { path: 'contact', lazy: () => import('../domains/contact/presentation/pages/ContactPage') },

      { path: 'careers', lazy: () => import('../domains/careers/presentation/pages/CareersPage') },
      { path: 'careers/:slug', lazy: () => import('../domains/careers/presentation/pages/JobPostingPage') },
      { path: 'applications', lazy: () => import('../domains/applications/presentation/pages/ApplicationsPage') },

      { path: 'newsletter', lazy: () => import('../domains/newsletter/presentation/pages/NewsletterPage') },
      { path: 'media', lazy: () => import('../domains/media/presentation/pages/MediaPage') },
      { path: 'notifications', lazy: () => import('../domains/notifications/presentation/pages/NotificationsPage') },
      { path: 'analytics', lazy: () => import('../domains/analytics/presentation/pages/AnalyticsPage') },
      { path: 'audit', lazy: () => import('../domains/audit/presentation/pages/AuditPage') },
      { path: 'settings', lazy: () => import('../domains/settings/presentation/pages/SettingsPage') },
      { path: 'health', lazy: () => import('../domains/health/presentation/pages/HealthPage') },
      { path: 'users', lazy: () => import('../domains/users/presentation/pages/UsersPage') },
      { path: 'users/:id', lazy: () => import('../domains/users/presentation/pages/UserDetailPage') },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', lazy: () => import('../domains/auth/presentation/pages/LoginPage') },
      { path: 'reset-password/:token', lazy: () => import('../domains/auth/presentation/pages/ResetPasswordPage') },
    ],
  },
  {
    path: '*',
    lazy: () => import('../pages/NotFoundPage'),
  },
]);

export default router;
