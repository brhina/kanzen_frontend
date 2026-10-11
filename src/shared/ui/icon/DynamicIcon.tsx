import React from 'react';
import {
  Target,
  Shield,
  ShieldCheck,
  Users,
  Award,
  Search,
  Compass,
  Code2,
  Rocket,
  CheckCircle2,
  Zap,
  Cpu,
  Layers,
  Cloud,
  CreditCard,
  HeartPulse,
  Truck,
  Activity,
  FileCheck,
  FolderGit2,
  Briefcase,
  Package,
  Globe,
  Sparkles,
  type LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  target: Target,
  shield: Shield,
  shieldcheck: ShieldCheck,
  users: Users,
  award: Award,
  search: Search,
  compass: Compass,
  code2: Code2,
  code: Code2,
  rocket: Rocket,
  checkcircle2: CheckCircle2,
  checkcircle: CheckCircle2,
  zap: Zap,
  cpu: Cpu,
  layers: Layers,
  cloud: Cloud,
  creditcard: CreditCard,
  heartpulse: HeartPulse,
  truck: Truck,
  activity: Activity,
  filecheck: FileCheck,
  foldergit2: FolderGit2,
  briefcase: Briefcase,
  package: Package,
  globe: Globe,
  sparkles: Sparkles,
};

export interface DynamicIconProps extends LucideProps {
  name?: string;
  fallback?: React.ComponentType<LucideProps>;
}

export function DynamicIcon({
  name,
  fallback = Sparkles,
  ...props
}: DynamicIconProps) {
  if (!name) {
    const FallbackComponent = fallback;
    return <FallbackComponent {...props} />;
  }

  const normalized = name.toLowerCase().replace(/[-_\s]/g, '');
  const IconComponent = ICON_MAP[normalized] || fallback;

  return <IconComponent {...props} />;
}

export function getDynamicIconComponent(
  name?: string,
  fallback: React.ComponentType<LucideProps> = Sparkles,
): React.ComponentType<LucideProps> {
  if (!name) return fallback;
  const normalized = name.toLowerCase().replace(/[-_\s]/g, '');
  return ICON_MAP[normalized] || fallback;
}
