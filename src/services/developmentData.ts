import { processMarketPrices, processTransactions, parseCSVContent } from './csvService';
import { MarketPrice, Transaction } from '../types';

export const loadDevelopmentData = async (): Promise<{ marketPrices: MarketPrice[], transactions: Transaction[] }> => {
  try {
    console.log('Loading development data...');

    // Load market prices
    const marketPricesResponse = await fetch('/example-data/market-prices.csv');
    const marketPricesText = await marketPricesResponse.text();
    const marketPricesRows = parseCSVContent(marketPricesText);
    const marketPrices = processMarketPrices(marketPricesRows);

    // Load transactions
    const transactionsResponse = await fetch('/example-data/transactions.csv');
    const transactionsText = await transactionsResponse.text();
    const transactionsRows = parseCSVContent(transactionsText);
    const transactions = processTransactions(transactionsRows);

    console.log('Development data loaded:', {
      marketPrices: marketPrices.length,
      transactions: transactions.length
    });

    return { marketPrices, transactions };
  } catch (error) {
    console.error('Error loading development data:', error);
    throw error;
  }
};
