import { Text, Box, Flex } from '@radix-ui/themes';
import { usePortfolio } from '@/context/PortfolioContext';
import { PortfolioOverview } from './PortfolioOverview';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export const Dashboard = () => {
  const { state } = usePortfolio();
  const { isLoading, error } = state;

  if (isLoading) {
    return (
      <Flex align="center" justify="center" className="h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex 
        align="center" 
        justify="center" 
        className="h-[calc(100vh-4rem)]"
        gap="2"
      >
        <ExclamationTriangleIcon className="text-red-500 h-5 w-5" />
        <Text color="red">{error}</Text>
      </Flex>
    );
  }

  return (
    <Box>
      <Box className="border-b border-gray-200 bg-white p-4">
        <Text size="6" weight="bold">
          Portfolio Dashboard
        </Text>
        <Text size="2" color="gray">
          Track your investment portfolio performance and analysis
        </Text>
      </Box>
      
      {!state.portfolio ? (
        <Flex 
          align="center" 
          justify="center" 
          className="h-[calc(100vh-8rem)] bg-gray-50"
          direction="column"
          gap="4"
        >
          <Text size="5" weight="bold">
            Welcome to Your Investment Portfolio Dashboard
          </Text>
          <Text size="2" color="gray" align="center" style={{ maxWidth: '500px' }}>
            To get started, please upload your market prices and transactions data
            in the File Management section. Once uploaded, you'll see your portfolio
            analysis and performance metrics here.
          </Text>
        </Flex>
      ) : (
        <Box className="bg-gray-50 min-h-[calc(100vh-8rem)]">
          <PortfolioOverview />
        </Box>
      )}
    </Box>
  );
};
