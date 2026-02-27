import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DataTable, Text } from 'react-native-paper';
import { DatasetRecord, DatasetName } from '@/types';
import { formatNumber } from '@/utils/formatters';
import { FILTER_LABELS } from '@/constants/filters';

interface DataTableViewProps {
  data: DatasetRecord[];
  dataset: DatasetName;
  loading?: boolean;
}

const COLUMNS_BY_DATASET: Record<DatasetName, string[]> = {
  criminal_courts: ['state', 'year', 'offenceCategory', 'courtLevel', 'sex', 'ageGroup', 'sentenceType', 'count'],
  offenders: ['state', 'year', 'offenceCategory', 'sex', 'ageGroup', 'indigenousStatus', 'count'],
  prisoners: ['state', 'year', 'offenceCategory', 'sex', 'legalStatus', 'sentenceLength', 'count'],
  corrective_services: ['state', 'year', 'quarter', 'sex', 'orderType', 'legalStatus', 'count'],
};

const ITEMS_PER_PAGE = 15;

export default function DataTableView({ data, dataset, loading }: DataTableViewProps) {
  const [page, setPage] = useState(0);
  const columns = COLUMNS_BY_DATASET[dataset];
  const from = page * ITEMS_PER_PAGE;
  const to = Math.min((page + 1) * ITEMS_PER_PAGE, data.length);
  const pageData = data.slice(from, to);

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge">No data found</Text>
        <Text variant="bodySmall" style={styles.emptyHint}>
          Try adjusting your filters
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header>
            {columns.map((col) => (
              <DataTable.Title
                key={col}
                numeric={col === 'count'}
                style={col === 'count' ? styles.countCol : styles.col}
              >
                {FILTER_LABELS[col] || 'Count'}
              </DataTable.Title>
            ))}
          </DataTable.Header>

          {pageData.map((row, index) => (
            <DataTable.Row key={row.id || index}>
              {columns.map((col) => {
                const value = (row as unknown as Record<string, unknown>)[col];
                const display =
                  col === 'count' && typeof value === 'number'
                    ? formatNumber(value)
                    : String(value ?? '');
                return (
                  <DataTable.Cell
                    key={col}
                    numeric={col === 'count'}
                    style={col === 'count' ? styles.countCol : styles.col}
                  >
                    {display}
                  </DataTable.Cell>
                );
              })}
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(data.length / ITEMS_PER_PAGE)}
            onPageChange={setPage}
            label={`${from + 1}-${to} of ${data.length}`}
            numberOfItemsPerPage={ITEMS_PER_PAGE}
            showFastPaginationControls
          />
        </DataTable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  col: {
    minWidth: 100,
    paddingHorizontal: 8,
  },
  countCol: {
    minWidth: 80,
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyHint: {
    color: '#999',
    marginTop: 8,
  },
});
