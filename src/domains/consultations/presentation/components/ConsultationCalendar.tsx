import { useState } from 'react';
import { Globe, Clock } from 'lucide-react';

const TIME_SLOTS = [
  '09:00',
  '10:30',
  '12:00',
  '14:00',
  '15:30',
  '17:00',
  '18:30',
];

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET / New York)' },
  { value: 'America/Chicago', label: 'Central Time (CT / Chicago)' },
  { value: 'America/Denver', label: 'Mountain Time (MT / Denver)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT / San Francisco)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT / London)' },
  { value: 'Europe/Berlin', label: 'Central European Time (CET / Berlin)' },
  { value: 'Africa/Nairobi', label: 'East Africa Time (EAT / Nairobi)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST / Dubai)' },
  { value: 'Asia/Singapore', label: 'Singapore Time (SGT / Singapore)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
];

interface ConsultationCalendarProps {
  selectedDate?: string;
  onSelectDate: (dateIso: string) => void;
  selectedTime?: string;
  onSelectTime: (time: string) => void;
  timezone: string;
  onTimezoneChange: (tz: string) => void;
  className?: string;
}

function generateUpcomingDates(): Array<{ dateString: string; dayName: string; dayNumber: number; monthName: string }> {
  const dates: Array<{ dateString: string; dayName: string; dayNumber: number; monthName: string }> = [];
  const current = new Date();
  current.setHours(12, 0, 0, 0);

  let count = 0;
  while (dates.length < 10 && count < 30) {
    current.setDate(current.getDate() + 1);
    count++;
    const dayOfWeek = current.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateString = current.toISOString().slice(0, 10);
    const dayName = current.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = current.getDate();
    const monthName = current.toLocaleDateString('en-US', { month: 'short' });

    dates.push({ dateString, dayName, dayNumber, monthName });
  }
  return dates;
}

export function ConsultationCalendar({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  timezone,
  onTimezoneChange,
  className = '',
}: ConsultationCalendarProps) {
  const [availableDates] = useState(generateUpcomingDates);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Timezone Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-brand-600" />
          Your Local Timezone
        </label>
        <select
          value={timezone}
          onChange={(e) => onTimezoneChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Picker Ribbon */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Select Preferred Date
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {availableDates.map((item) => {
            const isSelected = selectedDate === item.dateString;
            return (
              <button
                key={item.dateString}
                type="button"
                onClick={() => onSelectDate(item.dateString)}
                className={`py-3 px-2 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md ring-2 ring-brand-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <div className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-brand-100' : 'text-slate-400'}`}>
                  {item.dayName}
                </div>
                <div className="text-lg font-extrabold my-0.5 leading-none">
                  {item.dayNumber}
                </div>
                <div className={`text-[11px] font-medium ${isSelected ? 'text-brand-200' : 'text-slate-500'}`}>
                  {item.monthName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Picker */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand-600" />
          Select Preferred Slot ({timezone.split('/')[1]?.replace('_', ' ') || timezone})
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIME_SLOTS.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                type="button"
                onClick={() => onSelectTime(time)}
                className={`py-2.5 px-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
