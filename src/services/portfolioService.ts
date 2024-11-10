import {
  Portfolio,
  Transaction,
  MarketPrice,
  Account,
  Holding,
  PerformanceMetrics,
  AssetAllocation,
  GeographicExposure,
  ManagementFeeAnalysis,
  AccountType
} from '@/types';

export const calculatePortfolioValue = (
  holdings: Holding[],
  marketPrices: MarketPrice[]
): number => {
  console.log('Calculating portfolio value with:', {
    holdings: holdings.length,
    marketPrices: marketPrices.length
  });
  
  const value = holdings.reduce((total, holding) => {
    const currentPrice = marketPrices.find(price => price.code === holding.code)?.price || 0;
    return total + (holding.quantity * currentPrice);
  }, 0);

  console.log('Portfolio value calculated:', value);
  return value;
};

export const calculateAccountValue = (
  transactions: Transaction[],
  marketPrices: MarketPrice[],
  accountType: AccountType
): number => {
  console.log(`Calculating account value for ${accountType}`);
  const accountTransactions = transactions.filter(t => t.account === accountType);
  
  // Calculate holdings for the account
  const holdings = calculateHoldings(accountTransactions, marketPrices);
  
  // Sum up the current value of all holdings
  const balance = holdings.reduce((total, holding) => {
    const currentPrice = marketPrices.find(price => price.code === holding.code)?.price || 0;
    return total + (holding.quantity * currentPrice);
  }, 0);

  console.log(`Account ${accountType} value:`, balance);
  return balance;
};

export const calculateHoldings = (
  transactions: Transaction[],
  marketPrices: MarketPrice[]
): Holding[] => {
  console.log('Calculating holdings from transactions:', {
    transactions: transactions.length,
    marketPrices: marketPrices.length
  });

  const holdingsMap = new Map<string, Holding>();

  transactions.forEach(transaction => {
    if (transaction.type === 'BUY' || transaction.type === 'SELL') {
      const currentPrice = marketPrices.find(price => 
        transaction.description.includes(price.name)
      );

      if (!currentPrice) {
        console.log('No matching market price found for transaction:', transaction.description);
        return;
      }

      const code = currentPrice.code;
      const existingHolding = holdingsMap.get(code) || {
        code,
        name: transaction.description,
        quantity: 0,
        currentPrice: currentPrice.price,
        value: 0,
        costBasis: 0,
        performance: {
          totalReturn: 0,
          percentageReturn: 0,
          timeWeightedReturn: 0
        }
      };

      if (transaction.type === 'BUY') {
        existingHolding.quantity += transaction.quantity || 0;
        existingHolding.costBasis += transaction.amount;
      } else {
        existingHolding.quantity -= transaction.quantity || 0;
        existingHolding.costBasis -= transaction.amount;
      }

      existingHolding.value = existingHolding.quantity * currentPrice.price;
      
      if (existingHolding.costBasis !== 0) {
        existingHolding.performance.totalReturn = existingHolding.value - existingHolding.costBasis;
        existingHolding.performance.percentageReturn = 
          (existingHolding.performance.totalReturn / Math.abs(existingHolding.costBasis)) * 100;
      }

      holdingsMap.set(code, existingHolding);
    }
  });

  const holdings = Array.from(holdingsMap.values()).filter(holding => holding.quantity > 0);
  console.log('Calculated holdings:', holdings.length);
  return holdings;
};

export const calculatePerformanceMetrics = (
  transactions: Transaction[],
  marketPrices: MarketPrice[]
): PerformanceMetrics => {
  console.log('Calculating performance metrics');
  const holdings = calculateHoldings(transactions, marketPrices);
  const totalValue = calculatePortfolioValue(holdings, marketPrices);
  const totalCost = holdings.reduce((sum, holding) => sum + holding.costBasis, 0);
  
  const totalReturn = totalValue - totalCost;
  const percentageReturn = totalCost !== 0 ? (totalReturn / totalCost) * 100 : 0;

  console.log('Performance metrics:', { totalReturn, percentageReturn });
  return {
    totalReturn,
    percentageReturn,
    timeWeightedReturn: 0, // TODO: Implement time-weighted return calculation
  };
};

export const calculateManagementFees = (
  transactions: Transaction[],
  period: 'monthly' | 'yearly' = 'yearly'
): ManagementFeeAnalysis[] => {
  const feeTransactions = transactions.filter(t => t.type === 'FEE');
  const analysis: Record<string, number> = {};

  feeTransactions.forEach(transaction => {
    const date = transaction.date;
    const key = period === 'monthly' 
      ? `${date.getFullYear()}-${date.getMonth() + 1}`
      : `${date.getFullYear()}`;
    
    analysis[key] = (analysis[key] || 0) + Math.abs(transaction.amount);
  });

  return Object.entries(analysis).map(([period, amount]) => ({
    period,
    amount,
    percentage: 0, // TODO: Calculate as percentage of portfolio value
  }));
};

export const buildPortfolio = (
  transactions: Transaction[],
  marketPrices: MarketPrice[]
): Portfolio => {
  console.log('Building portfolio with:', {
    transactions: transactions.length,
    marketPrices: marketPrices.length
  });

  const holdings = calculateHoldings(transactions, marketPrices);
  const performance = calculatePerformanceMetrics(transactions, marketPrices);

  const accounts: Account[] = ['ISA', 'LISA'].map(type => ({
    type: type as AccountType,
    balance: calculateAccountValue(transactions, marketPrices, type as AccountType),
    transactions: transactions.filter(t => t.account === type),
    holdings: holdings.filter(h => {
      const holdingTransactions = transactions.filter(t => 
        t.description.includes(h.name) && t.account === type
      );
      return holdingTransactions.length > 0;
    })
  }));

  const portfolio = {
    totalValue: calculatePortfolioValue(holdings, marketPrices),
    accounts,
    holdings,
    transactions,
    performance,
  };

  console.log('Portfolio built:', {
    totalValue: portfolio.totalValue,
    accounts: accounts.map(a => ({ type: a.type, balance: a.balance })),
    holdings: holdings.length,
    performance
  });

  return portfolio;
};
