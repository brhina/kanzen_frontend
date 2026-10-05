import React from 'react';
import { Search, X, MapPin, Award } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import type {
  ExperienceLevel,
  WorkMode,
} from '../../domain/enums/job-posting.enums';

interface JobFilterBarProps {
  departments: string[];
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  selectedMode?: WorkMode | '';
  onSelectMode: (mode: WorkMode | '') => void;
  selectedLevel?: ExperienceLevel | '';
  onSelectLevel: (level: ExperienceLevel | '') => void;
  onReset?: () => void;
  className?: string;
}

export const JobFilterBar: React.FC<JobFilterBarProps> = ({
  departments,
  selectedDepartment,
  onSelectDepartment,
  search,
  onSearchChange,
  selectedMode = '',
  onSelectMode,
  selectedLevel = '',
  onSelectLevel,
  onReset,
  className = '',
}) => {
  const hasFilters = Boolean(
    selectedDepartment !== 'All' ||
      search ||
      selectedMode ||
      selectedLevel,
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Department Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {departments.map((dept) => {
          const isSelected = selectedDepartment === dept;
          return (
            <button
              key={dept}
              type="button"
              onClick={() => onSelectDepartment(dept)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-150 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {dept}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-5 relative">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roles by title, stack, keyword..."
            leftIcon={<Search className="h-4 w-4 text-slate-400" />}
          />
        </div>

        <div className="sm:col-span-3">
          <div className="relative">
            <select
              value={selectedMode}
              onChange={(e) => onSelectMode(e.target.value as WorkMode | '')}
              className="w-full h-10 px-3 pl-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">All Work Modes</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-Site</option>
            </select>
            <MapPin className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="sm:col-span-3">
          <div className="relative">
            <select
              value={selectedLevel}
              onChange={(e) =>
                onSelectLevel(e.target.value as ExperienceLevel | '')
              }
              className="w-full h-10 px-3 pl-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">All Experience Levels</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead / Principal</option>
            </select>
            <Award className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        {hasFilters && onReset && (
          <div className="sm:col-span-1 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
