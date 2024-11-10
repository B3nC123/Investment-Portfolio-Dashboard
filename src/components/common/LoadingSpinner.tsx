import { Box } from '@radix-ui/themes';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const LoadingSpinner = ({ size = 'medium', color = 'primary' }: LoadingSpinnerProps) => {
  const sizeMap = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorMap = {
    primary: 'border-primary',
    white: 'border-white',
    gray: 'border-gray-300'
  };

  return (
    <Box
      className={`
        ${sizeMap[size]}
        border-2
        ${colorMap[color as keyof typeof colorMap]}
        border-t-transparent
        rounded-full
        animate-spin
        loading-spinner
      `}
    />
  );
};
