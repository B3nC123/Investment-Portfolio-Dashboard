import { Box, Card, Grid, Text } from '@radix-ui/themes';
import { FileUpload } from '../FileUpload';
import { usePortfolio } from '../../context/usePortfolio';
import { processMarketPrices, processTransactions } from '../../services/csvService';
import { CSVRow } from '../../types';

export const FileManagement = () => {
  const { dispatch } = usePortfolio();

  const handleMarketPricesUpload = async (csvRows: CSVRow[]) => {
    try {
      const marketPrices = processMarketPrices(csvRows);
      dispatch({ type: 'SET_MARKET_PRICES', payload: marketPrices });
      dispatch({ type: 'BUILD_PORTFOLIO' });
    } catch (error) {
      console.error('Error processing market prices:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Error processing market prices file' 
      });
    }
  };

  const handleTransactionsUpload = async (csvRows: CSVRow[]) => {
    try {
      const transactions = processTransactions(csvRows);
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      dispatch({ type: 'BUILD_PORTFOLIO' });
    } catch (error) {
      console.error('Error processing transactions:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Error processing transactions file' 
      });
    }
  };

  return (
    <Box p="6">
      <Text size="6" weight="bold" mb="4">
        File Management
      </Text>

      <Grid columns="2" gap="4">
        <Card>
          <Text size="3" weight="bold" mb="2">
            Market Prices
          </Text>
          <FileUpload 
            type="marketPrices"
            onUpload={handleMarketPricesUpload}
          />
        </Card>

        <Card>
          <Text size="3" weight="bold" mb="2">
            Transactions
          </Text>
          <FileUpload 
            type="transactions"
            onUpload={handleTransactionsUpload}
          />
        </Card>
      </Grid>
    </Box>
  );
};
