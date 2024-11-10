import { useState, useCallback } from 'react';
import { Button, Text, Flex, Card, Box } from '@radix-ui/themes';
import { UploadIcon, ReloadIcon, CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { validateCSVFormat, parseCSVFile } from '@/services/csvService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface FileUploadProps {
  onFileProcessed: (file: File) => void;
  fileType: 'marketPrices' | 'transactions';
}

const expectedHeaders = {
  marketPrices: ['Code', 'Stock', 'Price (pence)'],
  transactions: [
    'Trade date',
    'Settle date',
    'Reference',
    'Transaction Category',
    'Direction',
    'Description',
    'Quantity',
    'Unit cost (£)',
    'Purchase Value (£)',
    'Account'
  ]
};

export const FileUpload = ({ onFileProcessed, fileType }: FileUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);

  const resetState = () => {
    setError(null);
    setSelectedFile(null);
    setPreviewData(null);
    setIsProcessing(false);
  };

  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);
      const result = await parseCSVFile(file);
      const headers = Object.keys(result.data[0] || {});

      if (!validateCSVFormat(headers, fileType)) {
        setError(`Invalid CSV format. Expected headers: ${expectedHeaders[fileType].join(', ')}`);
        setIsProcessing(false);
        return;
      }

      setPreviewData(result.data.slice(0, 5));
      setSelectedFile(file);
      setIsProcessing(false);
    } catch (err) {
      setError('Error processing file. Please ensure it is a valid CSV file.');
      setIsProcessing(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      processFile(file);
    } else {
      setError('Please upload a CSV file.');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      onFileProcessed(selectedFile);
      resetState();
    }
  };

  return (
    <Box>
      <Card
        className={`
          upload-dropzone
          transition-all duration-300 ease-in-out
          ${isDragging ? 'dragging scale-[1.02]' : ''}
          ${error ? 'border-red-300' : selectedFile ? 'border-green-300' : ''}
        `}
      >
        <Flex direction="column" align="center" gap="3" className="p-8">
          <Box 
            className={`
              rounded-full p-3
              transition-all duration-300 ease-in-out
              ${isProcessing ? 'bg-primary/20' : selectedFile ? 'bg-green-100' : 'bg-primary/10'}
            `}
          >
            {isProcessing ? (
              <LoadingSpinner size="small" />
            ) : selectedFile ? (
              <CheckCircledIcon className="w-6 h-6 text-green-500" />
            ) : (
              <UploadIcon className="w-6 h-6 text-primary" />
            )}
          </Box>
          
          {!selectedFile && (
            <Flex direction="column" align="center" gap="2">
              <Text size="3" weight="medium">
                {fileType === 'marketPrices' ? 'Upload Market Prices' : 'Upload Transactions'}
              </Text>
              <Text size="2" color="gray" align="center">
                Drag and drop your CSV file here, or{' '}
                <label className="text-primary hover:text-primary/80 cursor-pointer underline transition-colors duration-200">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                  />
                </label>
              </Text>
              <Text size="1" color="gray">
                Supported format: CSV
              </Text>
            </Flex>
          )}

          {selectedFile && (
            <Flex direction="column" align="center" gap="1">
              <Text size="2" weight="medium">
                {selectedFile.name}
              </Text>
              <Text size="1" color="gray">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </Text>
            </Flex>
          )}

          {error && (
            <Flex 
              align="center" 
              gap="2" 
              className="bg-red-50 p-2 rounded-md transition-all duration-300 ease-in-out"
            >
              <CrossCircledIcon className="text-red-500" />
              <Text color="red" size="2">
                {error}
              </Text>
            </Flex>
          )}
        </Flex>
      </Card>

      {previewData && (
        <Box className="mt-4 animate-fadeIn">
          <Text size="2" weight="bold" mb="2">
            Preview (first 5 rows):
          </Text>
          <Card className="overflow-auto max-h-[300px]">
            <table className="preview-table">
              <thead>
                <tr>
                  {Object.keys(previewData[0]).map((header) => (
                    <th key={header}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value: any, i) => (
                      <td key={i}>
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Flex gap="3" mt="4">
            <Button 
              onClick={handleConfirmUpload} 
              size="2"
              className="bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              <CheckCircledIcon />
              Confirm Upload
            </Button>
            <Button 
              onClick={resetState} 
              variant="soft" 
              size="2"
              color="gray"
              className="transition-colors duration-200"
            >
              Cancel
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};
