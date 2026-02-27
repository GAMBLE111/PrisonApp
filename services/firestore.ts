import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import { DatasetName, Filters, DatasetRecord, DatasetMetadata } from '@/types';

/**
 * Build Firestore query from filters and execute it.
 */
export async function queryDataset(filters: Filters): Promise<DatasetRecord[]> {
  const constraints: QueryConstraint[] = [];

  const filterFields = [
    'state', 'year', 'sex', 'ageGroup', 'offenceCategory',
    'courtLevel', 'sentenceType', 'indigenousStatus', 'legalStatus',
    'quarter', 'sentenceLength', 'orderType',
  ] as const;

  for (const field of filterFields) {
    const value = filters[field as keyof Filters];
    if (value && value !== 'All') {
      constraints.push(where(field, '==', value));
    }
  }

  const colRef = collection(db, filters.dataset);
  const q = query(colRef, ...constraints, limit(500));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DatasetRecord[];
}

/**
 * Get summary count for a dataset with optional filters.
 */
export async function getDatasetCount(
  dataset: DatasetName,
  additionalFilters?: Partial<Filters>
): Promise<number> {
  const constraints: QueryConstraint[] = [];

  if (additionalFilters) {
    for (const [key, value] of Object.entries(additionalFilters)) {
      if (value && key !== 'dataset') {
        constraints.push(where(key, '==', value));
      }
    }
  }

  const colRef = collection(db, dataset);
  const q = query(colRef, ...constraints, limit(1000));
  const snapshot = await getDocs(q);

  return snapshot.docs.reduce((sum, doc) => {
    const data = doc.data();
    return sum + (data.count || 0);
  }, 0);
}

/**
 * Get metadata for all datasets.
 */
export async function getDatasetMetadata(): Promise<DatasetMetadata[]> {
  const colRef = collection(db, 'metadata');
  const snapshot = await getDocs(query(colRef));
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
  })) as DatasetMetadata[];
}

/**
 * Get distinct values for a field in a dataset (client-side).
 */
export async function getDistinctValues(
  dataset: DatasetName,
  field: string
): Promise<string[]> {
  const colRef = collection(db, dataset);
  const snapshot = await getDocs(query(colRef, limit(500)));
  const values = new Set<string>();
  snapshot.docs.forEach((doc) => {
    const val = doc.data()[field];
    if (val) values.add(val);
  });
  return Array.from(values).sort();
}
