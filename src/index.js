import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss"; // 기존 index.css → index.scss 로 변경!

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found!");
}
