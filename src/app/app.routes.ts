import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Home } from './features/home/home';
import { NotFound } from './features/not-found/not-found';
import { TransactionDetail } from './features/transactions/transaction-detail/transaction-detail';
import { TransactionList } from './features/transactions/transaction-list/transaction-list';

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
