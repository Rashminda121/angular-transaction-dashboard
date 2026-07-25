import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { Transaction } from '../models/transaction';
import { TransactionService } from '../services/transaction-service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Icons } from '@shared/icons/icons';

/** Defines the columns that transactions can be sorted by */
type SortColumn = 'transactionId' | 'currency' | 'status' | 'submitDate' | 'country';

/** Sort direction for transaction list */
type SortDirection = 'asc' | 'desc';

/**
 * Transaction List Component
 *
 * Displays a paginated, filterable, and sortable list of transactions.
 * Features include:
 * - Filter by transaction ID, status, currency, country, and date range
 * - Sort by any column (ID, currency, status, submit date, country)
 * - Pagination with customizable page size
 * - Status dropdown for multi-select filtering
 * - URL query parameter persistence for filter state
 */
@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList {
  /** Service for fetching transaction data */
  private readonly transactionService = inject(TransactionService);

  /** Router for navigation */
  private readonly router = inject(Router);

  /** Activated route for accessing query parameters */
  private readonly route = inject(ActivatedRoute);

  /** Signal containing current query parameters from URL */
  readonly queryParams = toSignal(this.route.queryParamMap);

  /** Icon references for UI elements */
  protected readonly Icons = Icons;

  /**
   * Constructor initializes an effect that syncs URL query parameters
   * to component properties (filters, pagination, sorting)
   */
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

  /** Signal containing all transactions from the service */
  readonly transactions = toSignal(this.transactionService.getTransactions(), {
    initialValue: [] as Transaction[],
  });

  // =============================
  // PAGINATION
  // =============================

  /** Available page size options */
  readonly pageSizes = [25, 50, 100];

  /** Current number of records per page */
  pageSize = 25;

  /** Current page number (1-indexed) */
  currentPage = 1;

  // =============================
  // FILTERS
  // =============================

  /** Text search filter for transaction IDs */
  transactionIdSearch = '';

  /** Selected transaction statuses for filtering (multi-select) */
  selectedStatuses: string[] = [];

  /** Selected currency for filtering */
  selectedCurrency = '';

  /** Selected country for filtering */
  selectedCountry = '';

  /** Start date for filtering transaction dates */
  fromDate = '';

  /** End date for filtering transaction dates */
  toDate = '';

  // =============================
  // SORTING
  // =============================

  /** Column currently being sorted by (default: submit date) */
  sortColumn: SortColumn = 'submitDate';

  /** Direction of current sort (default: descending) */
  sortDirection: SortDirection = 'desc';

  // =============================
  // DROPDOWN DATA
  // =============================

  /** Unique list of all available transaction statuses */
  get statuses(): string[] {
    return [...new Set(this.transactions().map((t) => t.status))].sort();
  }

  /** Unique list of all available currencies */
  get currencies(): string[] {
    return [...new Set(this.transactions().map((t) => t.currency))].sort();
  }

  /** Unique list of all available countries */
  get countries(): string[] {
    return [...new Set(this.transactions().map((t) => t.country))].sort();
  }

  // =============================
  // STATUS DROPDOWN STATE
  // =============================

  /** Tracks whether the status filter dropdown is open */
  statusDropdownOpen = false;

  // =============================
  // FILTERING
  // =============================

  /**
   * Computed list of all filtered transactions.
   * Applies all active filter criteria (search, status, currency, country, date range).
   * @readonly
   * @computed
   */
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

  // =============================
  // SORTING
  // =============================

  /**
   * Computed list of filtered and sorted transactions.
   * Applies current sort column and direction to the filtered results.
   * Handles special cases for Date and String comparisons.
   * @readonly
   * @computed
   */
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

  // =============================
  // PAGINATION CALCULATIONS
  // =============================

  /** Total number of records that match the current filters */
  get totalRecords(): number {
    return this.filteredTransactions.length;
  }

  /** Total number of pages based on filtered records and current page size */
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
  }

  /** Returns the subset of sorted transactions for the current page */
  get pagedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.sortedTransactions.slice(start, start + this.pageSize);
  }

  // =============================
  // USER ACTIONS
  // =============================

  /**
   * Updates current page and synchronizes changes to the URL.
   * Resets pagination when filters or sort changes.
   * @param size The new page size as a string (will be converted to number)
   */
  changePageSize(size: string): void {
    this.pageSize = Number(size);

    this.currentPage = 1;
  }

  /**
   * Navigates to the previous page if available.
   * Closes the status dropdown and updates query parameters.
   * Does nothing if already on the first page.
   */
  previousPage(): void {
    this.statusDropdownOpen = false;

    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateQueryParams();
    }
  }

  /**
   * Navigates to the next page if available.
   * Closes the status dropdown and updates query parameters.
   * Does nothing if already on the last page.
   */
  nextPage(): void {
    this.statusDropdownOpen = false;

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateQueryParams();
    }
  }

  /**
   * Toggles sort direction for the specified column.
   * If clicking on the same column, reverses the current sort direction.
   * If clicking on a different column, defaults to ascending sort.
   * Updates query parameters to persist sort state.
   * @param column The column to sort by (transactionId, currency, status, submitDate, or country)
   */
  sort(column: SortColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;

      this.sortDirection = 'asc';
    }
  }

  /**
   * Toggles the selection state of a status filter.
   * When selected, adds the status to the filter array.
   * When deselected, removes the status from the filter array.
   * Resets to page 1 and updates query parameters.
   * @param status The status to toggle in the filter
   */
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
   * Opens or closes the status filter dropdown menu.
   * Toggles the statusDropdownOpen flag.
   */
  toggleStatusDropdown(): void {
    this.statusDropdownOpen = !this.statusDropdownOpen;
  }

  /**
   * Closes the status filter dropdown menu.
   * Sets statusDropdownOpen flag to false.
   */
  closeStatusDropdown(): void {
    this.statusDropdownOpen = false;
  }

  /**
   * Computed value of the text displayed in the status filter dropdown button.
   * - 'All Statuses' when no statuses are selected
   * - Single status name when one is selected
   * - Number of selected statuses when multiple are selected
   * @readonly
   * @computed
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

  // =============================
  // FILTER MANAGEMENT
  // =============================

  /**
   * Clears all applied filters and resets pagination to initial state.
   * Resets search fields, currency/country selections, date range, and page size.
   */
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

  // =============================
  // NAVIGATION
  // =============================

  /**
   * Navigates to the transaction detail page while preserving current filter state
   * @param id The transaction ID to view
   */
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

  /**
   * Updates the URL query parameters to persist the current filter and pagination state.
   * Allows users to share, bookmark, or reload filtered views with preserved state.
   * @private
   */
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
