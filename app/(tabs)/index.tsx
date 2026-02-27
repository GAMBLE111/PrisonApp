import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import DashboardCard from '@/components/DashboardCard';
import { getDatasetCount } from '@/services/firestore';
import { DatasetName, DATASET_LABELS } from '@/types';

const DATASETS: DatasetName[] = [
  'criminal_courts',
  'offenders',
  'prisoners',
  'corrective_services',
];

export default function DashboardScreen() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<DatasetName, number | null>>({
    criminal_courts: null,
    offenders: null,
    prisoners: null,
    corrective_services: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const results: Record<string, number | null> = {};
        for (const ds of DATASETS) {
          try {
            results[ds] = await getDatasetCount(ds);
          } catch {
            results[ds] = null;
          }
        }
        setCounts(results as Record<DatasetName, number | null>);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.heading}>
        Australian Crime Statistics
      </Text>
      <Text variant="bodyMedium" style={styles.subheading}>
        Data sourced from the Australian Bureau of Statistics
      </Text>

      <View style={styles.cardRow}>
        {DATASETS.map((ds) => (
          <DashboardCard
            key={ds}
            title={DATASET_LABELS[ds]}
            value={counts[ds]}
            loading={loading}
            subtitle="Total records"
            onPress={() =>
              router.push({
                pathname: '/(tabs)/reports',
                params: { dataset: ds },
              })
            }
          />
        ))}
      </View>

      <Surface style={styles.infoCard} elevation={1}>
        <Text variant="titleSmall" style={styles.infoTitle}>
          About This App
        </Text>
        <Text variant="bodySmall" style={styles.infoText}>
          This app provides reporting and visualisation of Australian crime
          statistics from four ABS datasets: Criminal Courts, Recorded Crime
          Offenders, Prisoners in Australia, and Corrective Services.
        </Text>
        <Text variant="bodySmall" style={styles.infoText}>
          Use the Reports tab to explore data with filters and charts, or
          browse raw datasets in the Datasets tab.
        </Text>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  heading: {
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  subheading: {
    color: '#666',
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  infoTitle: {
    marginBottom: 8,
    color: '#1B5E20',
  },
  infoText: {
    color: '#555',
    marginBottom: 6,
    lineHeight: 18,
  },
});
