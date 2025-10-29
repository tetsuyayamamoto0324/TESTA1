// src/pages/Auth/Signup.tsx
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { z } from "zod";
import { Alert, Title } from "@mantine/core";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { useError } from "@/contexts/ErrorContext"; // 修正: 追加
import { normalizeError, messageFor } from "@/lib/appError"; // 修正: 追加

const schema = z.object({
  email: z.string().min(1, "メールは必須です").email("メール形式が不正です"),
  password: z.string().min(6, "6文字以上で入力してください"),
});

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const showError = useError(); // 修正: 追加

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setEmail(v);
    if (submittedOnce) {
      const r = schema.pick({ email: true }).safeParse({ email: v });
      setEmailErr(r.success ? null : r.error.flatten().fieldErrors.email?.[0] ?? null);
    }
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setPassword(v);
    if (submittedOnce) {
      const r = schema.pick({ password: true }).safeParse({ password: v });
      setPasswordErr(r.success ? null : r.error.flatten().fieldErrors.password?.[0] ?? null);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmittedOnce(true);
    setError(null);

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
  const fe = parsed.error.flatten().fieldErrors;
  setEmailErr(fe.email?.[0] ?? null);
  setPasswordErr(fe.password?.[0] ?? null);

  // ▼ この showError は図のフローでは不要なので削除 or コメントアウト
  // showError(new Error(fe.email?.[0] ?? fe.password?.[0] ?? "入力が不正です"), {
  //   title: "入力が正しくありません",
  //   fallbackMessage: "入力の形式が正しくありません。内容をご確認ください。",
  // });

  return;
}
    setEmailErr(null);
    setPasswordErr(null);

    setSubmitting(true);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        const appErr = normalizeError(signUpError); // 修正
        showError(appErr, {
          title: "このメールアドレスは登録済です。", // 修正
          fallbackMessage: messageFor(appErr.kind, appErr.message), // 修正
        });
        setError(signUpError.message);
        return;
      }

      if (signUpData?.session && signUpData.user) {
        setUser({ id: signUpData.user.id, email: signUpData.user.email });
        navigate("/");
        return;
      }

      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        const appErr = normalizeError(signInError); // 修正
        showError(appErr, {
          title: "ログインに失敗しました", // 修正
          fallbackMessage: messageFor(appErr.kind, appErr.message), // 修正
        });
        setError(signInError.message);
        return;
      }
      if (signInData?.user) {
        setUser({ id: signInData.user.id, email: signInData.user.email });
        navigate("/");
        return;
      }

      setError("サインアップは成功しましたが、ログインできませんでした。");
      showError(new Error("サインアップは成功しましたが、ログインできませんでした。"), {
        title: "ログインできませんでした", // 修正
      }); // 修正
    } catch (e: any) {
      const appErr = normalizeError(e); // 修正
      showError(appErr, {
        title: "このメールアドレスは登録済です。", // 修正
        fallbackMessage: messageFor(appErr.kind, appErr.message), // 修正
      });
      setError(appErr.message);
    } finally {
      setSubmitting(false);
    }
  }

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
        <Title order={2} style={{ textAlign: "center", fontWeight: 700, marginBottom: 28 }}>
          新規登録
        </Title>
        <Title
          order={5}
          style={{
            textAlign: "center",
            color: "var(--mantine-color-dimmed)",
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          メールアドレスで登録
        </Title>

        {error && (
          <Alert color="red" style={{ maxWidth: 520, margin: "0 auto 12px" }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ maxWidth: 520, margin: "0 auto" }}>
          {/* メール */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #000",
              boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
              padding: "10px 14px",
              width: "100%",
              marginTop: 18,
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="メールアドレス"
              autoComplete="email"
              aria-label="メールアドレス"
              value={email}
              onChange={onChangeEmail}
              required
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 16,
              }}
            />
          </div>
          {emailErr && (
            <div style={{ color: "#e03131", fontSize: 13, marginTop: 6 }}>{emailErr}</div>
          )}

          {/* パスワード */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #000",
              boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
              padding: "10px 14px",
              width: "100%",
              marginTop: 24,
            }}
          >
            <input
              type="password"
              name="password"
              placeholder="パスワード"
              autoComplete="new-password"
              aria-label="パスワード"
              value={password}
              onChange={onChangePassword}
              required
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "透明",
                fontSize: 16,
              }}
            />
          </div>
          {passwordErr && (
            <div style={{ color: "#e03131", fontSize: 13, marginTop: 6 }}>{passwordErr}</div>
          )}

          {/* 送信ボタン */}
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
            <span style={linkLabelStyle}>新規登録</span>
          </button>
        </form>

        <div style={{ marginTop: 28 }}>
          <Link to="/login" style={linkBtnStyle}>
            <span style={linkLabelStyle}>ログインへ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
