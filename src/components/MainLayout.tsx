import { AppShell, Group, Button, Tabs, Text } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { supabase } from "@/lib/supabase";

const tabs = [
  { value: "/today",    label: "今日" },
  { value: "/weekly",   label: "週間" },
  { value: "/calendar", label: "カレンダー" },
  { value: "/settings", label: "設定" },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, setUser } = useAuth();

  // 現在のパスをタブの value にする
  const current = tabs.some(t => loc.pathname.startsWith(t.value))
    ? tabs.find(t => loc.pathname.startsWith(t.value))!.value
    : "/today";

  const onTabChange = (v: string | null) => {
    if (v) nav(v);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    nav("/login", { replace: true });
  };

  return (
    <AppShell
      header={{ height: 64 }}
      padding="0"
      withBorder
      styles={{
        main: { backgroundColor: "#E6F7FF", minHeight: "100vh" },
      }}
    >
      <AppShell.Header>
        <Group justify="space-between" px="md" h="100%">
          <Text fw={700}>天気ライフプランナー</Text>
          <Group gap="sm">
            <Text size="sm">{user?.email}</Text>
            <Button variant="light" onClick={logout}>ログアウト</Button>
          </Group>
        </Group>
        <Tabs value={current} onChange={onTabChange} variant="outline" keepMounted={false} px="md" mb="sm">
          <Tabs.List>
            {tabs.map(t => (
              <Tabs.Tab key={t.value} value={t.value}>{t.label}</Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
