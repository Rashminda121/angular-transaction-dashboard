import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { Transaction } from '../models/transaction';
import { TransactionService } from '../services/transaction-service';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Icons } from '@shared/icons/icons';

type SortColumn = 'transactionId' | 'currency' | 'status' | 'submitDate' | 'country';

type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList {
  private readonly transactionService = inject(TransactionService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  readonly queryParams = toSignal(this.route.queryParamMap);

  protected readonly Icons = Icons;

  constructor() {
    effect(() => {
      const params = this.queryParams();

      if (!params) {
        return;
      }

      this.currentPage = Number(params.get('page') ?? 1);

      this.transactionIdSearch = params.get('transactionId') ?? '';

      this.selectedCurrency = params.get('currency') ?? '';

      this.selectedCountry = params.get('country') ?? '';

      this.fromDate = params.get('fromDate') ?? '';

      this.toDate = params.get('toDate') ?? '';

      this.selectedStatuses = params.get('statuses') ? params.get('statuses')!.split(',') : [];
    });
  }

  readonly transactions = toSignal(this.transactionService.getTransactions(), {
    initialValue: [] as Transaction[],
  });

  // -------------------------
  // Pagination
  // -------------------------

  readonly pageSizes = [25, 50, 100];

  pageSize = 25;

  currentPage = 1;

  // -------------------------
  // Filters
  // -------------------------

  transactionIdSearch = '';

  selectedStatuses: string[] = [];

  selectedCurrency = '';

  selectedCountry = '';

  fromDate = '';

  toDate = '';

  // -------------------------
  // Sorting
  // -------------------------

  sortColumn: SortColumn = 'submitDate';

  sortDirection: SortDirection = 'desc';

  // -------------------------
  // Dropdown data
  // -------------------------

  get statuses(): string[] {
    return [...new Set(this.transactions().map((t) => t.status))].sort();
  }

  get currencies(): string[] {
    return [...new Set(this.transactions().map((t) => t.currency))].sort();
  }

  get countries(): string[] {
    return [...new Set(this.transactions().map((t) => t.country))].sort();
  }

  // -------------------------
  // Status Dropdown
  // -------------------------

  statusDropdownOpen = false;

  // -------------------------
  // Filtering
  // -------------------------

  get filteredTransactions(): Transaction[] {
    return this.transactions().filter((transaction) => {
      const matchesId = transaction.transactionId
        .toLowerCase()
        .includes(this.transactionIdSearch.toLowerCase());

      const matchesStatus =
        this.selectedStatuses.length === 0 || this.selectedStatuses.includes(transaction.status);

      const matchesCurrency =
        !this.selectedCurrency || transaction.currency === this.selectedCurrency;

      const matchesCountry = !this.selectedCountry || transaction.country === this.selectedCountry;

      const transactionDate = new Date(transaction.submitDate);

      const matchesFromDate = !this.fromDate || transactionDate >= new Date(this.fromDate);

      const matchesToDate = !this.toDate || transactionDate <= new Date(this.toDate);

      return (
        matchesId &&
        matchesStatus &&
        matchesCurrency &&
        matchesCountry &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }

  // -------------------------
  // Sorting
  // -------------------------

  get sortedTransactions(): Transaction[] {
    return [...this.filteredTransactions].sort((a, b) => {
      let valueA: any = a[this.sortColumn];
      let valueB: any = b[this.sortColumn];

      if (valueA instanceof Date) {
        valueA = valueA.getTime();
        valueB = valueB.getTime();
      }

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }

      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }

  // -------------------------
  // Pagination
  // -------------------------

  get totalRecords(): number {
    return this.filteredTransactions.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
  }

  get pagedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.sortedTransactions.slice(start, start + this.pageSize);
  }

  // -------------------------
  // Actions
  // -------------------------

  changePageSize(size: string): void {
    this.pageSize = Number(size);

    this.currentPage = 1;
  }

  previousPage(): void {
    this.statusDropdownOpen = false;

    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateQueryParams();
    }
  }

  nextPage(): void {
    this.statusDropdownOpen = false;

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateQueryParams();
    }
  }

  sort(column: SortColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;

      this.sortDirection = 'asc';
    }
  }

  toggleStatus(status: string): void {
    if (this.selectedStatuses.includes(status)) {
      this.selectedStatuses = this.selectedStatuses.filter((s) => s !== status);
    } else {
      this.selectedStatuses = [...this.selectedStatuses, status];
    }

    this.currentPage = 1;
    this.updateQueryParams();
  }

  /**
   * Opens or closes the status dropdown.
   */
  toggleStatusDropdown(): void {
    this.statusDropdownOpen = !this.statusDropdownOpen;
  }

  /**
   * Closes the status dropdown.
   */
  closeStatusDropdown(): void {
    this.statusDropdownOpen = false;
  }

  /**
   * Text displayed in the dropdown button.
   */
  get selectedStatusText(): string {
    if (this.selectedStatuses.length === 0) {
      return 'All Statuses';
    }

    if (this.selectedStatuses.length === 1) {
      return this.selectedStatuses[0];
    }

    return `${this.selectedStatuses.length} selected`;
  }

  // -------------------------
  // Clear Filters
  // -------------------------

  clearFilters(): void {
    this.transactionIdSearch = '';

    this.selectedStatuses = [];

    this.selectedCurrency = '';

    this.selectedCountry = '';

    this.fromDate = '';

    this.toDate = '';

    this.statusDropdownOpen = false;

    this.pageSize = this.pageSizes[0];

    this.currentPage = 1;

    this.updateQueryParams();
  }

  // -------------------------
  // Navigation - View Transaction
  // -------------------------

  viewTransaction(id: string): void {
    this.router.navigate(['/transactions', id], {
      queryParams: {
        page: this.currentPage,
        transactionId: this.transactionIdSearch || null,
        currency: this.selectedCurrency || null,
        country: this.selectedCountry || null,
        fromDate: this.fromDate || null,
        toDate: this.toDate || null,
        statuses: this.selectedStatuses.length > 0 ? this.selectedStatuses.join(',') : null,
      },
    });
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        transactionId: this.transactionIdSearch || null,
        currency: this.selectedCurrency || null,
        country: this.selectedCountry || null,
        fromDate: this.fromDate || null,
        toDate: this.toDate || null,
        statuses: this.selectedStatuses.length ? this.selectedStatuses.join(',') : null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
