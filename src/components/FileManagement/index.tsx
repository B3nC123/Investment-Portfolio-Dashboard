import { useState, useEffect } from 'react';
import { Container, Tabs, Box, Text, Grid, Flex, Button, Card } from '@radix-ui/themes';
import { FileUpload } from '@/components/FileUpload';
import { processMarketPrices, processTransactions } from '@/services/csvService';
import { MarketPrice, Transaction } from '@/types';
import { usePortfolio } from '@/context/PortfolioContext';
import { ReloadIcon, CheckCircledIcon, InfoCircledIcon } from '@radix-ui/react-icons';

const FormatHelp = ({ fileType }: { fileType: 'marketPrices' | 'transactions' }) => {
  const examples = {
    marketPrices: `Code,Stock,Price (pence)
0830906,AXA Global Sustainable Distribution,387
B1XG948,Jupiter UK Mid Cap,250.87`,
    transactions: `Trade date,Settle date,Reference,Transaction Category,Direction,Description,Quantity,Unit cost (£),Purchase Value (£),Account
15/09/2021,16/09/2021,CARD WEB,Deposit,In,Opening Subscription,0,0,4000,LISA
16/09/2021,22/09/2021,B080710043,Purchase,N/A,Jupiter UK Mid Cap,259.054,3.86,1000,LISA`
  };

  return (
    <Card className="mt-4 bg-blue-50/50">
      <Flex gap="2" align="center" mb="2">
        <InfoCircledIcon className="text-blue-500" />
        <Text size="2" weight="medium">CSV Format Requirements</Text>
      </Flex>
      <Text size="2" color="gray" mb="2">
        {fileType === 'marketPrices' 
          ? 'Your market prices CSV file should contain current stock/fund prices with the following columns:'
          : 'Your transactions CSV file should contain transaction history with the following columns:'}
      </Text>
      <Box className="bg-white p-2 rounded-md mb-2">
        <Text size="2" className="font-mono">
          {fileType === 'marketPrices' 
            ? 'Code, Stock, Price (pence)'
            : 'Trade date, Settle date, Reference, Transaction Category, Direction, Description, Quantity, Unit cost (£), Purchase Value (£), Account'}
        </Text>
      </Box>
      <Text size="2" color="gray" mb="2">Example:</Text>
      <Box className="bg-white p-2 rounded-md overflow-x-auto">
        <pre className="text-xs font-mono">
          {examples[fileType]}
        </pre>
      </Box>
    </Card>
  );
};

export const FileManagement = () => {
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'market-prices' | 'transactions'>('market-prices');
  const [uploadStatus, setUploadStatus] = useState<{
    marketPrices: 'idle' | 'loading' | 'success' | 'error';
    transactions: 'idle' | 'loading' | 'success' | 'error';
  }>({
    marketPrices: 'idle',
    transactions: 'idle'
  });

  const { state, dispatch } = usePortfolio();

  useEffect(() => {
    if (marketPrices.length > 0 && transactions.length > 0) {
      console.log('Building portfolio with:', {
        marketPrices: marketPrices.length,
        transactions: transactions.length
      });
      
      dispatch({ type: 'SET_MARKET_PRICES', payload: marketPrices });
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      
      // Give the state updates time to process before building portfolio
      setTimeout(() => {
        dispatch({ type: 'BUILD_PORTFOLIO' });
      }, 100);
    }
  }, [marketPrices, transactions, dispatch]);

  const handleMarketPricesUpload = async (file: File) => {
    try {
      setUploadStatus(prev => ({ ...prev, marketPrices: 'loading' }));
      dispatch({ type: 'SET_LOADING', payload: true });
      const processed = await processMarketPrices(file);
      console.log('Processed market prices:', processed.length);
      setMarketPrices(processed);
      setUploadStatus(prev => ({ ...prev, marketPrices: 'success' }));
    } catch (error) {
      console.error('Error processing market prices:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error processing market prices file' });
      setUploadStatus(prev => ({ ...prev, marketPrices: 'error' }));
    }
  };

  const handleTransactionsUpload = async (file: File) => {
    try {
      setUploadStatus(prev => ({ ...prev, transactions: 'loading' }));
      dispatch({ type: 'SET_LOADING', payload: true });
      const processed = await processTransactions(file);
      console.log('Processed transactions:', processed.length);
      setTransactions(processed);
      setUploadStatus(prev => ({ ...prev, transactions: 'success' }));
    } catch (error) {
      console.error('Error processing transactions:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error processing transactions file' });
      setUploadStatus(prev => ({ ...prev, transactions: 'error' }));
    }
  };

  const getUploadStatusIcon = (status: 'idle' | 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading':
        return <ReloadIcon className="animate-spin" />;
      case 'success':
        return <CheckCircledIcon className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Container size="3">
      <Box className="py-6">
        <Flex justify="between" align="center" mb="4">
          <Text size="6" weight="bold">
            File Management
          </Text>
          {state.portfolio && (
            <Button color="green" variant="soft">
              <CheckCircledIcon />
              Portfolio Data Loaded
            </Button>
          )}
        </Flex>

        {state.error && (
          <Box className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <Text color="red" size="2">
              {state.error}
            </Text>
          </Box>
        )}

        <Tabs.Root 
          defaultValue="market-prices" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'market-prices' | 'transactions')}
        >
          <Tabs.List>
            <Tabs.Trigger 
              value="market-prices"
              className="relative"
            >
              <Flex gap="2" align="center">
                Market Prices
                {getUploadStatusIcon(uploadStatus.marketPrices)}
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="transactions"
              className="relative"
            >
              <Flex gap="2" align="center">
                Transactions
                {getUploadStatusIcon(uploadStatus.transactions)}
              </Flex>
            </Tabs.Trigger>
          </Tabs.List>

          <Box className="mt-6">
            <Tabs.Content value="market-prices">
              <Grid gap="4">
                <FileUpload
                  onFileProcessed={handleMarketPricesUpload}
                  fileType="marketPrices"
                />
                <FormatHelp fileType="marketPrices" />
                {marketPrices.length > 0 && (
                  <Box className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <Text size="3" weight="bold" mb="2">
                      Processed {marketPrices.length} market price records
                    </Text>
                    <Text size="2" color="gray">
                      Last updated: {new Date().toLocaleDateString()}
                    </Text>
                  </Box>
                )}
              </Grid>
            </Tabs.Content>

            <Tabs.Content value="transactions">
              <Grid gap="4">
                <FileUpload
                  onFileProcessed={handleTransactionsUpload}
                  fileType="transactions"
                />
                <FormatHelp fileType="transactions" />
                {transactions.length > 0 && (
                  <Box className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <Text size="3" weight="bold" mb="2">
                      Processed {transactions.length} transaction records
                    </Text>
                    <Text size="2" color="gray">
                      Last updated: {transactions[transactions.length - 1].date.toLocaleDateString()}
                    </Text>
                  </Box>
                )}
              </Grid>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </Container>
  );
};
