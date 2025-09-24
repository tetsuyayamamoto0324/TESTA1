import { Tabs } from "@mantine/core";

export function AppTabs({
  value, onChange,
}: { value: "today"|"weekly"|"calendar"|"settings"; onChange: (v: string | null)=>void }) {
  return (
    <Tabs value={value} onChange={onChange} mt="sm">
      <Tabs.List>
        <Tabs.Tab value="today">Today</Tabs.Tab>
        <Tabs.Tab value="weekly">Weekly</Tabs.Tab>
        <Tabs.Tab value="calendar">ToDoカレンダー</Tabs.Tab>
        <Tabs.Tab value="settings">設定</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}