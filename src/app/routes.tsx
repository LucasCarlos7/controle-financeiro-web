import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { AccountsPage } from '../features/accounts/AccountsPage';
import { CategoriesPage } from '../features/categories/CategoriesPage';
import { BudgetsPage } from '../features/budgets/BudgetsPage';
import { GoalsPage } from '../features/goals/GoalsPage';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { AppShell } from '../shared/layout/AppShell';
import { Page } from '../shared/layout/Page';
import { Spinner } from '../shared/components/ui/Spinner';

const TransactionsPage = lazy(() =>
  import('../features/transactions/TransactionsPage').then((module) => ({ default: module.TransactionsPage })),
);

const DashboardPage = lazy(() =>
  import('../features/dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registrar" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Page width="full">
                <Suspense fallback={<Spinner label="Carregando painel..." />}>
                  <DashboardPage />
                </Suspense>
              </Page>
            }
          />
          <Route
            path="/extrato"
            element={
              <Page width="full">
                <Suspense fallback={<Spinner label="Carregando extrato..." />}>
                  <TransactionsPage />
                </Suspense>
              </Page>
            }
          />
          <Route
            path="/contas"
            element={
              <Page>
                <AccountsPage />
              </Page>
            }
          />
          <Route
            path="/categorias"
            element={
              <Page>
                <CategoriesPage />
              </Page>
            }
          />
          <Route
            path="/orcamentos"
            element={
              <Page>
                <BudgetsPage />
              </Page>
            }
          />
          <Route
            path="/objetivos"
            element={
              <Page>
                <GoalsPage />
              </Page>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
