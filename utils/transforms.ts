import { DatasetRecord, ChartDataPoint, GroupByField } from '@/types';
import { CHART_COLORS } from '@/constants/Colors';

/**
 * Aggregate records by a groupBy field, summing the count.
 */
export function aggregateByField(
  data: DatasetRecord[],
  groupBy: GroupByField
): ChartDataPoint[] {
  const map = new Map<string, number>();

  for (const record of data) {
    const key = (record as unknown as Record<string, unknown>)[groupBy] as string;
    if (!key) continue;
    map.set(key, (map.get(key) || 0) + (record.count || 0));
  }

  return Array.from(map.entries())
    .map(([label, value], i) => ({
      label,
      value,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Get top N data points, grouping the rest as "Other".
 */
export function topN(data: ChartDataPoint[], n: number = 8): ChartDataPoint[] {
  if (data.length <= n) return data;
  const top = data.slice(0, n);
  const rest = data.slice(n);
  const otherValue = rest.reduce((sum, d) => sum + d.value, 0);
  if (otherValue > 0) {
    top.push({ label: 'Other', value: otherValue, color: '#9E9E9E' });
  }
  return top;
}
