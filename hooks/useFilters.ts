import { useState, useCallback } from 'react';
import { Filters, DatasetName } from '@/types';

const DEFAULT_FILTERS: Filters = {
  dataset: 'criminal_courts',
};

export function useFilters(initial?: Partial<Filters>) {
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    ...initial,
  });

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setDataset = useCallback((dataset: DatasetName) => {
    // Reset dataset-specific filters when switching datasets
    setFilters({ dataset });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ dataset: filters.dataset });
  }, [filters.dataset]);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'dataset' && value && value !== 'All'
  ).length;

  return {
    filters,
    updateFilter,
    setDataset,
    clearFilters,
    activeFilterCount,
  };
}
