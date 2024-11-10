import { Transaction, MarketPrice, CSVRow, TransactionType } from '../types';

export const parseCSVContent = (content: string): CSVRow[] => {
  const lines = content.split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1)
    .filter(line => line.trim().length > 0)
    .map(line => {
      const values = line.split(',').map(v => v.trim());
      return headers.reduce((obj: CSVRow, header, index) => {
        obj[header] = values[index] || '';
        return obj;
      }, {});
    });
};

export const validateCSVFormat = (headers: string[], requiredColumns: string[]): boolean => {
  return requiredColumns.every(col => headers.includes(col));
};

const parseUKDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day); // month is 0-based in JS Date
};

const cleanNumberString = (value: string): string => {
  return value.replace(/[£,\s]/g, '');
};

const mapTransactionType = (type: string, category: string): TransactionType => {
  const typeMap: { [key: string]: TransactionType } = {
    'Purchase': 'BUY',
    'Sale': 'SELL',
    'Dividend': 'DIVIDEND',
    'Interest': 'INTEREST',
    'Management Fee': 'FEE',
    'Deposit': 'DEPOSIT',
    'Withdrawal': 'WITHDRAWAL',
    'BUY': 'BUY',
    'SELL': 'SELL',
    'DIVIDEND': 'DIVIDEND',
    'FEE': 'FEE',
    'DEPOSIT': 'DEPOSIT',
    'WITHDRAWAL': 'WITHDRAWAL',
    'REG. SAVER': 'DEPOSIT',
    'CARD WEB': 'DEPOSIT',
    'MANAGE FEE': 'FEE',
    'Gvrmt Bonus': 'DEPOSIT',
    'Transfer': 'DEPOSIT',
    'Loyalty': 'DIVIDEND',
    'Income': 'DIVIDEND',
    'LOYALTYU': 'DIVIDEND',
    'DRIB': 'DIVIDEND',
    'URIB': 'DIVIDEND'
  };

  // First try to map based on the type
  let mappedType = typeMap[type];
  
  // If not found, try to map based on the category
  if (!mappedType && category) {
    mappedType = typeMap[category];
  }

  if (!mappedType) {
    console.warn(`Unknown transaction type: ${type} (category: ${category}), defaulting to FEE`);
    return 'FEE';
  }
  return mappedType;
};

const fundCodeMap: { [key: string]: string } = {
  'Vanguard Japan Stock Index': 'B50MZ94',
  'Vanguard ESG Developed World All Cap Equity': 'B76VTN1',
  'Legal & General Future World ESG Developed': 'BMFXWS9',
  'Lindsell Train Global Equity': 'B644PG0',
  'Rathbone Global Opportunities': 'BH0P2M9',
  'Vanguard Global Small-Cap Index': 'B3X1NT0',
  'AXA Global Sustainable Distribution': '0830906',
  'Baillie Gifford European': '0605825',
  'Jupiter UK Mid Cap': 'B1XG948',
  'UBS US Growth': 'B7VHZX6',
  'Rivian': 'RIVN',
  'IonQ': 'IONQ'
};

const extractSymbolFromDescription = (description: string): string => {
  // For stock symbols that are already in the correct format (e.g., RIVN, IONQ)
  const stockMatch = description.match(/^([A-Z]+)\s+Inc/);
  if (stockMatch) {
    return stockMatch[1];
  }

  // For fund names, try to match with the fundCodeMap
  for (const [fundName, code] of Object.entries(fundCodeMap)) {
    if (description.includes(fundName)) {
      return code;
    }
  }

  // If no match found, return empty string (will be converted to undefined later)
  return '';
};

export const processTransactions = (rows: CSVRow[]): Transaction[] => {
  return rows.map(row => {
    const type = mapTransactionType(row['Type'] || '', row['Transaction Category'] || '');
    const description = row['Description'] || '';
    let symbol = row['Symbol'] || row['Code'] || '';
    
    // For buy/sell transactions, try to extract symbol from description if not provided
    if ((!symbol || symbol.trim() === '') && (type === 'BUY' || type === 'SELL')) {
      symbol = extractSymbolFromDescription(description);
    }

    // Parse amount, handling negative values properly
    let amount = parseFloat(cleanNumberString(row['Amount'] || row['Purchase Value (£)'] || '0'));
    
    // Ensure fees and sells are negative
    if (type === 'FEE' || type === 'SELL') {
      amount = -Math.abs(amount);
    }
    
    // Ensure deposits and dividends are positive
    if (type === 'DEPOSIT' || type === 'DIVIDEND' || type === 'INTEREST') {
      amount = Math.abs(amount);
    }

    return {
      date: parseUKDate(row['Date'] || row['Trade date']),
      type,
      description,
      amount,
      account: row['Account'] as Transaction['account'],
      symbol: symbol || undefined,
      quantity: row['Quantity'] ? parseFloat(cleanNumberString(row['Quantity'])) : undefined,
      unitPrice: row['Unit cost (£)'] ? parseFloat(cleanNumberString(row['Unit cost (£)'])) : undefined
    };
  });
};

export const processMarketPrices = (rows: CSVRow[]): MarketPrice[] => {
  return rows.map(row => ({
    date: new Date(), // Current date since market prices are current
    symbol: row['Code'],
    code: row['Code'],
    name: row['Stock'],
    price: parseFloat(cleanNumberString(row['Price (pence)'])) / 100, // Convert pence to pounds
    currency: 'GBP'
  }));
};

// Alias for backward compatibility
export const parseTransactions = processTransactions;
export const parseMarketPrices = processMarketPrices;

export const parseCSVFile = async (file: File): Promise<CSVRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const rows = parseCSVContent(content);
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

export const readCSVFile = parseCSVFile; // Alias for backward compatibility
