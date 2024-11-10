import { Transaction, MarketPrice, Portfolio, Holding, Account, createDefaultPerformance } from '../types';

const calculateHoldingValue = (holding: Holding, marketPrices: MarketPrice[]): number => {
  const latestPrice = marketPrices.find(p => p.symbol === holding.symbol);
  return latestPrice ? holding.quantity * latestPrice.price : 0;
};

const findMarketPrice = (transaction: Transaction, marketPrices: MarketPrice[]): MarketPrice | undefined => {
  // Only look for market prices for BUY and SELL transactions
  if (!['BUY', 'SELL'].includes(transaction.type)) {
    return undefined;
  }
  
  return marketPrices.find(p => p.symbol === transaction.symbol);
};

export const buildPortfolio = (transactions: Transaction[], marketPrices: MarketPrice[]): Portfolio => {
  const holdings: { [key: string]: Holding } = {};
  const accounts: { [key: string]: Account } = {};

  // Process transactions in chronological order
  const sortedTransactions = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());

  sortedTransactions.forEach(transaction => {
    // Initialize account if it doesn't exist
    if (!accounts[transaction.account]) {
      accounts[transaction.account] = {
        type: transaction.account,
        balance: 0,
        holdings: [],
        transactions: [],
        performance: createDefaultPerformance()
      };
    }

    // Add transaction to account
    accounts[transaction.account].transactions.push(transaction);

    // Update account balance
    accounts[transaction.account].balance += transaction.amount;

    // Handle different transaction types
    switch (transaction.type) {
      case 'BUY':
        if (!transaction.symbol) {
          console.warn('Buy transaction missing symbol:', transaction);
          break;
        }
        
        const buyPrice = findMarketPrice(transaction, marketPrices);
        if (!buyPrice) {
          console.warn('No matching market price found for transaction:', transaction);
        }

        if (!holdings[transaction.symbol]) {
          holdings[transaction.symbol] = {
            symbol: transaction.symbol,
            code: buyPrice?.code || transaction.symbol,
            name: buyPrice?.name || transaction.description,
            quantity: 0,
            averageCost: 0,
            totalCost: 0,
            currentPrice: buyPrice?.price || 0,
            value: 0,
            costBasis: 0,
            performance: createDefaultPerformance()
          };
        }

        holdings[transaction.symbol].quantity += transaction.quantity || 0;
        holdings[transaction.symbol].totalCost += Math.abs(transaction.amount);
        holdings[transaction.symbol].averageCost = holdings[transaction.symbol].totalCost / holdings[transaction.symbol].quantity;
        holdings[transaction.symbol].costBasis = holdings[transaction.symbol].totalCost;

        // Update current price and value
        if (buyPrice) {
          holdings[transaction.symbol].currentPrice = buyPrice.price;
          holdings[transaction.symbol].value = holdings[transaction.symbol].quantity * buyPrice.price;
        }

        // Add holding to account if not already present
        if (!accounts[transaction.account].holdings.includes(transaction.symbol)) {
          accounts[transaction.account].holdings.push(transaction.symbol);
        }
        break;

      case 'SELL':
        if (!transaction.symbol) {
          console.warn('Sell transaction missing symbol:', transaction);
          break;
        }

        const sellPrice = findMarketPrice(transaction, marketPrices);
        if (!sellPrice) {
          console.warn('No matching market price found for transaction:', transaction);
        }

        if (holdings[transaction.symbol]) {
          holdings[transaction.symbol].quantity -= transaction.quantity || 0;
          // Remove holding if quantity is 0 or negative
          if (holdings[transaction.symbol].quantity <= 0) {
            delete holdings[transaction.symbol];
            accounts[transaction.account].holdings = accounts[transaction.account].holdings.filter(h => h !== transaction.symbol);
          } else {
            // Update current price and value
            if (sellPrice) {
              holdings[transaction.symbol].currentPrice = sellPrice.price;
              holdings[transaction.symbol].value = holdings[transaction.symbol].quantity * sellPrice.price;
            }
          }
        }
        break;

      case 'DIVIDEND':
      case 'INTEREST':
      case 'FEE':
      case 'DEPOSIT':
      case 'WITHDRAWAL':
        // These transactions only affect account balance, which is already handled
        break;

      default:
        console.warn('Unknown transaction type:', transaction.type);
    }
  });

  // Calculate total portfolio value and performance
  const holdingsArray = Object.values(holdings);
  const totalValue = holdingsArray.reduce((total, holding) => {
    return total + (holding.value || 0);
  }, 0);

  // Calculate portfolio performance
  const initialValue = sortedTransactions
    .filter(t => t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReturn = totalValue - initialValue;
  const percentageReturn = initialValue > 0 ? (totalReturn / initialValue) * 100 : 0;

  return {
    holdings: holdingsArray,
    accounts: Object.values(accounts),
    totalValue,
    transactions: sortedTransactions,
    lastUpdated: new Date(),
    performance: {
      day: 0, // TODO: Calculate daily performance
      week: 0, // TODO: Calculate weekly performance
      month: 0, // TODO: Calculate monthly performance
      year: 0, // TODO: Calculate yearly performance
      total: totalValue,
      totalReturn,
      percentageReturn
    }
  };
};
