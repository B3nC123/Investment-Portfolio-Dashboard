import Papa from 'papaparse';
import { format, parse } from 'date-fns';
import { MarketPrice, Transaction, TransactionType, AccountType } from '@/types';

interface RawMarketPrice {
  Code: string;
  Stock: string;
  'Price (pence)': string;
}

interface RawTransaction {
  'Trade date': string;
  'Settle date': string;
  Reference: string;
  'Transaction Category': string;
  Direction: string;
  Description: string;
  Quantity: string;
  'Unit cost (£)': string;
  'Purchase Value (£)': string;
  Account: string;
}

export const parseCSVFile = (file: File): Promise<Papa.ParseResult<any>> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results),
      error: (error) => reject(error),
    });
  });
};

const cleanNumberString = (value: string): number => {
  return parseFloat(value.replace(/[£,\s]/g, ''));
};

const parseDate = (dateStr: string): Date => {
  // Handle DD/MM/YYYY format
  const [day, month, year] = dateStr.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

export const processMarketPrices = async (file: File): Promise<MarketPrice[]> => {
  const results = await parseCSVFile(file);
  return (results.data as RawMarketPrice[]).map((row) => ({
    code: row.Code,
    name: row.Stock,
    price: cleanNumberString(row['Price (pence)']) / 100, // Convert pence to pounds
    date: new Date(), // Current price is assumed to be today's price
  }));
};

const mapTransactionType = (category: string, direction: string): TransactionType => {
  switch (category.toLowerCase()) {
    case 'purchase':
      return 'BUY';
    case 'sale':
      return 'SELL';
    case 'management fee':
      return 'FEE';
    case 'deposit':
      return 'DEPOSIT';
    case 'interest':
      return 'DIVIDEND';
    default:
      return 'DEPOSIT';
  }
};

export const processTransactions = async (file: File): Promise<Transaction[]> => {
  const results = await parseCSVFile(file);
  return (results.data as RawTransaction[]).map((row) => ({
    date: parseDate(row['Trade date']),
    type: mapTransactionType(row['Transaction Category'], row.Direction),
    description: row.Description,
    amount: cleanNumberString(row['Purchase Value (£)']),
    quantity: row.Quantity ? parseFloat(row.Quantity) : undefined,
    unitPrice: row['Unit cost (£)'] ? cleanNumberString(row['Unit cost (£)']) : undefined,
    account: row.Account as AccountType,
    reference: row.Reference,
    settleDate: parseDate(row['Settle date']),
  }));
};

export const validateCSVFormat = (headers: string[], fileType: 'marketPrices' | 'transactions'): boolean => {
  const expectedHeaders = {
    marketPrices: ['Code', 'Stock', 'Price (pence)'],
    transactions: [
      'Trade date',
      'Settle date',
      'Reference',
      'Transaction Category',
      'Direction',
      'Description',
      'Quantity',
      'Unit cost (£)',
      'Purchase Value (£)',
      'Account'
    ]
  };

  const required = expectedHeaders[fileType];
  return required.every(header => headers.includes(header));
};

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy');
};
