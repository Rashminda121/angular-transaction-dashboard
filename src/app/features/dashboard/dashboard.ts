import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Icons } from '@shared/icons/icons';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { NgxEchartsDirective } from 'ngx-echarts';
import { Transaction } from '../transactions/models/transaction';
import { TransactionService } from '../transactions/services/transaction-service';
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

interface StatusSummary {
  status: string;
  count: number;
  percentage: number;
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
  imports: [LucideAngularModule, RouterLink, CommonModule, KpiCards, NgxEchartsDirective],
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

  /**
   * Number of transactions grouped by month
   */
  readonly transactionsPerMonth = computed(() => {
    const monthCounts = new Map<string, number>();

    for (const transaction of this.transactions()) {
      const month = new Intl.DateTimeFormat('en', {
        month: 'short',
        year: 'numeric',
      }).format(transaction.submitDate);

      monthCounts.set(month, (monthCounts.get(month) ?? 0) + 1);
    }

    return [...monthCounts.entries()]
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  });

  /**
   * Breakdown of transactions by status
   * - Groups transactions by status
   * - Calculates percentage of total for each status
   * - Sorts in descending order by count
   */

  readonly statusBreakdown = computed<StatusSummary[]>(() => {
    const statusCounts = new Map<string, number>();

    for (const transaction of this.transactions()) {
      const status = transaction.status;

      statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
    }

    const total = this.totalTransactions();

    return [...statusCounts.entries()]
      .map(([status, count]) => ({
        status,
        count,
        percentage: total === 0 ? 0 : (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  });

  /**
   * Signal to hold the currently selected month for filtering transactions
   * - Format: 'YYYY-MM'
   * - Used to filter transactions displayed in the "Transactions Over Time" chart
   */

  readonly selectedMonth = signal('');

  readonly filteredTransactions = computed(() => {
    const selectedMonth = this.selectedMonth();

    if (!selectedMonth) {
      return this.transactions();
    }

    const [year, month] = selectedMonth.split('-').map(Number);

    return this.transactions().filter((transaction) => {
      const submitDate = transaction.submitDate;

      return submitDate.getFullYear() === year && submitDate.getMonth() === month - 1;
    });
  });

  onMonthChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedMonth.set(input.value);
  }

  /**
   * Number of transactions grouped by date
   * - Groups transactions by submission date
   * - Sorts in ascending order by date
   */

  readonly transactionsOverTime = computed(() => {
    const dateCounts = new Map<string, number>();

    for (const transaction of this.filteredTransactions()) {
      const date = new Intl.DateTimeFormat('en-CA').format(transaction.submitDate);

      dateCounts.set(date, (dateCounts.get(date) ?? 0) + 1);
    }

    return [...dateCounts.entries()]
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  /**
   * Top countries ranked by transaction count.
   * Returns up to the top 10 countries for use in a horizontal bar chart.
   */
  readonly countryTransactionCounts = computed<CountrySummary[]>(() => {
    const countryCounts = new Map<string, number>();

    for (const transaction of this.transactions()) {
      const country = transaction.country.trim();

      countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
    }

    return [...countryCounts.entries()]
      .map(([country, count]) => ({
        country,
        count,
      }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }

        return a.country.localeCompare(b.country);
      })
      .slice(0, 10);
  });

  /**
   * Chart options for displaying transactions per month in a bar chart.
   * Configures axes, tooltips, and series data based on the computed transactionsPerMonth signal.
   */

  readonly transactionsPerMonthChartOptions = computed(() => ({
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: this.transactionsPerMonth().map((item) => item.month),
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Transactions',
    },
    series: [
      {
        name: 'Transactions',
        type: 'bar',
        data: this.transactionsPerMonth().map((item) => item.count),
        barWidth: '50%',
        itemStyle: {
          color: '#3B82F6',
          borderRadius: [8, 8, 0, 0],
        },
      },
    ],
  }));

  /**
   * Chart options for displaying the breakdown of transactions by status in a pie chart.
   * Configures tooltips, legend, and series data based on the computed statusBreakdown signal.
   */

  readonly statusBreakdownChartOptions = computed(() => ({
    tooltip: {
      trigger: 'item',
      formatter: ({ name, value, percent }: { name: string; value: number; percent: number }) =>
        `${name}<br/>${value} transactions (${percent}%)`,
    },
    legend: {
      bottom: 0,
      left: 'center',
    },
    series: [
      {
        name: 'Transactions',
        type: 'pie',
        radius: ['55%', '75%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{d}%',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        data: this.statusBreakdown().map((item) => ({
          name: item.status,
          value: item.count,
        })),
      },
    ],
  }));

  /**
   * Chart options for displaying the number of transactions over time in a line chart.
   * Configures axes, tooltips, and series data based on the computed transactionsOverTime signal.
   */

  readonly transactionsOverTimeChartOptions = computed(() => ({
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: this.transactionsOverTime().map((item) => item.date),
      boundaryGap: false,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Transactions',
      minInterval: 1,
    },
    series: [
      {
        name: 'Transactions',
        type: 'line',
        smooth: true,
        data: this.transactionsOverTime().map((item) => item.count),
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: {},
        lineStyle: {
          color: '#14B8A6',
          width: 3,
        },
        itemStyle: {
          color: '#14B8A6',
        },
      },
    ],
  }));

  /**
   * Chart options for displaying the top countries by transaction count in a horizontal bar chart.
   * Configures axes, tooltips, and series data based on the computed countryTransactionCounts signal.
   */

  readonly topCountriesChartOptions = computed(() => {
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Emerald
      '#F59E0B', // Amber
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#EC4899', // Pink
      '#14B8A6', // Teal
      '#F97316', // Orange
      '#6366F1', // Indigo
    ];

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '5%',
        right: '5%',
        top: '3%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: 'Transactions',
        minInterval: 1,
      },
      yAxis: {
        type: 'category',
        data: this.countryTransactionCounts().map((item) => item.country),
        inverse: true,
      },
      series: [
        {
          name: 'Transactions',
          type: 'bar',
          barWidth: '55%',
          data: this.countryTransactionCounts().map((item, index) => ({
            value: item.count,
            itemStyle: {
              color: colors[index % colors.length],
              borderRadius: [0, 8, 8, 0],
            },
          })),
          label: {
            show: true,
            position: 'right',
          },
        },
      ],
    };
  });

  /**
   * Dashboard cards for quick access to transaction summaries.
   * Each card displays a title, value, description, icon, and navigation route.
   */

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
