import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SegmentedButtons, Text, IconButton, Menu } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useFilters } from '@/hooks/useFilters';
import { useFirestoreQuery } from '@/hooks/useFirestoreQuery';
import { useChartData } from '@/hooks/useChartData';
import FilterBar from '@/components/filters/FilterBar';
import DataTableView from '@/components/tables/DataTableView';
import BarChartView from '@/components/charts/BarChartView';
import LineChartView from '@/components/charts/LineChartView';
import PieChartView from '@/components/charts/PieChartView';
import { ChartType, DatasetName, GroupByField, DATASET_LABELS } from '@/types';
import { DATASET_GROUP_BY_FIELDS, FILTER_LABELS } from '@/constants/filters';

const DATASETS: { value: DatasetName; label: string }[] = [
  { value: 'criminal_courts', label: 'Courts' },
  { value: 'offenders', label: 'Offenders' },
  { value: 'prisoners', label: 'Prisoners' },
  { value: 'corrective_services', label: 'Corrective' },
];

type ViewMode = 'table' | 'chart';

export default function ReportsScreen() {
  const params = useLocalSearchParams<{ dataset?: string }>();
  const initialDataset = (params.dataset as DatasetName) || 'criminal_courts';

  const { filters, updateFilter, setDataset, clearFilters, activeFilterCount } =
    useFilters({ dataset: initialDataset });

  const { data, loading, error } = useFirestoreQuery(filters);

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [groupBy, setGroupBy] = useState<GroupByField>('state');
  const [groupByMenuVisible, setGroupByMenuVisible] = useState(false);

  const { chartData, total } = useChartData(data, groupBy);

  const groupByFields = DATASET_GROUP_BY_FIELDS[filters.dataset];

  return (
    <View style={styles.container}>
      {/* Dataset selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datasetBar}>
        <SegmentedButtons
          value={filters.dataset}
          onValueChange={(val) => setDataset(val as DatasetName)}
          buttons={DATASETS}
          density="small"
          style={styles.segmented}
        />
      </ScrollView>

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        onUpdateFilter={updateFilter}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* View mode toggle */}
      <View style={styles.toolbar}>
        <SegmentedButtons
          value={viewMode}
          onValueChange={(val) => setViewMode(val as ViewMode)}
          buttons={[
            { value: 'table', label: 'Table', icon: 'table' },
            { value: 'chart', label: 'Chart', icon: 'chart-bar' },
          ]}
          density="small"
          style={styles.viewToggle}
        />

        {viewMode === 'chart' && (
          <View style={styles.chartControls}>
            <SegmentedButtons
              value={chartType}
              onValueChange={(val) => setChartType(val as ChartType)}
              buttons={[
                { value: 'bar', label: 'Bar' },
                { value: 'line', label: 'Line' },
                { value: 'pie', label: 'Pie' },
              ]}
              density="small"
              style={styles.chartToggle}
            />
            <Menu
              visible={groupByMenuVisible}
              onDismiss={() => setGroupByMenuVisible(false)}
              anchor={
                <IconButton
                  icon="tune"
                  size={20}
                  onPress={() => setGroupByMenuVisible(true)}
                />
              }
            >
              {groupByFields.map((field) => (
                <Menu.Item
                  key={field}
                  title={FILTER_LABELS[field] || field}
                  onPress={() => {
                    setGroupBy(field);
                    setGroupByMenuVisible(false);
                  }}
                  leadingIcon={groupBy === field ? 'check' : undefined}
                />
              ))}
            </Menu>
          </View>
        )}
      </View>

      {/* Results info */}
      <View style={styles.resultsBar}>
        <Text variant="bodySmall" style={styles.resultsText}>
          {loading
            ? 'Loading...'
            : error
            ? `Error: ${error}`
            : `${data.length} records found`}
        </Text>
        {viewMode === 'chart' && (
          <Text variant="bodySmall" style={styles.groupByText}>
            Grouped by: {FILTER_LABELS[groupBy] || groupBy}
          </Text>
        )}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {viewMode === 'table' ? (
          <DataTableView data={data} dataset={filters.dataset} loading={loading} />
        ) : (
          <View style={styles.chartContainer}>
            {chartType === 'bar' && <BarChartView data={chartData} />}
            {chartType === 'line' && <LineChartView data={chartData} />}
            {chartType === 'pie' && <PieChartView data={chartData} />}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  datasetBar: {
    maxHeight: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  segmented: {
    margin: 8,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexWrap: 'wrap',
    gap: 8,
  },
  viewToggle: {
    maxWidth: 200,
  },
  chartControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartToggle: {
    maxWidth: 180,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#FAFAFA',
  },
  resultsText: {
    color: '#666',
  },
  groupByText: {
    color: '#1B5E20',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 12,
    padding: 8,
  },
});
