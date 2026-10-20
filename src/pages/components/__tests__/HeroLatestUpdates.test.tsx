import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeroLatestUpdates } from '../HeroLatestUpdates';
import { BlogPostStatus } from '@/domains/blog/domain/enums/blog-post-status.enum';
import { PortfolioCategory } from '@/domains/portfolio/domain/enums/portfolio-category.enum';
import { PortfolioItemStatus } from '@/domains/portfolio/domain/enums/portfolio-status.enum';
import { ProductCategory } from '@/domains/products/domain/enums/product-category.enum';
import { ProductStatus } from '@/domains/products/domain/enums/product-status.enum';
import { SolutionStatus } from '@/domains/solutions/domain/enums/solution-status.enum';
import { ServiceCategory } from '@/domains/services/domain/enums/service-category.enum';
import { ServiceItemStatus } from '@/domains/services/domain/enums/service-status.enum';
import { ConsultationType } from '@/domains/consultations/domain/enums/consultation-type.enum';
import { ConsultationStatus } from '@/domains/consultations/domain/enums/consultation-status.enum';
import { MeetingType } from '@/domains/consultations/domain/enums/meeting-type.enum';
import { seedPublicSettings } from '@/test/settings.fixture';

describe('HeroLatestUpdates Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    seedPublicSettings(queryClient);
  });

  const renderComponent = () => {
    return renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HeroLatestUpdates />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('renders clean state without any static fallback data when queries are empty', () => {
    const html = renderComponent();

    // Main region and heading without static fake posts
    expect(html).toContain('Latest engineering dispatches and system updates');
    expect(html).toContain('Next-Generation Digital Infrastructure');
    expect(html).toContain('High-Impact Engineering, Architecture &amp; AI');
    expect(html).toContain('Start an Engagement');
    expect(html).toContain('Explore Solutions');

    // No static fake post items rendered
    expect(html).not.toContain('fallback-blog-1');
    expect(html).not.toContain('Horizontal Dispatch Rail');
  });

  it('dynamically fetches and aggregates latest posts from blogs, portfolio, consultation/training, products, and solutions with background images behind titles', () => {
    // 1. Blog Post with cover image
    queryClient.setQueryData(['blog', 'public', { limit: 5 }], {
      posts: [
        {
          id: 'blog-post-99',
          title: 'Quantum-Resistant Distributed Ciphers in High-Throughput Pipelines',
          slug: 'quantum-resistant-ciphers',
          excerpt: 'Evaluating post-quantum encryption overhead on ultra-low latency event buses.',
          content: 'Full article text...',
          categoryName: 'Security & Infrastructure',
          tags: ['Cryptography', 'Infrastructure'],
          coverImage: '/images/blog/quantum-ciphers.png',
          readingTime: 6,
          viewCount: 140,
          likeCount: 42,
          isFeatured: true,
          allowComments: true,
          status: BlogPostStatus.PUBLISHED,
          author: 'user-1',
          publishedAt: '2026-10-19T08:00:00.000Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    // 2. Portfolio Item with cover image
    queryClient.setQueryData(['portfolio', 'public', { limit: 5 }], {
      items: [
        {
          id: 'portfolio-item-99',
          title: 'AeroCloud: Sub-millisecond Telemetry for Autonomous Drones',
          slug: 'aerocloud-sub-millisecond-telemetry',
          description: 'Engineered sub-millisecond telemetry routing across 45 edge regions.',
          coverImage: '/images/portfolio/aerocloud.png',
          images: [],
          category: PortfolioCategory.ENTERPRISE,
          services: ['Cloud Architecture', 'Edge Compute'],
          technologies: ['Rust', 'eBPF', 'Kubernetes'],
          isFeatured: true,
          isConfidential: false,
          order: 1,
          status: PortfolioItemStatus.PUBLISHED,
          metrics: [],
          client: 'AeroCloud Dynamics',
          completedAt: '2026-10-18T15:00:00.000Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    // 3. Consultation / Training
    queryClient.setQueryData(['consultations', 'public', { limit: 5 }], {
      items: [
        {
          id: 'training-session-99',
          name: 'Tech Corp Engineers',
          email: 'engineering@techcorp.com',
          projectDescription: 'Corporate training workshop for 25 platform architects.',
          trainingTopic: 'Distributed Systems & Microservice Resiliency Masterclass',
          type: ConsultationType.TRAINING,
          status: ConsultationStatus.SCHEDULED,
          meetingType: MeetingType.VIDEO,
          timezone: 'UTC',
          serviceInterest: ['Distributed Systems'],
          preferredDate: new Date('2026-10-17T12:00:00.000Z'),
          createdAt: new Date('2026-10-17T12:00:00.000Z'),
        },
      ],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    // 4. Product with screenshot image
    queryClient.setQueryData(['products', 'public', { limit: 5 }], {
      products: [
        {
          id: 'product-item-99',
          name: 'HyperMesh Enterprise 3.0',
          slug: 'hypermesh-enterprise-3',
          tagline: 'Instant zero-trust service mesh with sub-millisecond latency overhead.',
          description: 'High performance data plane proxy and automated telemetry.',
          screenshots: ['/images/products/hypermesh-dashboard.png'],
          category: ProductCategory.SAAS,
          techStack: ['Go', 'Envoy', 'Kubernetes'],
          status: ProductStatus.LIVE,
          isFeatured: true,
          order: 1,
          launchedAt: '2026-10-16T10:00:00.000Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    // 5. Solution with cover image
    queryClient.setQueryData(['solutions', 'public', { limit: 5 }], {
      solutions: [
        {
          id: 'solution-item-99',
          name: 'Multi-Tenant Banking Core Blueprint',
          slug: 'multi-tenant-banking-core',
          tagline: 'Hardened financial ledger architecture with deterministic transaction settlement.',
          description: 'Scalable financial solution platform built for high-throughput compliance.',
          coverImage: '/images/solutions/banking-core.png',
          features: ['Deterministic Engine', 'Double-entry Verification'],
          industries: ['FinTech'],
          status: SolutionStatus.ACTIVE,
          isFeatured: true,
          order: 1,
          updatedAt: '2026-10-15T09:00:00.000Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    // 6. Service (6th item, should be capped out by max 5)
    queryClient.setQueryData(['services', 'public', { limit: 5 }], {
      services: [
        {
          id: 'service-item-99',
          name: 'Enterprise Kubernetes Optimization & Hardening',
          slug: 'enterprise-kubernetes-optimization',
          tagline: 'Fine-tuning Linux kernel parameters and cluster topology for 500k req/sec.',
          description: 'In-depth cluster tuning service.',
          shortDescription: 'In-depth cluster tuning.',
          category: ServiceCategory.CLOUD,
          features: ['Kernel Tuning', 'Ingress Sharding'],
          deliverables: ['Custom Operator', 'Hardened Manifests'],
          technologies: ['Kubernetes', 'Linux', 'eBPF'],
          order: 1,
          isFeatured: true,
          status: ServiceItemStatus.ACTIVE,
          updatedAt: '2026-10-14T09:00:00.000Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    const html = renderComponent();

    // Verify newest dynamic item is rendered
    expect(html).toContain('Quantum-Resistant Distributed Ciphers in High-Throughput Pipelines');
    expect(html).toContain('/blog/quantum-resistant-ciphers');
    expect(html).toContain('Read Article');

    // Verify image is rendered behind the post
    expect(html).toContain('/images/blog/quantum-ciphers.png');
    expect(html).toContain('/images/portfolio/aerocloud.png');
    expect(html).toContain('/images/products/hypermesh-dashboard.png');
    expect(html).toContain('/images/solutions/banking-core.png');

    // Verify slide tabs for all 5 top dynamic items (strictly capped at 5)
    expect(html).toContain('Go to slide 1: Quantum-Resistant Distributed Ciphers in High-Throughput Pipelines');
    expect(html).toContain('Go to slide 2: AeroCloud: Sub-millisecond Telemetry for Autonomous Drones');
    expect(html).toContain('Go to slide 3: Distributed Systems &amp; Microservice Resiliency Masterclass');
    expect(html).toContain('Go to slide 4: HyperMesh Enterprise 3.0');
    expect(html).toContain('Go to slide 5: Multi-Tenant Banking Core Blueprint');
    expect(html).not.toContain('Go to slide 6');

    // Verify 6th item was capped out
    expect(html).not.toContain('Enterprise Kubernetes Optimization &amp; Hardening');

    // Controls removed per user design request
    expect(html).not.toContain('Previous update');
    expect(html).not.toContain('Next update');
    expect(html).not.toContain('Refresh latest updates');

    // CTAs and navigation rendered cleanly
    expect(html).toContain('Start an Engagement');
    expect(html).toContain('Explore Solutions');
  });

  it('correctly fetches and surfaces updated/edited products and portfolios to the top with Updated badge', () => {
    // Product created 6 months ago, but updated today (2026-10-19T12:00:00Z)
    queryClient.setQueryData(['products', 'public', { limit: 5 }], {
      products: [
        {
          id: 'product-legacy',
          name: 'HyperMesh Enterprise 3.1 Refactor',
          slug: 'hypermesh-refactor',
          tagline: 'Zero-trust enterprise service mesh updated with WebAssembly plugins.',
          description: 'Updated architecture platform.',
          screenshots: ['/images/products/hypermesh-dashboard.png'],
          category: ProductCategory.SAAS,
          techStack: ['Rust', 'Wasm'],
          status: ProductStatus.LIVE,
          isFeatured: true,
          order: 1,
          createdAt: '2026-04-01T00:00:00.000Z',
          launchedAt: '2026-04-01T00:00:00.000Z',
          updatedAt: '2026-10-19T12:00:00.000Z', // Recent update today!
        },
      ],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    // Portfolio item created 4 months ago, but updated yesterday (2026-10-18T18:00:00Z)
    queryClient.setQueryData(['portfolio', 'public', { limit: 5 }], {
      items: [
        {
          id: 'portfolio-legacy',
          name: 'AeroCloud Multi-Region Scaling',
          title: 'AeroCloud Multi-Region Scaling',
          slug: 'aerocloud-scaling',
          description: 'Expanded from 10 to 45 edge regions with automated failover.',
          coverImage: '/images/portfolio/aerocloud.png',
          images: [],
          category: PortfolioCategory.ENTERPRISE,
          services: ['Cloud Architecture'],
          technologies: ['Kubernetes'],
          isFeatured: true,
          order: 1,
          status: PortfolioItemStatus.PUBLISHED,
          client: 'AeroCloud Dynamics',
          createdAt: '2026-06-01T00:00:00.000Z',
          completedAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-10-18T18:00:00.000Z', // Updated yesterday
        },
      ],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    // Blog post published on 2026-10-15
    queryClient.setQueryData(['blog', 'public', { limit: 5 }], {
      posts: [
        {
          id: 'blog-post-older',
          title: 'Legacy Microservice Migration Patterns',
          slug: 'legacy-migration',
          content: 'Blog content...',
          categoryName: 'Cloud',
          publishedAt: '2026-10-15T00:00:00.000Z',
          status: BlogPostStatus.PUBLISHED,
          author: 'user-1',
        },
      ],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    const html = renderComponent();

    // Verify slide 1 is the recently updated product (updatedAt Oct 19)
    expect(html).toContain('Go to slide 1: HyperMesh Enterprise 3.1 Refactor');
    // Verify slide 2 is the updated portfolio item (updatedAt Oct 18)
    expect(html).toContain('Go to slide 2: AeroCloud Multi-Region Scaling');
    // Verify slide 3 is the blog post (publishedAt Oct 15)
    expect(html).toContain('Go to slide 3: Legacy Microservice Migration Patterns');

    // Both updated items display the "Updated" badge
    expect(html).toContain('Updated');
    expect(html).toContain('HyperMesh Enterprise 3.1 Refactor');
    expect(html).toContain('AeroCloud Multi-Region Scaling');
  });

  it('renders technical proof points and responsive mobile CTA structure properly', () => {
    const proofPoints = [
      { label: '99.99% Guaranteed SLA', icon: 'CheckCircle2' },
      { label: 'Zero-Trust Security', icon: 'ShieldCheck' },
      { label: 'Sub-50ms Global Latency', icon: 'Zap' },
    ];

    const html = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HeroLatestUpdates proofPoints={proofPoints} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Verify all proof points are rendered
    expect(html).toContain('99.99% Guaranteed SLA');
    expect(html).toContain('Zero-Trust Security');
    expect(html).toContain('Sub-50ms Global Latency');

    // Verify slide counter / controls are not rendered
    expect(html).not.toContain('Previous update');
    expect(html).not.toContain('Next update');
  });
});
