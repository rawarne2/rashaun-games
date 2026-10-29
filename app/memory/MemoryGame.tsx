"use client";

import { ConfigProvider, theme } from "antd";
import MemoryApp from "@/app/games/memory/_src/src/App";

// Match antd components to the site-wide dark palette in app/globals.css.
const memoryTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#2563eb",
    colorSuccess: "#2fae6a",
    colorWarning: "#f97316",
    colorError: "#d93f45",
    colorBgBase: "#0f1420",
    colorBgContainer: "#232c42",
    colorBgElevated: "#1a2133",
    colorBorder: "#3a4560",
    colorBorderSecondary: "#2a3348",
    colorText: "#e6e9f0",
    colorTextSecondary: "#8b93a7",
    borderRadius: 8,
    fontFamily: "var(--font-nunito), ui-sans-serif, system-ui, sans-serif",
  },
};

export function MemoryGame() {
  return (
    <ConfigProvider theme={memoryTheme}>
      <MemoryApp />
    </ConfigProvider>
  );
}
