import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { formatNumber } from '@/utils/formatters';

interface DashboardCardProps {
  title: string;
  value: number | null;
  subtitle?: string;
  loading?: boolean;
  onPress?: () => void;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  loading,
  onPress,
}: DashboardCardProps) {
  return (
    <Card style={styles.card} onPress={onPress} mode="elevated">
      <Card.Content>
        <Text variant="labelMedium" style={styles.title}>
          {title}
        </Text>
        <Text variant="headlineMedium" style={styles.value}>
          {loading ? '...' : value !== null ? formatNumber(value) : '—'}
        </Text>
        {subtitle && (
          <Text variant="bodySmall" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 4,
    flex: 1,
    minWidth: 150,
  },
  title: {
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  subtitle: {
    color: '#999',
    marginTop: 4,
  },
});
