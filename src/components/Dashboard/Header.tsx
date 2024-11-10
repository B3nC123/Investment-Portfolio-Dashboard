import { Flex, Heading, Select } from '@radix-ui/themes';

export const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white p-4">
      <Flex justify="between" align="center">
        <Heading size="6">Investment Portfolio Dashboard</Heading>
        <Flex gap="4">
          <Select.Root defaultValue="1Y">
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="YTD">YTD</Select.Item>
              <Select.Item value="1Y">1 Year</Select.Item>
              <Select.Item value="3Y">3 Years</Select.Item>
              <Select.Item value="5Y">5 Years</Select.Item>
              <Select.Item value="ALL">All Time</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>
    </header>
  );
};
