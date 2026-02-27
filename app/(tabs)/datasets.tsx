import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text, List, Divider, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { DatasetName, DATASET_LABELS, DatasetMetadata } from '@/types';
import { getDatasetMetadata } from '@/services/firestore';
import { DATASET_FILTER_FIELDS, FILTER_LABELS } from '@/constants/filters';

const DATASET_DESCRIPTIONS: Record<DatasetName, string> = {
  criminal_courts:
    'Defendants finalised in criminal courts, by offence, outcome, sentence type, and demographics across Australian states.',
  offenders:
    'Recorded crime offenders by offence type, age, sex, and Indigenous status.',
  prisoners:
    'Prisoners in Australia by offence, sentence length, demographics, and legal status.',
  corrective_services:
    'Custody and community-based corrections numbers by state and quarter.',
};

const DATASETS: DatasetName[] = [
  'criminal_courts',
  'offenders',
  'prisoners',
  'corrective_services',
];

export default function DatasetsScreen() {
  const router = useRouter();
  const [metadata, setMetadata] = useState<DatasetMetadata[]>([]);

  useEffect(() => {
    getDatasetMetadata().then(setMetadata).catch(() => {});
  }, []);

  const getMetaFor = (ds: DatasetName) =>
    metadata.find((m) => m.dataset === ds);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="titleMedium" style={styles.heading}>
        ABS Data Sources
      </Text>
      <Text variant="bodySmall" style={styles.subheading}>
        Australian Bureau of Statistics annual crime datasets
      </Text>

      {DATASETS.map((ds) => {
        const meta = getMetaFor(ds);
        const fields = DATASET_FILTER_FIELDS[ds];

        return (
          <Card
            key={ds}
            style={styles.card}
            mode="elevated"
            onPress={() =>
              router.push({
                pathname: '/(tabs)/reports',
                params: { dataset: ds },
              })
            }
          >
            <Card.Content>
              <Text variant="titleSmall" style={styles.cardTitle}>
                {DATASET_LABELS[ds]}
              </Text>
              <Text variant="bodySmall" style={styles.cardDesc}>
                {DATASET_DESCRIPTIONS[ds]}
              </Text>

              <Divider style={styles.divider} />

              <Text variant="labelSmall" style={styles.fieldsLabel}>
                Available fields:
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {fields.map((f) => (
                  <Chip key={f} compact mode="outlined" style={styles.fieldChip}>
                    {FILTER_LABELS[f]}
                  </Chip>
                ))}
              </ScrollView>

              {meta && (
                <Text variant="bodySmall" style={styles.metaText}>
                  {meta.recordCount} records | Last updated:{' '}
                  {meta.lastImport?.toDate?.().toLocaleDateString('en-AU') ?? 'N/A'}
                </Text>
              )}
            </Card.Content>
          </Card>
        );
      })}
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
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  cardTitle: {
    color: '#1B5E20',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardDesc: {
    color: '#555',
    lineHeight: 18,
  },
  divider: {
    marginVertical: 10,
  },
  fieldsLabel: {
    color: '#999',
    marginBottom: 6,
  },
  chipRow: {
    gap: 6,
    paddingBottom: 4,
  },
  fieldChip: {
    height: 28,
  },
  metaText: {
    color: '#999',
    marginTop: 8,
  },
});
