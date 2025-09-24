import { useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Paper, Stack, Title, TextInput, PasswordInput, Button, Alert, Text, Center,
} from "@mantine/core";
import { AlertCircle } from "lucide-react";

// 簡易バリデーション（zodなし版）
const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // フロント側の軽い検証
    if (!isEmail(email)) return setError("メールアドレスの形式が正しくありません。");
    if (password.length < 6) return setError("パスワードは6文字以上を入力してください。");

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      setError(error.message || "ログインに失敗しました。");
      return;
    }
    // 成功時：App側の auth 監視で画面遷移（またはここで任意に遷移）
  };

  return (
    <Center mih="100dvh">
      <Paper w={360} p="lg" radius="md" withBorder style={{ background: "#E6F8FF" }}>
        <form onSubmit={onSubmit}>
          <Stack gap="md">
            <Title order={3} ta="center">ログイン</Title>
            <Text ta="center" c="dimmed" size="sm">メールアドレスでログイン</Text>

            {error && (
              <Alert variant="light" color="red" icon={<AlertCircle size={16} />}>
                {error}
              </Alert>
            )}

            <TextInput
              label="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
              placeholder="you@example.com"
            />

            <PasswordInput
              label="パスワード"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
              placeholder="6文字以上"
            />

            <Button type="submit" loading={submitting}>
              ログイン
            </Button>

            <Text ta="center" size="sm" c="blue" style={{ cursor: "pointer" }}>
              アカウント作成へ
            </Text>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}