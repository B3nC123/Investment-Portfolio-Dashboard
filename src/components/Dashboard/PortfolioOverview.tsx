import { Card, Grid, Text, Flex, Box } from '@radix-ui/themes';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePortfolio } from '@/context/PortfolioContext';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

const MetricCard = ({ title, value, change }: { title: string; value: string; change?: string }) => (
  <Card>
    <Flex direction="column" gap="1">
      <Text size="2" color="gray">{title}</Text>
      <Text size="6" weight="bold">{value}</Text>
      {change && (
        <Text size="2" color={change.startsWith('+') ? 'green' : 'red'}>
          {change}
        </Text>
      )}
    </Flex>
  </Card>
);

const AccountBreakdown = ({ accounts }: { accounts: { type: string; balance: number }[] }) => (
  <Card>
    <Text size="3" weight="bold" mb="4">Account Breakdown</Text>
    <Flex direction="column" gap="3">
      {accounts.map(account => (
        <Flex key={account.type} justify="between">
          <Text>{account.type}</Text>
          <Text weight="bold">{formatCurrency(account.balance)}</Text>
        </Flex>
      ))}
    </Flex>
  </Card>
);

export const PortfolioOverview = () => {
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

  const performanceData = portfolio.transactions.map(t => ({
    date: t.date.toISOString().split('T')[0],
    value: t.amount,
  })).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Box className="p-6">
      <Grid columns="3" gap="4" mb="6">
        <MetricCard
          title="Total Portfolio Value"
          value={formatCurrency(portfolio.totalValue)}
          change={formatPercentage(portfolio.performance.percentageReturn)}
        />
        <MetricCard
          title="Total Return"
          value={formatCurrency(portfolio.performance.totalReturn)}
          change={formatPercentage(portfolio.performance.percentageReturn)}
        />
        <MetricCard
          title="Number of Holdings"
          value={portfolio.holdings.length.toString()}
        />
      </Grid>

      <Grid columns="2" gap="4" mb="6">
        <AccountBreakdown accounts={portfolio.accounts} />
        <Card>
          <Text size="3" weight="bold" mb="4">Recent Activity</Text>
          <Flex direction="column" gap="2">
            {portfolio.transactions.slice(-5).reverse().map((transaction, index) => (
              <Flex key={index} justify="between">
                <Text size="2">{transaction.date.toLocaleDateString()}</Text>
                <Text size="2">{transaction.description.slice(0, 30)}...</Text>
                <Text size="2" weight="bold">{formatCurrency(transaction.amount)}</Text>
              </Flex>
            ))}
          </Flex>
        </Card>
      </Grid>

      <Card className="h-[400px]">
        <Text size="3" weight="bold" mb="4">Portfolio Performance</Text>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={performanceData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label: string) => new Date(label).toLocaleDateString()}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};
