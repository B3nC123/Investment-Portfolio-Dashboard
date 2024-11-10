import { Box, Text, Flex } from '@radix-ui/themes';
import { ReloadIcon } from '@radix-ui/react-icons';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const LoadingSpinner = ({ size = 'medium', text }: LoadingSpinnerProps) => {
  const sizeMap = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <Flex direction="column" align="center" justify="center" className="h-full min-h-[200px]">
      <ReloadIcon className={`${sizeMap[size]} animate-spin text-blue-600`} />
      {text && (
        <Text size="2" color="gray" mt="2" align="center">
          {text}
        </Text>
      )}
    </Flex>
  );
};
