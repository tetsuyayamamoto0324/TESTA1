// src/store/auth.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

type UserLite = { id: string; email: string | null };
type AuthState = {
  user: UserLite | null;
  loading: boolean;
  setUser: (u: UserLite | null) => void;
  setLoading: (v: boolean) => void;
  /** 初期化（現在のセッション取得＋変更を購読） */
  init: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (u) => set({ user: u }),
  setLoading: (v) => set({ loading: v }),
  init: () => {
    // ① 現在のセッションを反映
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      set({
        user: s?.user ? { id: s.user.id, email: s.user.email } : null,
        loading: false,
      });
    });

    // ② 以降のログイン/ログアウトを監視
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, session) => {
      set({
        user: session?.user
          ? { id: session.user.id, email: session.user.email }
          : null,
      });
    });

    // 返り値は不要（Zustand なので破棄はアプリ終了時）
  },
}));
