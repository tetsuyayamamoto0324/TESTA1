// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 認証状態の初期読込中（Supabaseセッション確認中）は一旦なにも描画しない
  if (loading) return null; // ここをローディングUIにしてもOK

  // 未ログインなら /login へ強制遷移（元ページ情報も渡す）
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ログイン済みなら子ルートを表示
  return <Outlet />;
}
