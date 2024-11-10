import { Flex, Button } from '@radix-ui/themes';
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
    { icon: <BarChartIcon />, label: 'Portfolio Overview', path: '/' },
    { icon: <LayersIcon />, label: 'Holdings Analysis', path: '/holdings' },
    { icon: <ClockIcon />, label: 'Transaction History', path: '/transactions' },
    { icon: <FileTextIcon />, label: 'File Management', path: '/files' },
    { icon: <GearIcon />, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4">
      <Flex direction="column" gap="2">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? 'solid' : 'ghost'}
            className="justify-start"
            onClick={() => navigate(item.path)}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Button>
        ))}
      </Flex>
    </aside>
  );
};
