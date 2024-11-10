import { Text, Card, Switch, Grid, Flex } from '@radix-ui/themes';

export const Settings = () => {
  return (
    <div>
      <Text size="6" weight="bold" mb="4">
        Settings
      </Text>
      <Grid columns="1" gap="4" width="100%" style={{ maxWidth: '600px' }}>
        <Card>
          <Flex justify="between" align="center">
            <div>
              <Text weight="bold">Dark Mode</Text>
              <Text size="2" color="gray">Enable dark mode for the dashboard</Text>
            </div>
            <Switch />
          </Flex>
        </Card>

        <Card>
          <Flex justify="between" align="center">
            <div>
              <Text weight="bold">Currency Display</Text>
              <Text size="2" color="gray">Show values in GBP (£)</Text>
            </div>
            <Switch defaultChecked />
          </Flex>
        </Card>

        <Card>
          <Flex justify="between" align="center">
            <div>
              <Text weight="bold">Auto-refresh Data</Text>
              <Text size="2" color="gray">Automatically update market prices</Text>
            </div>
            <Switch />
          </Flex>
        </Card>

        <Card>
          <Flex justify="between" align="center">
            <div>
              <Text weight="bold">Email Notifications</Text>
              <Text size="2" color="gray">Receive updates about your portfolio</Text>
            </div>
            <Switch />
          </Flex>
        </Card>
      </Grid>
    </div>
  );
};
