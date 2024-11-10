import { Flex, Heading, Select, Box } from '@radix-ui/themes';

export const Header = () => {
  return (
    <Box className="border-b border-gray-200 bg-white">
      <Flex justify="between" align="center" p="4">
        <Heading size="5" weight="medium" className="text-gray-900">
          Investment Portfolio Dashboard
        </Heading>
        <Flex gap="4" align="center">
          <Select.Root defaultValue="1Y">
            <Select.Trigger placeholder="Time Period" />
            <Select.Content>
              <Select.Group>
                <Select.Label>Time Period</Select.Label>
                <Select.Item value="YTD">Year to Date</Select.Item>
                <Select.Item value="1Y">1 Year</Select.Item>
                <Select.Item value="3Y">3 Years</Select.Item>
                <Select.Item value="5Y">5 Years</Select.Item>
                <Select.Item value="ALL">All Time</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>
    </Box>
  );
};
