import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';
import { ChartDataPoint } from '@/types';
import { formatNumber } from '@/utils/formatters';

interface PieChartViewProps {
  data: ChartDataPoint[];
  title?: string;
}

export default function PieChartView({ data, title }: PieChartViewProps) {
  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const pieData = data.map((d) => ({
    value: d.value,
    color: d.color || '#1B5E20',
    text: `${((d.value / total) * 100).toFixed(1)}%`,
    textColor: '#fff',
    textSize: 10,
  }));

  return (
    <View style={styles.container}>
      {title && (
        <Text variant="titleSmall" style={styles.title}>
          {title}
        </Text>
      )}
      <View style={styles.chartRow}>
        <PieChart
          data={pieData}
          donut
          radius={100}
          innerRadius={55}
          innerCircleColor="#fff"
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text variant="titleMedium" style={styles.centerValue}>
                {formatNumber(total)}
              </Text>
              <Text variant="bodySmall" style={styles.centerSubtitle}>
                Total
              </Text>
            </View>
          )}
        />
        <View style={styles.legend}>
          {data.map((d) => (
            <View key={d.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: d.color }]} />
              <Text variant="bodySmall" style={styles.legendText} numberOfLines={1}>
                {d.label}
              </Text>
              <Text variant="bodySmall" style={styles.legendValue}>
                {formatNumber(d.value)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerValue: {
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  centerSubtitle: {
    color: '#999',
  },
  legend: {
    flex: 1,
    maxWidth: 180,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    flex: 1,
    color: '#333',
  },
  legendValue: {
    color: '#666',
    marginLeft: 4,
  },
});
