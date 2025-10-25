// src/App.tsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider, AppShell } from "@mantine/core";

import { useAuth } from "./store/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Today from "./pages/Today";
import Weekly from "./pages/Weekly";
import CalendarTodo from "./pages/CalendarTodo";
import CitySearch from "./pages/CitySearch";

export default function App() {
  const { init } = useAuth();

  useEffect(() => {
    // Supabaseのセッション初期化＆リスナー登録
    init();
    // Zustandの関数参照は安定している想定。lintを黙らせるなら↓を有効化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MantineProvider>
      <BrowserRouter>
        <AppShell header={{ height: 0 }} padding="md">
          <Routes>
            {/* 認証が必要なルート */}
            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedLayout />}>
                <Route path="/" element={<Today />} />
                <Route path="/today" element={<Today />} />
                <Route path="/weekly" element={<Weekly />} />
                <Route path="/calendar" element={<CalendarTodo />} />
                <Route path="/cities" element={<CitySearch />} />
                <Route path="/city" element={<CitySearch />} />
              </Route>
            </Route>

            {/* 非ログイン時のみ表示するルート */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 不明URLはホームへリダイレクト */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </MantineProvider>
  );
}
