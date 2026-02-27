import { useState, useEffect, useCallback } from 'react';
import { queryDataset } from '@/services/firestore';
import { Filters, DatasetRecord, QueryState } from '@/types';

export function useFirestoreQuery(filters: Filters): QueryState<DatasetRecord> & { refetch: () => void } {
  const [state, setState] = useState<QueryState<DatasetRecord>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const results = await queryDataset(filters);
      setState({ data: results, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data';
      setState({ data: [], loading: false, error: message });
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}
