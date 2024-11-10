export type TransactionType = 
  | 'BUY' 
  | 'SELL' 
  | 'DIVIDEND' 
  | 'FEE' 
  | 'DEPOSIT' 
  | 'WITHDRAWAL'
  | 'INTEREST';

export type AccountType = 'ISA' | 'LISA';

export interface Transaction {
  date: Date;
  type: TransactionType;
  description: string;
  amount: number;
  account: AccountType;
  symbol?: string;
  quantity?: number;
  unitPrice?: number;
}

export interface MarketPrice {
  date: Date;
  symbol: string;
  code: string;
  name: string;
  price: number;
  currency: string;
}

export interface Performance {
  day: number;
  week: number;
  month: number;
  year: number;
  total: number;
  totalReturn: number;
  percentageReturn: number;
}

export interface Holding {
  symbol: string;
  code: string;
  name: string;
  quantity: number;
  averageCost: number;
  totalCost: number;
  currentPrice: number;
  value: number;
  costBasis: number;
  performance: Performance;
}

export interface Account {
  type: AccountType;
  balance: number;
  holdings: string[];
  transactions: Transaction[];
  performance?: Performance;
}

export interface Portfolio {
  holdings: Holding[];
  accounts: Account[];
  totalValue: number;
  transactions: Transaction[];
  lastUpdated: Date;
  performance: Performance;
}

export interface PortfolioState {
  portfolio: Portfolio | null;
  marketPrices: MarketPrice[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export interface CSVRow {
  [key: string]: string;
}

export interface MarketPriceCSV {
  code: string;
  name: string;
  price: number;
  date: Date;
  currency: string;
}

export const createDefaultPerformance = (): Performance => ({
  day: 0,
  week: 0,
  month: 0,
  year: 0,
  total: 0,
  totalReturn: 0,
  percentageReturn: 0
});
