import { useContext } from 'react';
import { PortfolioContext, PortfolioContextType } from './PortfolioContext';

export function usePortfolio(): PortfolioContextType {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }

  // Add error boundary handling
  if (context.state.error) {
    console.error('Portfolio Error:', context.state.error);
  }

  // Add loading state handling
  if (context.state.isLoading) {
    console.log('Portfolio Loading...');
  }

  return context;
}
