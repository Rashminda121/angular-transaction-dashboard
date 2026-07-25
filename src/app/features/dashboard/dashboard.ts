import { Component, computed, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Icons } from '@shared/icons/icons';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../transactions/services/transaction-service';
import { Transaction } from '../transactions/models/transaction';
import { LucideIconData } from 'lucide-angular';
import { KpiCards } from './components/kpi-cards/kpi-cards';

/**
 * Represents a summary of transactions by country
 */
interface CountrySummary {
  country: string;
  count: number;
}

/**
 * Represents a summary of transactions by currency with percentage distribution
 */
interface CurrencySummary {
  currency: string;
  count: number;
  percentage: number;
}

interface DashboardCard {
  title: string;
  value: number;
  description: string;
  valueClass: string;
  icon: LucideIconData;
  route: string;
  queryParams?: Record<string, string>;
}

/**
 * Dashboard Component
 *
 * Displays an overview of transaction data including:
 * - Total transaction counts by status
 * - Top 5 countries by transaction volume
 * - Currency distribution across all transactions
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LucideAngularModule, RouterLink, CommonModule, KpiCards],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly Icons = Icons;

  /** Service for fetching transaction data */
  private readonly transactionService = inject(TransactionService);

  /**
   * Signal containing all transactions from the service
   * Converts the Observable stream to a reactive signal
   */
  readonly transactions = toSignal(this.transactionService.getTransactions(), {
    initialValue: [] as Transaction[],
  });

  /** Total number of all transactions */
  readonly totalTransactions = computed(() => this.transactions().length);

  /** Count of transactions with 'completed' status */
  readonly completedTransactions = computed(
    () =>
      this.transactions().filter((transaction) => transaction.status.toLowerCase() === 'completed')
        .length,
  );

  /** Count of transactions with 'pending' status */
  readonly pendingTransactions = computed(
    () =>
      this.transactions().filter((transaction) => transaction.status.toLowerCase() === 'pending')
        .length,
  );

  /** Count of transactions with 'failed' status */
  readonly failedTransactions = computed(
    () =>
      this.transactions().filter((transaction) => transaction.status.toLowerCase() === 'failed')
        .length,
  );

  /** Count of transactions with any status other than completed, pending, or failed */
  readonly otherTransactions = computed(
    () =>
      this.transactions().filter((transaction) => {
        const status = transaction.status.toLowerCase();

        return status !== 'completed' && status !== 'pending' && status !== 'failed';
      }).length,
  );

  /**
   * Top 5 countries by transaction count
   * - Aggregates transactions by country
   * - Sorts in descending order by count
   * - Returns only the top 5 countries
   */
  readonly topCountries = computed<CountrySummary[]>(() => {
    const countryCounts = new Map<string, number>();

    for (const transaction of this.transactions()) {
      countryCounts.set(transaction.country, (countryCounts.get(transaction.country) ?? 0) + 1);
    }

    return [...countryCounts.entries()]
      .map(([country, count]) => ({
        country,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  /**
   * Currency distribution across all transactions
   * - Groups transactions by currency
   * - Calculates percentage of total for each currency
   * - Sorts in descending order by count
   */
  readonly currencyDistribution = computed<CurrencySummary[]>(() => {
    const currencyCounts = new Map<string, number>();

    for (const transaction of this.transactions()) {
      currencyCounts.set(transaction.currency, (currencyCounts.get(transaction.currency) ?? 0) + 1);
    }

    const total = this.totalTransactions();

    return [...currencyCounts.entries()]
      .map(([currency, count]) => ({
        currency,
        count,
        percentage: total === 0 ? 0 : (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  });

  readonly cards = computed<DashboardCard[]>(() => [
    {
      title: 'Total Transactions',
      value: this.totalTransactions(),
      description: 'All recorded transactions',
      valueClass: 'text-slate-900',
      icon: this.Icons.ReceiptText,
      route: '/transactions',
    },
    {
      title: 'Completed',
      value: this.completedTransactions(),
      description: 'Successfully completed',
      valueClass: 'text-emerald-600',
      icon: this.Icons.CircleCheckBig,
      route: '/transactions',
      queryParams: {
        statuses: 'Completed',
      },
    },
    {
      title: 'Pending',
      value: this.pendingTransactions(),
      description: 'Awaiting processing',
      valueClass: 'text-amber-500',
      icon: this.Icons.Clock3,
      route: '/transactions',
      queryParams: {
        statuses: 'Pending',
      },
    },
    {
      title: 'Failed',
      value: this.failedTransactions(),
      description: 'Requires attention',
      valueClass: 'text-red-500',
      icon: this.Icons.CircleX,
      route: '/transactions',
      queryParams: {
        statuses: 'Failed',
      },
    },
    {
      title: 'Others',
      value: this.otherTransactions(),
      description: 'Miscellaneous statuses',
      valueClass: 'text-slate-700',
      icon: this.Icons.Ellipsis,
      route: '/transactions',
      queryParams: {
        statuses: 'Cancelled,Refunded,Processing',
      },
    },
  ]);
}
