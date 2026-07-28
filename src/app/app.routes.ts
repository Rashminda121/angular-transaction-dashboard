import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Home } from './features/home/home';
import { NotFound } from './features/not-found/not-found';
import { TransactionDetail } from './features/transactions/transaction-detail/transaction-detail';

/**
 * Application routing configuration.
 * Defines routes for all features and a wildcard fallback route.
 * Routes:
 * - '' (root): Home component
 * - 'dashboard': Dashboard component
 * - 'transactions': Transaction list component
 * - 'transactions/:id': Transaction detail component
 * - '**': Not found component (fallback)
 */
export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transactions/transaction-list/transaction-list').then(
        (m) => m.TransactionList,
      ),
  },
  {
    path: 'transactions/:id',
    component: TransactionDetail,
  },
  {
    path: '**',
    component: NotFound,
  },
];
