import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TransactionService } from '../services/transaction-service';
import { Icons } from '@shared/icons/icons';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Transaction Detail Component
 *
 * Displays detailed information for a single transaction.
 * Loads the transaction based on the ID from the route parameters.
 * Provides navigation back to the transaction list while preserving filter state.
 * @component
 */
@Component({
  selector: 'app-transaction-detail',
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './transaction-detail.html',
  styleUrl: './transaction-detail.scss',
})
export class TransactionDetail {
  /** Service for fetching transaction data */
  private readonly transactionService = inject(TransactionService);

  /** Router for navigation */
  private readonly router = inject(Router);

  /** Activated route for accessing route parameters */
  private readonly route = inject(ActivatedRoute);

  /** Icon references for UI elements */
  protected readonly Icons = Icons;

  /**
   * Signal containing the current transaction being displayed.
   * Initialized from the route parameter 'id'.
   * @readonly
   */
  readonly transaction = toSignal(
    this.transactionService.getTransactionById(this.route.snapshot.paramMap.get('id')!),
    {
      initialValue: undefined,
    },
  );

  /**
   * Navigates back to the transaction list view while preserving filter state.
   * Query parameters from the current route are passed to the navigation.
   */
  goBack(): void {
    this.router.navigate(['/transactions'], {
      queryParams: this.route.snapshot.queryParams,
    });
  }
}
