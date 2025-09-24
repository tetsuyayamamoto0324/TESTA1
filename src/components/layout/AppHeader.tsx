import { Group, Button, Text } from "@mantine/core";

export function AppHeader({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Group justify="space-between" p="md">
      <Text fw={700}>Tokyo</Text>
      <Button onClick={onRefresh} variant="light">再取得</Button>
    </Group>
  );
}