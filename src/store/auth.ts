// src/store/auth.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

type UserLite = { id: string; email: string | null };

type AuthState = {
  user: UserLite | null;
  loading: boolean;
  setUser: (u: UserLite | null) => void;
  setLoading: (v: boolean) => void;
  /** 現在のセッションを反映 & 以降の変化を購読 */
  init: () => void;
  /** ログアウト */
  signOut: () => Promise<void>;
};

export const useAuth = create<AuthState>()((set) => ({
  user: null,
  loading: true,

  setUser: (u) => set({ user: u }),
  setLoading: (v) => set({ loading: v }),

  init: () => {
    // ① 起動時のセッションを反映
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      set({
        user: s?.user ? { id: s.user.id, email: s.user.email } : null,
        loading: false,
      });
    });

    // ② ログイン/ログアウトの変化を反映
    supabase.auth.onAuthStateChange((_ev, session) => {
      set({
        user: session?.user
          ? { id: session.user.id, email: session.user.email }
          : null,
      });
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
