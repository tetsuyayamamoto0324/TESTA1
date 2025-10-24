import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import { ErrorProvider } from "@/contexts/ErrorContext"; // パスはあなたの構成に合わせて

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorProvider>
      <App />
    </ErrorProvider>
  </React.StrictMode>
);