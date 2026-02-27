import { Timestamp } from 'firebase/firestore';

// ── Dataset Types ──

export interface CriminalCourtRecord {
  id?: string;
  state: string;
  year: string;
  courtLevel: string;
  offenceCategory: string;
  sex: string;
  ageGroup: string;
  sentenceType: string;
  count: number;
  updatedAt: Timestamp;
}

export interface OffenderRecord {
  id?: string;
  state: string;
  year: string;
  offenceCategory: string;
  sex: string;
  ageGroup: string;
  indigenousStatus: string;
  count: number;
  updatedAt: Timestamp;
}

export interface PrisonerRecord {
  id?: string;
  state: string;
  year: string;
  offenceCategory: string;
  sex: string;
  ageGroup: string;
  sentenceLength: string;
  legalStatus: string;
  indigenousStatus: string;
  count: number;
  updatedAt: Timestamp;
}

export interface CorrectiveServicesRecord {
  id?: string;
  state: string;
  year: string;
  quarter: string;
  legalStatus: string;
  sex: string;
  indigenousStatus: string;
  orderType: string;
  count: number;
  updatedAt: Timestamp;
}

export type DatasetRecord =
  | CriminalCourtRecord
  | OffenderRecord
  | PrisonerRecord
  | CorrectiveServicesRecord;

// ── Dataset Names ──

export type DatasetName =
  | 'criminal_courts'
  | 'offenders'
  | 'prisoners'
  | 'corrective_services';

export const DATASET_LABELS: Record<DatasetName, string> = {
  criminal_courts: 'Criminal Courts',
  offenders: 'Recorded Crime - Offenders',
  prisoners: 'Prisoners in Australia',
  corrective_services: 'Corrective Services',
};

// ── Filter Types ──

export interface Filters {
  dataset: DatasetName;
  state?: string;
  year?: string;
  sex?: string;
  ageGroup?: string;
  offenceCategory?: string;
  // Dataset-specific
  courtLevel?: string;
  sentenceType?: string;
  indigenousStatus?: string;
  legalStatus?: string;
  quarter?: string;
  sentenceLength?: string;
  orderType?: string;
}

// ── Chart Types ──

export type ChartType = 'bar' | 'line' | 'pie';

export type GroupByField =
  | 'state'
  | 'year'
  | 'sex'
  | 'ageGroup'
  | 'offenceCategory'
  | 'courtLevel'
  | 'sentenceType'
  | 'indigenousStatus'
  | 'legalStatus'
  | 'quarter';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

// ── Metadata ──

export interface DatasetMetadata {
  dataset: DatasetName;
  lastImport: Timestamp;
  recordCount: number;
  source: string;
}

// ── Query ──

export interface QueryState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}
