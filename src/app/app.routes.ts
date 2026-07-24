import { NotFound } from './features/not-found/not-found';
import { TransactionList } from './features/transactions/transaction-list/transaction-list';
import { Dashboard } from './features/dashboard/dashboard';
import { TransactionDetail } from './features/transactions/transaction-detail/transaction-detail';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'transactions',
    component: TransactionList,
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
