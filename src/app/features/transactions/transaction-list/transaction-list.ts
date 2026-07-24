import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TransactionService } from '../services/transaction-service';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList {
  private readonly transactionService = inject(TransactionService);

  readonly transactions$ = this.transactionService.getTransactions();
}
