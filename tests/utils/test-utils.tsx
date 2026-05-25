import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { LanguageProvider } from "../../src/contexts/LanguageContext";
import { ToastProvider } from "../../src/contexts/ToastContext";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { HealthDataProvider } from "../../src/contexts/HealthDataContext";

const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <HealthDataProvider>{children}</HealthDataProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };