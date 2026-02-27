import { DatasetName, GroupByField } from '@/types';

export const STATES = [
  'NSW',
  'Vic',
  'Qld',
  'SA',
  'WA',
  'Tas',
  'NT',
  'ACT',
  'Australia',
] as const;

export const YEARS = [
  '2023-24',
  '2022-23',
  '2021-22',
  '2020-21',
  '2019-20',
  '2018-19',
  '2017-18',
] as const;

export const SEX_OPTIONS = ['Male', 'Female', 'Total'] as const;

export const AGE_GROUPS = [
  '10-14',
  '15-17',
  '18-19',
  '20-24',
  '25-29',
  '30-34',
  '35-39',
  '40-44',
  '45-49',
  '50-54',
  '55-59',
  '60-64',
  '65+',
  'Total',
] as const;

export const OFFENCE_CATEGORIES = [
  'Homicide',
  'Assault',
  'Sexual assault',
  'Robbery',
  'Unlawful entry with intent',
  'Theft',
  'Fraud',
  'Illicit drug offences',
  'Weapons offences',
  'Property damage',
  'Public order offences',
  'Traffic offences',
  'Other offences',
  'Total',
] as const;

export const COURT_LEVELS = [
  'Magistrates',
  'Higher courts',
  'Total',
] as const;

export const SENTENCE_TYPES = [
  'Imprisonment',
  'Community supervision',
  'Fine',
  'Good behaviour bond',
  'Other',
  'Total',
] as const;

export const INDIGENOUS_STATUS = [
  'Aboriginal and Torres Strait Islander',
  'Non-Indigenous',
  'Unknown',
  'Total',
] as const;

export const LEGAL_STATUS = [
  'Sentenced',
  'Unsentenced',
  'Total',
] as const;

export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

export const SENTENCE_LENGTHS = [
  'Less than 1 year',
  '1 to less than 2 years',
  '2 to less than 5 years',
  '5 to less than 10 years',
  '10 years or more',
  'Life',
  'Total',
] as const;

export const ORDER_TYPES = [
  'Custody',
  'Community-based corrections',
  'Total',
] as const;

// Fields available per dataset for groupBy
export const DATASET_GROUP_BY_FIELDS: Record<DatasetName, GroupByField[]> = {
  criminal_courts: ['state', 'year', 'sex', 'ageGroup', 'offenceCategory', 'courtLevel', 'sentenceType'],
  offenders: ['state', 'year', 'sex', 'ageGroup', 'offenceCategory', 'indigenousStatus'],
  prisoners: ['state', 'year', 'sex', 'ageGroup', 'offenceCategory', 'indigenousStatus', 'legalStatus'],
  corrective_services: ['state', 'year', 'sex', 'indigenousStatus', 'legalStatus', 'quarter'],
};

// Filter options per dataset
export const DATASET_FILTER_FIELDS: Record<DatasetName, string[]> = {
  criminal_courts: ['state', 'year', 'sex', 'ageGroup', 'offenceCategory', 'courtLevel', 'sentenceType'],
  offenders: ['state', 'year', 'sex', 'ageGroup', 'offenceCategory', 'indigenousStatus'],
  prisoners: ['state', 'year', 'sex', 'ageGroup', 'offenceCategory', 'sentenceLength', 'indigenousStatus', 'legalStatus'],
  corrective_services: ['state', 'year', 'quarter', 'sex', 'indigenousStatus', 'legalStatus', 'orderType'],
};

export const FILTER_OPTIONS: Record<string, readonly string[]> = {
  state: STATES,
  year: YEARS,
  sex: SEX_OPTIONS,
  ageGroup: AGE_GROUPS,
  offenceCategory: OFFENCE_CATEGORIES,
  courtLevel: COURT_LEVELS,
  sentenceType: SENTENCE_TYPES,
  indigenousStatus: INDIGENOUS_STATUS,
  legalStatus: LEGAL_STATUS,
  quarter: QUARTERS,
  sentenceLength: SENTENCE_LENGTHS,
  orderType: ORDER_TYPES,
};

export const FILTER_LABELS: Record<string, string> = {
  state: 'State',
  year: 'Year',
  sex: 'Sex',
  ageGroup: 'Age Group',
  offenceCategory: 'Offence',
  courtLevel: 'Court Level',
  sentenceType: 'Sentence Type',
  indigenousStatus: 'Indigenous Status',
  legalStatus: 'Legal Status',
  quarter: 'Quarter',
  sentenceLength: 'Sentence Length',
  orderType: 'Order Type',
};
