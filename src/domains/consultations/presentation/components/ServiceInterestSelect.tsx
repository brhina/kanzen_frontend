import { useServices } from '@/domains/services/application/use-cases/useServices';

interface ServiceInterestSelectProps {
  value: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function ServiceInterestSelect({
  value = [],
  onChange,
  className = '',
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

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        Architecture & Service Domains
      </label>
      <div className="flex flex-wrap gap-2 pt-1">
        {serviceOptions.map((srv) => {
          const isSelected = value.includes(srv.id);
          return (
            <button
              key={srv.id}
              type="button"
              onClick={() => toggle(srv.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-brand-500'
              }`}
            >
              {srv.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
