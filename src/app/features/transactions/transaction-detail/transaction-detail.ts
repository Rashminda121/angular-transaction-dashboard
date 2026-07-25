import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TransactionService } from '../services/transaction-service';
import { Icons } from '@shared/icons/icons';
import { LucideAngularModule } from 'lucide-angular/src/icons';

@Component({
  selector: 'app-transaction-detail',
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './transaction-detail.html',
  styleUrl: './transaction-detail.scss',
})
export class TransactionDetail {
  private readonly transactionService = inject(TransactionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly Icons = Icons;

  goBack(): void {
    this.router.navigate(['/transactions'], {
      queryParams: this.route.snapshot.queryParams,
    });
  }

  readonly transaction = toSignal(
    this.transactionService.getTransactionById(this.route.snapshot.paramMap.get('id')!),
    {
      initialValue: undefined,
    },
  );
}
