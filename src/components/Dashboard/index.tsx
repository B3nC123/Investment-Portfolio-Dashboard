import { Box } from '@radix-ui/themes';
import { usePortfolio } from '../../context/usePortfolio';
import { PortfolioOverview } from './PortfolioOverview';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const Dashboard = () => {
  const { state } = usePortfolio();
  const { isLoading, error } = state;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box className="p-6">
        <div className="text-red-500">{error}</div>
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <PortfolioOverview />
    </Box>
  );
};
