import { ContactType } from '../../domain/enums/contact-type.enum';

interface ContactTypePickerProps {
  value: ContactType;
  onChange: (type: ContactType) => void;
  className?: string;
}

const TOPICS = [
  { id: ContactType.GENERAL, label: 'General Inquiry' },
  { id: ContactType.SUPPORT, label: 'Technical Support' },
  { id: ContactType.PARTNERSHIP, label: 'Partnership & Ventures' },
  { id: ContactType.MEDIA, label: 'Press & Media' },
  { id: ContactType.CAREERS, label: 'Careers & Recruiting' },
];

export function ContactTypePicker({
  value,
  onChange,
  className = '',
}: ContactTypePickerProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        Inquiry Category
      </label>
      <div className="flex flex-wrap gap-2 pt-1">
        {TOPICS.map((topic) => {
          const isSelected = value === topic.id;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onChange(topic.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-brand-500'
              }`}
            >
              {topic.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
