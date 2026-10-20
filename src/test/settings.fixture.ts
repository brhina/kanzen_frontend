/**
 * Test fixture mirroring the kanzen-backend DEFAULT_SETTINGS seed registry.
 * Marketing pages render exclusively from these settings; tests seed the
 * public settings query with this payload instead of asserting hardcoded copy.
 */
import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';

export const PUBLIC_SETTINGS_FIXTURE: Record<string, unknown> = {
  "company.name": "Veyroo Tech",
  "company.tagline": "Engineering Digital Mastery",
  "company.email": "contact@veyroo.tech",
  "company.phone": "+254 700 000 000",
  "company.address": "Nairobi, Kenya",
  "contact.supportEmail": "contact@veyroo.tech",
  "contact.businessHours": "Monday – Friday: 08:00 – 18:00 EAT",
  "contact.headquarters": "Nairobi, Kenya",
  "contact.badge": "Direct Communication & Inquiries",
  "contact.title": "Get in Touch with {{companyName}}",
  "contact.description": "Have questions about our engineering capabilities, consulting engagements, or partnership programs? We are here to help.",
  "seo.defaultTitle": "Veyroo Tech | Premium Product Engineering & SaaS Solutions",
  "seo.defaultDescription": "Veyroo Tech engineers high-performance web systems, cloud architectures, and modern product experiences.",
  "social.github": "https://github.com/veyroo-tech",
  "social.linkedin": "https://linkedin.com/company/veyroo-tech",
  "social.twitter": "https://twitter.com/veyrootech",
  "home.hero.badge": "Next-Generation Digital Infrastructure",
  "home.hero.kicker": "High-Impact Engineering, Architecture & AI",
  "home.hero.title": "High-Impact Engineering, Architecture & AI",
  "home.hero.titleHighlight": "Architecture & AI",
  "home.hero.subtitle": "Enterprise cloud microservices, mission-critical distributed systems, and AI infrastructure.",
  "home.hero.loadingText": "Loading latest platform dispatches...",
  "home.hero.primaryCtaLabel": "Start an Engagement",
  "home.hero.primaryCtaHref": "/contact",
  "home.hero.secondaryCtaLabel": "Explore Solutions",
  "home.hero.secondaryCtaHref": "/solutions",
  "home.hero.actionLabels": {
    "blog": "Read Article",
    "training": "Reserve Workshop Cohort",
    "consultation": "Book Discovery Call",
    "product": "Explore Product Platform",
    "solution": "View Enterprise Solution",
    "service": "Explore Service Syllabus",
    "portfolio": "View Case Study",
    "default": "Explore Update"
  },
  "home.competencies.badge": "Core Competencies",
  "home.competencies.title": "Architectural Rigor Meets High Performance",
  "home.competencies.description": "From resilient cloud microservices to fine-tuned neural models, we deliver full-lifecycle engineering.",
  "home.competencies.cardCtaLabel": "Learn more",
  "home.competencies.fallbackItems": [
    {
      "title": "Enterprise Solutions",
      "description": "Custom domain platforms, scalable ERP/CRM backends, and multi-tenant architectures.",
      "icon": "Layers",
      "href": "/solutions"
    },
    {
      "title": "AI & Deep Learning",
      "description": "Autonomous agents, LLM orchestration pipelines, vector embeddings, and on-prem inference.",
      "icon": "Cpu",
      "href": "/services"
    },
    {
      "title": "High-Performance Cloud",
      "description": "Kubernetes cluster automation, microservice optimization, and sub-second edge computing.",
      "icon": "Zap",
      "href": "/portfolio"
    }
  ],
  "process.badge": "Engineering Discipline",
  "process.title": "The Veyroo Delivery Framework",
  "process.description": "A predictable, milestone-driven engineering cycle designed to eliminate architectural debt and deliver high-velocity stability.",
  "process.sectionCtaLabel": "Explore Full Delivery Process",
  "process.cta.title": "Ready to initiate your architecture cycle?",
  "process.cta.description": "Our engineering leadership is ready to analyze your platform requirements and scope.",
  "process.cta.buttonLabel": "Initiate Discovery Phase",
  "process.cta.buttonHref": "/contact",
  "home.testimonials.badge": "Client Endorsements",
  "home.testimonials.title": "Trusted by High-Velocity Engineering Teams",
  "home.testimonials.description": "Read how engineering leadership and architectural teams partner with {{companyName}} to design, modernize, and scale mission-critical systems.",
  "home.testimonials.ctaLabel": "View All Client Endorsements",
  "home.testimonials.loadingText": "Loading client endorsements...",
  "home.testimonials.emptyText": "Client endorsements and partner reviews will appear here once published.",
  "home.cta.title": "Ready to Build Scalable, Resilient Software?",
  "home.cta.description": "Schedule an architecture consultation with our principal engineering team to evaluate your roadmap and system bottlenecks.",
  "home.cta.primaryLabel": "Book Consultation",
  "home.cta.primaryHref": "/consultations",
  "home.cta.secondaryLabel": "View Case Studies",
  "home.cta.secondaryHref": "/case-studies",
  "about.banner.badge": "Our Principles & Mission",
  "about.banner.title": "Engineering Perfection at Enterprise Scale",
  "about.banner.description": "\"{{companyName}}\" stands for completeness, perfection, and wholeness. {{tagline}}. We approach digital systems engineering not as ad-hoc software development, but as enduring enterprise craft.",
  "about.story.badge": "Our Story",
  "about.story.title": "Built by Engineers, for Engineering Excellence",
  "about.story.description": "{{companyName}} was founded on a simple conviction: enterprise software deserves the same rigor as bridges and aircraft. What began as a small group of principal architects taking on the industry's hardest reliability problems has grown into a full-spectrum engineering firm delivering cloud platforms, distributed systems, and applied AI for teams that cannot afford to fail.",
  "about.mission.title": "Our Mission",
  "about.mission.text": "To engineer digital systems of uncompromising completeness — shipping resilient, secure, and measurable software that elevates our clients' technical standard and compounds their competitive advantage.",
  "about.vision.title": "Our Vision",
  "about.vision.text": "A world where enterprise software is a strategic asset rather than a liability — where every platform we touch is observable, scalable, and built to outlast the trends that shaped it.",
  "about.stats": [
    {
      "value": "120+",
      "label": "Projects Delivered",
      "icon": "FolderGit2"
    },
    {
      "value": "99.99%",
      "label": "Platform Uptime",
      "icon": "ShieldCheck"
    },
    {
      "value": "40+",
      "label": "Senior Engineers",
      "icon": "Users"
    },
    {
      "value": "8",
      "label": "Years in Operation",
      "icon": "Activity"
    }
  ],
  "about.cta.title": "Ready to elevate your engineering standard?",
  "about.cta.description": "Schedule an architectural deep dive with our principal engineering team.",
  "about.cta.buttonLabel": "Consult With Us",
  "about.cta.buttonHref": "/contact",
  "company.values": [
    {
      "title": "Architectural Rigor",
      "description": "We favor deterministic, type-safe, and formally verified patterns over fragile abstractions.",
      "icon": "Target"
    },
    {
      "title": "Zero-Trust Security",
      "description": "Every API, data store, and network boundary is audited with end-to-end RBAC and encryption.",
      "icon": "Shield"
    },
    {
      "title": "Senior Engineers Only",
      "description": "Our engagements are executed exclusively by principal architects and staff software engineers.",
      "icon": "Users"
    },
    {
      "title": "Measured Outcomes",
      "description": "We tie engineering deliverables directly to measurable business KPIs, SLA benchmarks, and ROI.",
      "icon": "Award"
    }
  ],
  "company.proof_points": [
    {
      "label": "99.99% Guaranteed SLA",
      "icon": "CheckCircle2"
    },
    {
      "label": "Zero-Trust Security",
      "icon": "ShieldCheck"
    },
    {
      "label": "Sub-50ms Global Latency",
      "icon": "Zap"
    }
  ],
  "company.process_steps": [
    {
      "step": "01",
      "title": "Architectural Discovery",
      "description": "We audit domain constraints, concurrency bottlenecks, threat models, and latency requirements.",
      "icon": "Search"
    },
    {
      "step": "02",
      "title": "Domain Modeling & Blueprinting",
      "description": "We draft formal DDD models, bounded contexts, API contracts, and infrastructure topologies.",
      "icon": "Compass"
    },
    {
      "step": "03",
      "title": "Precision Implementation",
      "description": "Iterative delivery in production-grade TypeScript/NestJS, clean architecture, and exhaustive test coverage.",
      "icon": "Code2"
    },
    {
      "step": "04",
      "title": "Observability & Global Deployment",
      "description": "Zero-downtime rolling deploys, distributed tracing, telemetry alerts, and automated autoscaling.",
      "icon": "Rocket"
    }
  ],
  "testimonials.banner.badge": "Client Endorsements & Proof",
  "testimonials.banner.title": "Wall of Verified Client Love",
  "testimonials.banner.description": "Honest assessments, technical feedback, and engineering endorsements from leadership teams across the globe.",
  "newsletter.badge": "The Veyroo Architecture Dispatch",
  "newsletter.title": "Stay Ahead of Architectural Shifts",
  "newsletter.description": "Join 12,000+ engineering leaders receiving our weekly architectural breakdowns, production post-mortems, and scalable patterns.",
  "footer.description": "Architecting mission-critical digital systems, high-concurrency microservices, and enterprise AI infrastructure with uncompromising engineering rigor.",
  "footer.aboutLinkLabel": "About {{companyName}}",
};

/** Seeds the public settings query with backend-default content. */
export function seedPublicSettings(
  client: QueryClient,
  overrides: Record<string, unknown> = {},
): void {
  client.setQueryData(queryKeys.settings.public(), {
    ...PUBLIC_SETTINGS_FIXTURE,
    ...overrides,
  });
}
