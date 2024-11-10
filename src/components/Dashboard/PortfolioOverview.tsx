import { Text, Card, Grid, Box, Table, ScrollArea } from '@radix-ui/themes';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { usePortfolio } from '../../context/usePortfolio';
import { Transaction } from '../../types';

export const PortfolioOverview = () => {
  const { state } = usePortfolio();
  const { portfolio } = state;

  if (!portfolio) {
    return (
      <Box>
        <Text>
          No portfolio data available. Please upload market prices and transactions data in the File Management section.
        </Text>
      </Box>
    );
  }

  const recentTransactions = [...portfolio.transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const getAmountColor = (type: string, amount: number) => {
    if (type === 'FEE' || type === 'SELL') return 'red';
    if (type === 'BUY') return 'blue';
    if (amount > 0) return 'green';
    return 'red';
  };

  return (
    <Box>
      <Text size="6" weight="bold" mb="4">
        Portfolio Overview
      </Text>

      <Grid columns="3" gap="4" mb="6">
        <Card>
          <Text size="2" color="gray">Total Value</Text>
          <Text size="4" weight="bold">
            {formatCurrency(portfolio.totalValue)}
          </Text>
        </Card>
        <Card>
          <Text size="2" color="gray">Total Return</Text>
          <Text 
            size="4" 
            weight="bold"
            color={portfolio.performance.totalReturn >= 0 ? 'green' : 'red'}
          >
            {formatCurrency(portfolio.performance.totalReturn)}
          </Text>
        </Card>
        <Card>
          <Text size="2" color="gray">Return %</Text>
          <Text 
            size="4" 
            weight="bold"
            color={portfolio.performance.percentageReturn >= 0 ? 'green' : 'red'}
          >
            {portfolio.performance.percentageReturn.toFixed(2)}%
          </Text>
        </Card>
      </Grid>

      <Grid columns="2" gap="4">
        <Card>
          <Text size="3" weight="bold" mb="2">Account Breakdown</Text>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Account</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Balance</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {portfolio.accounts.map((account) => (
                <Table.Row key={account.type}>
                  <Table.Cell>{account.type}</Table.Cell>
                  <Table.Cell>{formatCurrency(account.balance)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>

        <Card>
          <Text size="3" weight="bold" mb="2">Recent Transactions</Text>
          <ScrollArea>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Account</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {recentTransactions.map((transaction: Transaction, index: number) => (
                  <Table.Row key={index}>
                    <Table.Cell>{formatDate(transaction.date)}</Table.Cell>
                    <Table.Cell>{transaction.type}</Table.Cell>
                    <Table.Cell>
                      <Text color={getAmountColor(transaction.type, transaction.amount)}>
                        {formatCurrency(transaction.amount)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>{transaction.account}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </ScrollArea>
        </Card>
      </Grid>
    </Box>
  );
};
