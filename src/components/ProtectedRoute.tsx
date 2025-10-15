import { Outlet } from "react-router-dom";
import BottomTabs from "@/components/BottomTabs";

export default function ProtectedLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#E6F7FF",
        paddingBottom: 72, // タブに隠れない余白
      }}
    >
      <Outlet />
      <BottomTabs />
    </div>
  );
}
