import { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Portfolio, MarketPrice, Transaction } from '../types';
import { buildPortfolio } from '../services/portfolioService';
import { loadDevelopmentData } from '../services/developmentData';

export interface PortfolioState {
  portfolio: Portfolio | null;
  marketPrices: MarketPrice[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export type PortfolioAction =
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
  isLoading: true,
  error: null,
};

function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
  switch (action.type) {
    case 'SET_MARKET_PRICES':
      console.log('Setting market prices:', action.payload.length);
      return {
        ...state,
        marketPrices: action.payload,
      };

    case 'SET_TRANSACTIONS':
      console.log('Setting transactions:', action.payload.length);
      return {
        ...state,
        transactions: action.payload,
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
          isLoading: false,
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
          isLoading: false,
        };
      } catch (error) {
        console.error('Error building portfolio:', error);
        return {
          ...state,
          error: 'Error building portfolio. Please check your data and try again.',
          isLoading: false,
        };
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? null : state.error, // Clear error only when starting to load
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
}

export type PortfolioContextType = {
  state: PortfolioState;
  dispatch: React.Dispatch<PortfolioAction>;
};

export const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        console.log('Loading development data...');
        
        const { marketPrices, transactions } = await loadDevelopmentData();
        console.log('Development data loaded:', { 
          marketPrices: marketPrices.length, 
          transactions: transactions.length 
        });
        
        dispatch({ type: 'SET_MARKET_PRICES', payload: marketPrices });
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
        dispatch({ type: 'BUILD_PORTFOLIO' });
      } catch (error) {
        console.error('Error loading development data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Error loading development data' });
      }
    };

    loadData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ state, dispatch }}>
      {children}
    </PortfolioContext.Provider>
  );
}
