import { Flex, Button, Box } from '@radix-ui/themes';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BarChartIcon,
  LayersIcon,
  ClockIcon,
  FileTextIcon,
  GearIcon
} from '@radix-ui/react-icons';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <BarChartIcon width={18} height={18} />, label: 'Portfolio Overview', path: '/' },
    { icon: <LayersIcon width={18} height={18} />, label: 'Holdings Analysis', path: '/holdings' },
    { icon: <ClockIcon width={18} height={18} />, label: 'Transaction History', path: '/transactions' },
    { icon: <FileTextIcon width={18} height={18} />, label: 'File Management', path: '/files' },
  ];

  return (
    <Box className="w-64 border-r border-gray-200 bg-white">
      <Flex direction="column" p="4" gap="2">
        <Box mb="4">
          <Flex align="center" justify="center" mb="4">
            <BarChartIcon width={24} height={24} className="text-blue-600" />
          </Flex>
        </Box>
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? 'solid' : 'ghost'}
            onClick={() => navigate(item.path)}
            className={`
              w-full justify-start px-3 py-2 
              ${location.pathname === item.path 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Flex align="center" gap="2">
              {item.icon}
              <span>{item.label}</span>
            </Flex>
          </Button>
        ))}
      </Flex>
    </Box>
  );
};
