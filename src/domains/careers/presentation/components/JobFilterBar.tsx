import React, { useState, useMemo } from 'react';
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';
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
  totalResults?: number;
  actions?: React.ReactNode;
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
  totalResults,
  actions,
  className = '',
}) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedDepartment && selectedDepartment !== 'All') count++;
    if (selectedMode) count++;
    if (selectedLevel) count++;
    return count;
  }, [selectedDepartment, selectedMode, selectedLevel]);

  const activeChips = useMemo(() => {
    const chips = [];
    if (search) {
      chips.push({
        id: 'search',
        label: `Search: "${search}"`,
        onRemove: () => onSearchChange(''),
      });
    }
    if (selectedDepartment && selectedDepartment !== 'All') {
      chips.push({
        id: 'department',
        label: `Dept: ${selectedDepartment}`,
        onRemove: () => onSelectDepartment('All'),
      });
    }
    if (selectedMode) {
      chips.push({
        id: 'mode',
        label: `Mode: ${selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}`,
        onRemove: () => onSelectMode(''),
      });
    }
    if (selectedLevel) {
      chips.push({
        id: 'level',
        label: `Level: ${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}`,
        onRemove: () => onSelectLevel(''),
      });
    }
    return chips;
  }, [search, selectedDepartment, selectedMode, selectedLevel, onSearchChange, onSelectDepartment, onSelectMode, onSelectLevel]);

  return (
    <div className={className}>
      <SearchFilterBar
        searchValue={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search roles by title, stack, keyword..."
        isFilterExpanded={isFilterExpanded}
        onToggleFilter={() => setIsFilterExpanded((prev) => !prev)}
        activeFilterCount={activeFilterCount}
        activeChips={activeChips}
        onClearAllFilters={onReset}
        resultsSummary={
          totalResults !== undefined ? (
            <span className="text-xs text-slate-500 font-medium">
              Found <span className="font-semibold text-slate-700 dark:text-slate-300">{totalResults}</span> positions
            </span>
          ) : undefined
        }
        actions={actions}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <FilterGroup label="Department" count={selectedDepartment !== 'All' ? 1 : undefined}>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {departments.map((dept) => (
                <FilterPill
                  key={dept}
                  label={dept}
                  isActive={selectedDepartment === dept}
                  onClick={() => onSelectDepartment(dept)}
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Work Mode" count={selectedMode ? 1 : undefined}>
            <FilterSelect
              value={selectedMode}
              onChange={(e) => onSelectMode(e.target.value as WorkMode | '')}
              options={[
                { value: '', label: 'All Work Modes' },
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'on-site', label: 'On-Site' },
              ]}
            />
          </FilterGroup>

          <FilterGroup label="Experience Level" count={selectedLevel ? 1 : undefined}>
            <FilterSelect
              value={selectedLevel}
              onChange={(e) => onSelectLevel(e.target.value as ExperienceLevel | '')}
              options={[
                { value: '', label: 'All Experience Levels' },
                { value: 'junior', label: 'Junior' },
                { value: 'mid', label: 'Mid-Level' },
                { value: 'senior', label: 'Senior' },
                { value: 'lead', label: 'Lead / Principal' },
              ]}
            />
          </FilterGroup>
        </div>
      </SearchFilterBar>
    </div>
  );
};
