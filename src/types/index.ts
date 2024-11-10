export type AccountType = 'ISA' | 'LISA';

export interface Portfolio {
  totalValue: number;
  accounts: Account[];
  holdings: Holding[];
  transactions: Transaction[];
  performance: PerformanceMetrics;
}

export interface Account {
  type: AccountType;
  balance: number;
  transactions: Transaction[];
  holdings: Holding[];
}

export interface Holding {
  code: string;
  name: string;
  quantity: number;
  currentPrice: number;
  value: number;
  costBasis: number;
  performance: PerformanceMetrics;
}

export interface MarketPrice {
  code: string;
  name: string;
  price: number;
  date: Date;
}

export type TransactionType = 
  | 'BUY'
  | 'SELL'
  | 'DIVIDEND'
  | 'FEE'
  | 'DEPOSIT'
  | 'WITHDRAWAL';

export interface Transaction {
  date: Date;
  settleDate: Date;
  reference: string;
  type: TransactionType;
  description: string;
  amount: number;
  quantity?: number;
  unitPrice?: number;
  account: AccountType;
}

export interface PerformanceMetrics {
  totalReturn: number;
  percentageReturn: number;
  timeWeightedReturn: number;
}

export interface CSVData {
  marketPrices: MarketPrice[];
  transactions: Transaction[];
}

// Portfolio Analysis Types
export interface AssetAllocation {
  type: string;
  value: number;
  percentage: number;
}

export interface GeographicExposure {
  region: string;
  value: number;
  percentage: number;
}

export interface InvestmentStyle {
  style: 'ESG' | 'Growth' | 'Value';
  value: number;
  percentage: number;
}

export interface TransactionPattern {
  period: string;
  count: number;
  totalValue: number;
  averageValue: number;
}

export interface RegularSaverAnalysis {
  frequency: 'Monthly' | 'Quarterly' | 'Yearly';
  amount: number;
  startDate: Date;
  consistency: number; // Percentage of target met
}

export interface ManagementFeeAnalysis {
  period: string;
  amount: number;
  percentage: number;
}
