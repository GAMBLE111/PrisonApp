import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { ChartDataPoint } from '@/types';
import { formatNumber, truncate } from '@/utils/formatters';

interface BarChartViewProps {
  data: ChartDataPoint[];
  title?: string;
}

export default function BarChartView({ data, title }: BarChartViewProps) {
  if (data.length === 0) return null;

  const barData = data.map((d) => ({
    value: d.value,
    label: truncate(d.label, 10),
    frontColor: d.color || '#1B5E20',
    topLabelComponent: () => (
      <Text style={styles.topLabel}>{formatNumber(d.value)}</Text>
    ),
  }));

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <View style={styles.container}>
      {title && (
        <Text variant="titleSmall" style={styles.title}>
          {title}
        </Text>
      )}
      <BarChart
        data={barData}
        barWidth={32}
        spacing={20}
        xAxisLabelTextStyle={styles.xLabel}
        yAxisTextStyle={styles.yLabel}
        noOfSections={5}
        maxValue={maxValue * 1.15}
        isAnimated
        barBorderRadius={4}
        height={220}
      />
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
  topLabel: {
    fontSize: 9,
    color: '#333',
    marginBottom: 4,
  },
  xLabel: {
    fontSize: 9,
    color: '#666',
  },
  yLabel: {
    fontSize: 10,
    color: '#666',
  },
});
