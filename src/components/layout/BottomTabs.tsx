import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/today", label: "HOME" },
  { to: "/weekly", label: "週間" },
  { to: "/calendar", label: "ToDoカレンダー" },
  { to: "/cities", label: "都市検索" },
];

export default function BottomTabs() {
  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: 60,
        background: "#f8fbff",
        borderTop: "1px solid rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 50,
      }}
    >
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          style={({ isActive }) => ({
            flex: 1,
            textAlign: "center",
            fontSize: 14,
            fontWeight: 700,
            padding: "6px 0",
            color: isActive ? "#1f6fff" : "#1f2530",
            textDecoration: "none",
            borderBottom: isActive ? "3px solid #1f6fff" : "3px solid transparent",
          })}
          end
        >
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}
