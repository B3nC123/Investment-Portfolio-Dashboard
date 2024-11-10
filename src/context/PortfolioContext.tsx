import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Portfolio, MarketPrice, Transaction } from '@/types';
import { buildPortfolio } from '@/services/portfolioService';

interface PortfolioState {
  portfolio: Portfolio | null;
  marketPrices: MarketPrice[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

type PortfolioAction =
  | { type: 'SET_MARKET_PRICES'; payload: MarketPrice[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'BUILD_PORTFOLIO' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET_ERROR' };

const initialState: PortfolioState = {
  portfolio: null,
  marketPrices: [],
  transactions: [],
  isLoading: false,
  error: null,
};

const portfolioReducer = (state: PortfolioState, action: PortfolioAction): PortfolioState => {
  console.log('Portfolio Reducer:', { type: action.type, state, action });

  switch (action.type) {
    case 'SET_MARKET_PRICES':
      console.log('Setting market prices:', action.payload.length);
      return {
        ...state,
        marketPrices: action.payload,
        isLoading: false,
      };

    case 'SET_TRANSACTIONS':
      console.log('Setting transactions:', action.payload.length);
      return {
        ...state,
        transactions: action.payload,
        isLoading: false,
      };

    case 'BUILD_PORTFOLIO':
      console.log('Building portfolio with:', {
        marketPrices: state.marketPrices.length,
        transactions: state.transactions.length
      });

      if (state.marketPrices.length === 0 || state.transactions.length === 0) {
        console.warn('Cannot build portfolio: missing data');
        return {
          ...state,
          error: 'Please upload both market prices and transactions data to build portfolio.',
        };
      }

      try {
        const portfolio = buildPortfolio(state.transactions, state.marketPrices);
        console.log('Portfolio built successfully:', {
          totalValue: portfolio.totalValue,
          holdings: portfolio.holdings.length,
          accounts: portfolio.accounts.map(a => ({ type: a.type, balance: a.balance }))
        });

        return {
          ...state,
          portfolio,
          error: null,
        };
      } catch (error) {
        console.error('Error building portfolio:', error);
        return {
          ...state,
          error: 'Error building portfolio. Please check your data and try again.',
        };
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      console.error('Portfolio Error:', action.payload);
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'RESET_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

const PortfolioContext = createContext<{
  state: PortfolioState;
  dispatch: React.Dispatch<PortfolioAction>;
} | null>(null);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  return (
    <PortfolioContext.Provider value={{ state, dispatch }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
