import { Text, Card, Box, Table, ScrollArea, Grid } from '@radix-ui/themes';
import { usePortfolio } from '@/context/PortfolioContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Transaction } from '@/types';

const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  const getAmountColor = (type: string, amount: number) => {
    if (type === 'FEE' || type === 'SELL') return 'red';
    if (type === 'BUY') return 'blue';
    if (amount > 0) return 'green';
    return 'red';
  };

  return (
    <Table.Row>
      <Table.Cell>{formatDate(transaction.date)}</Table.Cell>
      <Table.Cell>{transaction.type}</Table.Cell>
      <Table.Cell>{transaction.description}</Table.Cell>
      <Table.Cell>{transaction.quantity?.toFixed(3) || '-'}</Table.Cell>
      <Table.Cell>{transaction.unitPrice ? formatCurrency(transaction.unitPrice) : '-'}</Table.Cell>
      <Table.Cell>
        <Text color={getAmountColor(transaction.type, transaction.amount)}>
          {formatCurrency(transaction.amount)}
        </Text>
      </Table.Cell>
      <Table.Cell>{transaction.account}</Table.Cell>
    </Table.Row>
  );
};

export const TransactionHistory = () => {
  const { state } = usePortfolio();
  const { portfolio } = state;

  if (!portfolio) {
    return (
      <Box className="p-6">
        <Text>
          No transaction data available. Please upload market prices and transactions data in the File Management section.
        </Text>
      </Box>
    );
  }

  const transactions = [...portfolio.transactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const calculateTotals = () => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'BUY') {
          acc.totalInvested += transaction.amount;
        } else if (transaction.type === 'SELL') {
          acc.totalWithdrawn += Math.abs(transaction.amount);
        } else if (transaction.type === 'FEE') {
          acc.totalFees += Math.abs(transaction.amount);
        }
        return acc;
      },
      { totalInvested: 0, totalWithdrawn: 0, totalFees: 0 }
    );
  };

  const totals = calculateTotals();

  return (
    <Box className="p-6">
      <Text size="6" weight="bold" mb="4">
        Transaction History
      </Text>

      <Grid columns="3" gap="4" mb="6">
        <Card>
          <Text size="2" color="gray">Total Invested</Text>
          <Text size="4" weight="bold" color="blue">
            {formatCurrency(totals.totalInvested)}
          </Text>
        </Card>
        <Card>
          <Text size="2" color="gray">Total Withdrawn</Text>
          <Text size="4" weight="bold" color="red">
            {formatCurrency(totals.totalWithdrawn)}
          </Text>
        </Card>
        <Card>
          <Text size="2" color="gray">Total Fees</Text>
          <Text size="4" weight="bold" color="red">
            {formatCurrency(totals.totalFees)}
          </Text>
        </Card>
      </Grid>

      <Card>
        <ScrollArea scrollbars="vertical" style={{ height: 'calc(100vh - 300px)' }}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Account</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {transactions.map((transaction, index) => (
                <TransactionRow key={index} transaction={transaction} />
              ))}
            </Table.Body>
          </Table.Root>
        </ScrollArea>
      </Card>
    </Box>
  );
};
