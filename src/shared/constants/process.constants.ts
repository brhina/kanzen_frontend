import { Search, Compass, Code2, Rocket, type LucideIcon } from 'lucide-react';

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const DELIVERY_PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Architectural Discovery',
    description: 'We audit domain constraints, concurrency bottlenecks, threat models, and latency requirements.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Domain Modeling & Blueprinting',
    description: 'We draft formal DDD models, bounded contexts, API contracts, and infrastructure topologies.',
    icon: Compass,
  },
  {
    step: '03',
    title: 'Precision Implementation',
    description: 'Iterative delivery in production-grade TypeScript/NestJS, clean architecture, and exhaustive test coverage.',
    icon: Code2,
  },
  {
    step: '04',
    title: 'Observability & Global Deployment',
    description: 'Zero-downtime rolling deploys, distributed tracing, telemetry alerts, and automated autoscaling.',
    icon: Rocket,
  },
];
