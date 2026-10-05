import { Video, Phone, Users } from 'lucide-react';
import { MeetingType } from '../../domain/enums/meeting-type.enum';

interface MeetingTypePickerProps {
  value: MeetingType;
  onChange: (type: MeetingType) => void;
  className?: string;
}

const MEETING_TYPES = [
  {
    type: MeetingType.VIDEO,
    label: 'Video Conference',
    description: 'Google Meet / Zoom screen share with diagrams',
    icon: Video,
  },
  {
    type: MeetingType.PHONE,
    label: 'Direct Phone Call',
    description: 'Quick voice sync on cell or direct office line',
    icon: Phone,
  },
  {
    type: MeetingType.IN_PERSON,
    label: 'On-Site / In-Person',
    description: 'Face-to-face workshop at executive offices',
    icon: Users,
  },
];

export function MeetingTypePicker({ value, onChange, className = '' }: MeetingTypePickerProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}>
      {MEETING_TYPES.map((item) => {
        const isSelected = value === item.type;
        const Icon = item.icon;

        return (
          <button
            key={item.type}
            type="button"
            onClick={() => onChange(item.type)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              isSelected
                ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                isSelected
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              {item.label}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              {item.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
