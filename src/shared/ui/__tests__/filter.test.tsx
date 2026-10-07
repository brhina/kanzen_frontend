import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterPillsGroup,
  FilterSelect,
  ActiveFilterChips,
} from '../index';

describe('Advanced Search & Filter Primitives Rendering', () => {
  it('renders SearchFilterBar with search input and filters toggle button', () => {
    const html = renderToStaticMarkup(
      <SearchFilterBar
        search="Kubernetes"
        onSearchChange={() => {}}
        searchPlaceholder="Search architecture articles..."
        activeFilterCount={3}
        filterButtonLabel="Filters"
        totalCount={24}
        filteredCount={8}
        hasActiveFilters={true}
        onReset={() => {}}
      >
        <div>Filter Content Inside</div>
      </SearchFilterBar>,
    );

    expect(html).toContain('Kubernetes');
    expect(html).toContain('Search architecture articles...');
    expect(html).toContain('Filters');
    expect(html).toContain('3'); // activeFilterCount badge
    expect(html).toContain('Reset');
  });

  it('renders ActiveFilterChips with dismissible filter tags and clear all button', () => {
    const chips = [
      { id: 'cat', label: 'Category: Cloud', onRemove: () => {} },
      { id: 'stat', label: 'Status: Published', onRemove: () => {} },
    ];

    const html = renderToStaticMarkup(
      <ActiveFilterChips chips={chips} onClearAll={() => {}} />,
    );

    expect(html).toContain('Active Filters:');
    expect(html).toContain('Category: Cloud');
    expect(html).toContain('Status: Published');
    expect(html).toContain('Clear all');
  });

  it('renders FilterGroup with label and child controls', () => {
    const html = renderToStaticMarkup(
      <FilterGroup label="Industry Domain" count={5}>
        <p>Select Options</p>
      </FilterGroup>,
    );

    expect(html).toContain('Industry Domain');
    expect(html).toContain('5');
    expect(html).toContain('Select Options');
  });

  it('renders FilterPill and FilterPillsGroup with active state', () => {
    const htmlPill = renderToStaticMarkup(
      <FilterPill label="Distributed Systems" isSelected={true} count={12} />,
    );
    expect(htmlPill).toContain('Distributed Systems');
    expect(htmlPill).toContain('12');
    expect(htmlPill).toContain('bg-brand-600');

    const htmlGroup = renderToStaticMarkup(
      <FilterPillsGroup
        options={[
          { id: 'all', label: 'All Items' },
          { id: 'saas', label: 'SaaS Platforms', count: 4 },
        ]}
        selectedId="saas"
        onSelect={() => {}}
      />,
    );
    expect(htmlGroup).toContain('All Items');
    expect(htmlGroup).toContain('SaaS Platforms');
  });

  it('renders FilterSelect with options', () => {
    const html = renderToStaticMarkup(
      <FilterSelect
        label="Pricing Model"
        value="fixed"
        onChange={() => {}}
        options={[
          { value: 'all', label: 'All Models' },
          { value: 'fixed', label: 'Fixed Scope', count: 8 },
        ]}
      />,
    );

    expect(html).toContain('Pricing Model');
    expect(html).toContain('All Models');
    expect(html).toContain('Fixed Scope (8)');
  });
});
