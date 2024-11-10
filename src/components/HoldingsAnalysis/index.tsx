import { Text, Card, Grid, Box, Flex, ScrollArea, Tabs } from '@radix-ui/themes';
import { usePortfolio } from '../../context/usePortfolio';
import { formatCurrency } from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Holding } from '../../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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

  // Calculate portfolio allocation data
  const totalValue = portfolio.totalValue;
  const allocationData = portfolio.holdings.map(holding => ({
    name: holding.name.split(' ').slice(0, 2).join(' '), // Truncate name for chart
    value: (holding.value / totalValue) * 100
  }));

  // Calculate performance data
  const performanceData = portfolio.holdings.map(holding => ({
    name: holding.name.split(' ').slice(0, 2).join(' '),
    return: holding.performance.percentageReturn
  }));

  return (
    <Box className="p-6">
      <Text size="6" weight="bold" mb="4">
        Holdings Analysis
      </Text>

      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="allocation">Asset Allocation</Tabs.Trigger>
          <Tabs.Trigger value="performance">Performance</Tabs.Trigger>
        </Tabs.List>

        <Box mt="4">
          <Tabs.Content value="overview">
            <Grid columns="1" gap="4">
              {portfolio.holdings.map((holding: Holding) => (
                <Card key={holding.code}>
                  <Grid columns="2" gap="4">
                    <Box>
                      <Text size="3" weight="bold">
                        {holding.name}
                      </Text>
                      <Text size="2" color="gray">
                        {holding.code}
                      </Text>
                      <Text size="2" color="gray" mt="2">
                        Portfolio Weight: {((holding.value / totalValue) * 100).toFixed(2)}%
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
          </Tabs.Content>

          <Tabs.Content value="allocation">
            <Card>
              <Text size="4" weight="bold" mb="4">
                Portfolio Allocation
              </Text>
              <Flex gap="4">
                <Box style={{ width: '50%', height: 400 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={allocationData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label={({ name, value }: { name: string; value: number }) => 
                          `${name}: ${value.toFixed(1)}%`
                        }
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <ScrollArea style={{ height: 400, width: '50%' }}>
                  <Box p="4">
                    {portfolio.holdings.map((holding: Holding, index: number) => (
                      <Flex key={holding.code} align="center" gap="2" mb="2">
                        <Box
                          style={{
                            width: 12,
                            height: 12,
                            backgroundColor: COLORS[index % COLORS.length],
                            borderRadius: '50%'
                          }}
                        />
                        <Text size="2">
                          {holding.name} ({((holding.value / totalValue) * 100).toFixed(2)}%)
                        </Text>
                      </Flex>
                    ))}
                  </Box>
                </ScrollArea>
              </Flex>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="performance">
            <Card>
              <Text size="4" weight="bold" mb="4">Performance Analysis</Text>
              <Box style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Return %', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="return" fill="#8884d8">
                      {performanceData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.return >= 0 ? '#00C49F' : '#FF8042'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
};
