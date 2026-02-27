import { useMemo } from 'react';
import { DatasetRecord, ChartDataPoint, GroupByField } from '@/types';
import { aggregateByField, topN } from '@/utils/transforms';

export function useChartData(
  data: DatasetRecord[],
  groupBy: GroupByField,
  maxItems: number = 8
) {
  const chartData = useMemo(() => {
    if (data.length === 0) return [];
    const aggregated = aggregateByField(data, groupBy);
    return topN(aggregated, maxItems);
  }, [data, groupBy, maxItems]);

  const total = useMemo(
    () => chartData.reduce((sum, d) => sum + d.value, 0),
    [chartData]
  );

  return { chartData, total };
}
