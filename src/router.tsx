import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/cadastro", element: <SignupPage /> },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "transacoes", element: <TransactionsPage /> },
      { path: "categorias", element: <CategoriesPage /> },
      { path: "relatorios", element: <ReportsPage /> },
      { path: "configuracoes", element: <SettingsPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);