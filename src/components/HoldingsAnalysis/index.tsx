import { Text, Card, Grid, Box } from '@radix-ui/themes';
import { usePortfolio } from '@/context/PortfolioContext';
import { formatCurrency } from '@/utils/formatters';

export const HoldingsAnalysis = () => {
  const { state } = usePortfolio();
  const { portfolio } = state;

  if (!portfolio) {
    return (
      <Box className="p-6">
        <Text>
          No portfolio data available. Please upload market prices and transactions data in the File Management section.
        </Text>
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Text size="6" weight="bold" mb="4">
        Holdings Analysis
      </Text>

      <Grid columns="1" gap="4">
        {portfolio.holdings.map((holding) => (
          <Card key={holding.code}>
            <Grid columns="2" gap="4">
              <Box>
                <Text size="3" weight="bold">
                  {holding.name}
                </Text>
                <Text size="2" color="gray">
                  {holding.code}
                </Text>
              </Box>
              <Box>
                <Grid columns="2" gap="4">
                  <Box>
                    <Text size="2" color="gray">Quantity</Text>
                    <Text size="2">{holding.quantity.toFixed(3)}</Text>
                  </Box>
                  <Box>
                    <Text size="2" color="gray">Current Price</Text>
                    <Text size="2">{formatCurrency(holding.currentPrice)}</Text>
                  </Box>
                  <Box>
                    <Text size="2" color="gray">Total Value</Text>
                    <Text size="2">{formatCurrency(holding.value)}</Text>
                  </Box>
                  <Box>
                    <Text size="2" color="gray">Cost Basis</Text>
                    <Text size="2">{formatCurrency(holding.costBasis)}</Text>
                  </Box>
                  <Box>
                    <Text size="2" color="gray">Total Return</Text>
                    <Text 
                      size="2" 
                      color={holding.performance.totalReturn >= 0 ? 'green' : 'red'}
                    >
                      {formatCurrency(holding.performance.totalReturn)}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="2" color="gray">Return %</Text>
                    <Text 
                      size="2" 
                      color={holding.performance.percentageReturn >= 0 ? 'green' : 'red'}
                    >
                      {holding.performance.percentageReturn.toFixed(2)}%
                    </Text>
                  </Box>
                </Grid>
              </Box>
            </Grid>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};
