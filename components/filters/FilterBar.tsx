import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Button, Badge } from 'react-native-paper';
import { Filters, DatasetName } from '@/types';
import { DATASET_FILTER_FIELDS, FILTER_LABELS } from '@/constants/filters';
import FilterModal from './FilterModal';

interface FilterBarProps {
  filters: Filters;
  onUpdateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function FilterBar({
  filters,
  onUpdateFilter,
  onClearFilters,
  activeFilterCount,
}: FilterBarProps) {
  const [modalField, setModalField] = useState<string | null>(null);
  const filterFields = DATASET_FILTER_FIELDS[filters.dataset];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filterFields.map((field) => {
          const value = filters[field as keyof Filters] as string | undefined;
          const isActive = !!value && value !== 'All';
          return (
            <Chip
              key={field}
              mode={isActive ? 'flat' : 'outlined'}
              selected={isActive}
              onPress={() => setModalField(field)}
              style={[styles.chip, isActive && styles.activeChip]}
              textStyle={isActive ? styles.activeChipText : undefined}
              compact
            >
              {isActive ? `${FILTER_LABELS[field]}: ${value}` : FILTER_LABELS[field]}
            </Chip>
          );
        })}
        {activeFilterCount > 0 && (
          <Chip
            mode="outlined"
            onPress={onClearFilters}
            style={styles.clearChip}
            icon="close"
            compact
          >
            Clear ({activeFilterCount})
          </Chip>
        )}
      </ScrollView>

      {modalField && (
        <FilterModal
          visible={true}
          field={modalField}
          currentValue={filters[modalField as keyof Filters] as string | undefined}
          onSelect={(value) => {
            onUpdateFilter(modalField as keyof Filters, value as Filters[keyof Filters]);
            setModalField(null);
          }}
          onDismiss={() => setModalField(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    marginRight: 4,
  },
  activeChip: {
    backgroundColor: '#1B5E20',
  },
  activeChipText: {
    color: '#fff',
  },
  clearChip: {
    borderColor: '#D32F2F',
  },
});
