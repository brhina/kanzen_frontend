import { useServices } from '@/domains/services/application/use-cases/useServices';
import { Select } from '@/shared/ui/select';

interface ServiceInterestSelectProps {
  value: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  error?: string;
}

export function ServiceInterestSelect({
  value = [],
  onChange,
  className = '',
  error,
}: ServiceInterestSelectProps) {
  const { data: servicesData } = useServices();

  const services = (servicesData?.services || []).map((s) => ({
    id: s.slug || s.id,
    label: s.name,
  }));

  const serviceOptions =
    services.length > 0
      ? services
      : [
          { id: 'cloud-architecture-devops', label: 'Cloud Architecture & DevOps' },
          { id: 'full-stack-web-apps', label: 'Full-Stack Web Applications' },
          { id: 'healthtech-compliant-cloud', label: 'HealthTech & Compliance (HIPAA)' },
          { id: 'fintech-core-banking', label: 'FinTech & Core Banking' },
          { id: 'ai-intelligent-automation', label: 'AI & Intelligent Automation' },
          { id: 'technical-consulting-architecture', label: 'Technical Architecture Review' },
          { id: 'enterprise-cloud-kubernetes-training', label: 'Enterprise Kubernetes & Cloud Masterclass (Training)' },
          { id: 'production-genai-llm-workshop', label: 'Production GenAI & LLM Architecture (Training)' },
          { id: 'distributed-systems-bootcamp', label: 'Distributed Systems & Event Streams (Training)' },
          { id: 'legacy-modernization', label: 'Legacy Modernization' },
        ];

  return (
    <Select
      label="Architecture & Service Domains"
      className={className}
      error={error}
      value={value[0] ?? ''}
      onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
      options={[
        { value: '', label: 'Select a service domain...' },
        ...serviceOptions.map((srv) => ({ value: srv.id, label: srv.label })),
      ]}
    />
  );
}
