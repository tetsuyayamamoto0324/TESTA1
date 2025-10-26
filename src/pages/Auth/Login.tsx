// src/pages/Auth/Login.tsx
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { z } from "zod";
import { Alert, Title, Stack } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { useError } from "@/contexts/ErrorContext"; // 修正: 追加
import { normalizeError, messageFor } from "@/lib/appError"; // 修正: 追加

const schema = z.object({
  email: z.string().min(1, "メールは必須です").email("メール形式が不正です"),
  password: z.string().min(6, "6文字以上で入力してください"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const showError = useError(); // 修正: 追加

  const form = useForm<FormValues>({
    initialValues: { email: "", password: "" },
    validate: zodResolver(schema),
  });

  const linkBtnStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    background: "transparent",
    border: "none",
    padding: "8px 0",
    cursor: "pointer",
    textDecoration: "none",
  };
  const linkLabelStyle: React.CSSProperties = {
    display: "block",
    textAlign: "center",
    fontSize: 28,
    fontWeight: 700,
    color: "#1f6fff",
  };

  const onSubmit = form.onSubmit(async (values) => {
    setError(null);
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      console.log("Supabase auth result:", { data, error });

      if (error) {
        // グローバルモーダルも出す
        const appErr = normalizeError(error); // 修正
        showError(appErr, {
          title: "ログインに失敗しました", // 修正
          fallbackMessage: messageFor(appErr.kind, appErr.message), // 修正
        });
        setError(error.message); // 画面内のAlertも残す場合
        return;
      }

      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
        const to = (location.state as any)?.from?.pathname ?? "/today";
        navigate(to, { replace: true });
      }
    } catch (e) {
      // fetch失敗など
      const appErr = normalizeError(e); // 修正
      showError(appErr, {
        title: "ログインに失敗しました", // 修正
        fallbackMessage: messageFor(appErr.kind, appErr.message), // 修正
      });
      setError(appErr.message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#E6F7FF",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <div style={{ width: "100%", maxWidth: 520 }}>
        <Title order={2} ta="center" fw={700} mb={28}>
          ログイン
        </Title>
        <Title order={5} ta="center" c="dimmed" fw={600} mb={20}>
          メールアドレスでログイン
        </Title>

        {error && (
          <Alert color="red" mb="sm" style={{ maxWidth: 520, margin: "0 auto" }}>
            {error}
          </Alert>
        )}

        <form onSubmit={onSubmit} style={{ maxWidth: 520, margin: "0 auto" }}>
          <Stack gap={24}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #000",
                boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
                padding: "10px 14px",
                width: "100%",
              }}
            >
              <input
                name="email"
                type="email"
                placeholder="メールアドレス"
                autoComplete="email"
                style={{
                  WebkitBoxShadow: "0 0 0px 1000px #fff inset",
                  WebkitTextFillColor: "#000",
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 16,
                }}
                {...form.getInputProps("email")}
              />
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #000",
                boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
                padding: "10px 14px",
                width: "100%",
              }}
            >
              <input
                name="password"
                type="password"
                placeholder="パスワード"
                autoComplete="current-password"
                style={{
                  WebkitBoxShadow: "0 0 0px 1000px #fff inset",
                  WebkitTextFillColor: "#000",
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 16,
                }}
                {...form.getInputProps("password")}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...linkBtnStyle,
                marginTop: 16,
                opacity: submitting ? 0.5 : 1,
                pointerEvents: submitting ? "none" : "auto",
              }}
            >
              <span style={linkLabelStyle}>ログイン</span>
            </button>
          </Stack>
        </form>

        <div style={{ marginTop: 28 }}>
          <Link to="/signup" style={linkBtnStyle}>
            <span style={linkLabelStyle}>新規登録へ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
