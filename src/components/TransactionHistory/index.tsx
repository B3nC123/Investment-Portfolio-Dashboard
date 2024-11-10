import { Text, Card, Box, Table, ScrollArea, Grid, Flex, Select, Tabs } from '@radix-ui/themes';
import { usePortfolio } from '../../context/usePortfolio';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Transaction } from '../../types';
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { LoadingSpinner } from '../common/LoadingSpinner';

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

const TransactionFilters = ({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  type,
  setType,
  account,
  setAccount
}: {
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
  type: string;
  setType: (type: string) => void;
  account: string;
  setAccount: (account: string) => void;
}) => (
  <Flex gap="4" mb="4">
    <Box>
      <Text size="2" mb="1">From Date</Text>
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="px-3 py-2 border rounded-md w-full"
      />
    </Box>
    <Box>
      <Text size="2" mb="1">To Date</Text>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="px-3 py-2 border rounded-md w-full"
      />
    </Box>
    <Box>
      <Text size="2" mb="1">Type</Text>
      <Select.Root value={type} onValueChange={setType}>
        <Select.Trigger placeholder="Transaction Type" />
        <Select.Content>
          <Select.Item value="ALL">All Types</Select.Item>
          <Select.Item value="BUY">Buy</Select.Item>
          <Select.Item value="SELL">Sell</Select.Item>
          <Select.Item value="DIVIDEND">Dividend</Select.Item>
          <Select.Item value="FEE">Fee</Select.Item>
          <Select.Item value="DEPOSIT">Deposit</Select.Item>
        </Select.Content>
      </Select.Root>
    </Box>
    <Box>
      <Text size="2" mb="1">Account</Text>
      <Select.Root value={account} onValueChange={setAccount}>
        <Select.Trigger placeholder="Account" />
        <Select.Content>
          <Select.Item value="ALL">All Accounts</Select.Item>
          <Select.Item value="ISA">ISA</Select.Item>
          <Select.Item value="LISA">LISA</Select.Item>
        </Select.Content>
      </Select.Root>
    </Box>
  </Flex>
);

export const TransactionHistory = () => {
  const { state } = usePortfolio();
  const { portfolio, isLoading, error } = state;
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [type, setType] = useState('ALL');
  const [account, setAccount] = useState('ALL');

  if (isLoading) {
    return (
      <Box className="p-6">
        <LoadingSpinner size="large" text="Loading transaction data..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-6">
        <Card>
          <Text color="red" size="3">
            Error loading transactions: {error}
          </Text>
        </Card>
      </Box>
    );
  }

  if (!portfolio) {
    return (
      <Box className="p-6">
        <Card>
          <Text size="3">
            No transaction data available. Please upload market prices and transactions data in the File Management section.
          </Text>
        </Card>
      </Box>
    );
  }

  const filteredTransactions = useMemo(() => {
    return [...portfolio.transactions]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .filter(t => {
        if (dateFrom && t.date < new Date(dateFrom)) return false;
        if (dateTo && t.date > new Date(dateTo)) return false;
        if (type !== 'ALL' && t.type !== type) return false;
        if (account !== 'ALL' && t.account !== account) return false;
        return true;
      });
  }, [portfolio.transactions, dateFrom, dateTo, type, account]);

  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'BUY') {
          acc.totalInvested += Math.abs(transaction.amount);
        } else if (transaction.type === 'SELL') {
          acc.totalWithdrawn += Math.abs(transaction.amount);
        } else if (transaction.type === 'FEE') {
          acc.totalFees += Math.abs(transaction.amount);
        } else if (transaction.type === 'DEPOSIT') {
          acc.totalDeposits += Math.abs(transaction.amount);
        } else if (transaction.type === 'DIVIDEND') {
          acc.totalDividends += Math.abs(transaction.amount);
        }
        return acc;
      },
      { totalInvested: 0, totalWithdrawn: 0, totalFees: 0, totalDeposits: 0, totalDividends: 0 }
    );
  }, [filteredTransactions]);

  const monthlySummaries = useMemo(() => {
    const summaries: Record<string, { deposits: number; fees: number; investments: number }> = {};
    filteredTransactions.forEach(t => {
      const monthKey = `${t.date.getFullYear()}-${(t.date.getMonth() + 1).toString().padStart(2, '0')}`;
      if (!summaries[monthKey]) {
        summaries[monthKey] = { deposits: 0, fees: 0, investments: 0 };
      }
      if (t.type === 'DEPOSIT') summaries[monthKey].deposits += Math.abs(t.amount);
      if (t.type === 'FEE') summaries[monthKey].fees += Math.abs(t.amount);
      if (t.type === 'BUY') summaries[monthKey].investments += Math.abs(t.amount);
    });
    return Object.entries(summaries)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [filteredTransactions]);

  return (
    <Box className="p-6">
      <Text size="6" weight="bold" mb="4">
        Transaction History
      </Text>

      <Card className="mb-6">
        <TransactionFilters
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          type={type}
          setType={setType}
          account={account}
          setAccount={setAccount}
        />
      </Card>

      <Grid columns="5" gap="4" mb="6">
        <Card>
          <Text size="2" color="gray">Total Invested</Text>
          <Text size="4" weight="bold" color="blue">
            {formatCurrency(totals.totalInvested)}
          </Text>
        </Card>
        <Card>
          <Text size="2" color="gray">Total Deposits</Text>
          <Text size="4" weight="bold" color="green">
            {formatCurrency(totals.totalDeposits)}
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
        <Card>
          <Text size="2" color="gray">Total Dividends</Text>
          <Text size="4" weight="bold" color="green">
            {formatCurrency(totals.totalDividends)}
          </Text>
        </Card>
      </Grid>

      <Tabs.Root defaultValue="transactions">
        <Tabs.List>
          <Tabs.Trigger value="transactions">Transactions</Tabs.Trigger>
          <Tabs.Trigger value="analysis">Analysis</Tabs.Trigger>
        </Tabs.List>

        <Box mt="4">
          <Tabs.Content value="transactions">
            <Card>
              <ScrollArea scrollbars="vertical" style={{ height: 'calc(100vh - 400px)' }}>
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
                    {filteredTransactions.map((transaction, index) => (
                      <TransactionRow key={index} transaction={transaction} />
                    ))}
                  </Table.Body>
                </Table.Root>
              </ScrollArea>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="analysis">
            <Grid columns="1" gap="4">
              <Card>
                <Text size="4" weight="bold" mb="4">Monthly Activity</Text>
                <Box style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <BarChart data={monthlySummaries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label: string) => {
                          const [year, month] = label.split('-');
                          return `${new Date(parseInt(year), parseInt(month)-1).toLocaleString('default', { month: 'long' })} ${year}`;
                        }}
                      />
                      <Bar dataKey="deposits" name="Deposits" fill="#82ca9d" />
                      <Bar dataKey="investments" name="Investments" fill="#8884d8" />
                      <Bar dataKey="fees" name="Fees" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>

              <Card>
                <Text size="4" weight="bold" mb="4">Cumulative Deposits</Text>
                <Box style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={monthlySummaries.map((data, index, array) => ({
                        month: data.month,
                        total: array
                          .slice(0, index + 1)
                          .reduce((sum, item) => sum + item.deposits, 0)
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label: string) => {
                          const [year, month] = label.split('-');
                          return `${new Date(parseInt(year), parseInt(month)-1).toLocaleString('default', { month: 'long' })} ${year}`;
                        }}
                      />
                      <Line type="monotone" dataKey="total" name="Cumulative Deposits" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
};
