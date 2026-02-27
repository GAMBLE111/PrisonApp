import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import { ChartDataPoint } from '@/types';
import { truncate } from '@/utils/formatters';

interface LineChartViewProps {
  data: ChartDataPoint[];
  title?: string;
}

export default function LineChartView({ data, title }: LineChartViewProps) {
  if (data.length === 0) return null;

  const lineData = data.map((d) => ({
    value: d.value,
    label: truncate(d.label, 10),
    dataPointText: String(d.value),
  }));

  return (
    <View style={styles.container}>
      {title && (
        <Text variant="titleSmall" style={styles.title}>
          {title}
        </Text>
      )}
      <LineChart
        data={lineData}
        color="#1B5E20"
        dataPointsColor="#1B5E20"
        xAxisLabelTextStyle={styles.xLabel}
        yAxisTextStyle={styles.yLabel}
        noOfSections={5}
        isAnimated
        curved
        height={220}
        thickness={2}
        areaChart
        startFillColor="rgba(27, 94, 32, 0.2)"
        endFillColor="rgba(27, 94, 32, 0.01)"
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
  xLabel: {
    fontSize: 9,
    color: '#666',
  },
  yLabel: {
    fontSize: 10,
    color: '#666',
  },
});
