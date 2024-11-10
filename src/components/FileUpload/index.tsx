import { useState } from 'react';
import { Card, Text, Button } from '@radix-ui/themes';
import { usePortfolio } from '../../context/usePortfolio';
import { validateCSVFormat, parseCSVFile, parseCSVContent } from '../../services/csvService';

interface FileUploadProps {
  type: 'transactions' | 'marketPrices';
  onUpload: (data: any[]) => void;
}

const requiredColumns = {
  transactions: ['Date', 'Type', 'Description', 'Amount', 'Account'],
  marketPrices: ['Date', 'Symbol', 'Name', 'Price', 'Currency']
};

export const FileUpload = ({ type, onUpload }: FileUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = usePortfolio();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      dispatch({ type: 'SET_LOADING', payload: true });

      const csvRows = await parseCSVFile(file);
      if (csvRows.length === 0) {
        throw new Error('File is empty');
      }

      // Get headers from the first row
      const headers = Object.keys(csvRows[0]);
      
      // Validate CSV format
      if (!validateCSVFormat(headers, requiredColumns[type])) {
        throw new Error(
          `Invalid CSV format. Required columns: ${requiredColumns[type].join(', ')}`
        );
      }

      onUpload(csvRows);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'Error processing file');
      dispatch({ type: 'SET_ERROR', payload: 'Error processing file' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <Card>
      <Text size="2" mb="2">Upload {type} CSV file</Text>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {error && (
        <Text color="red" size="2" mt="2">
          {error}
        </Text>
      )}
    </Card>
  );
};
