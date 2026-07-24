import { inject, Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { map, Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly http = inject(HttpClient);

  private readonly csvUrl = environment.transactionCsv;

  /**
   * Fetches the CSV file and returns typed transactions.
   */
  getTransactions(): Observable<Transaction[]> {
    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map((csv) => this.parseCsv(csv)),
      shareReplay(1),
    );
  }

  /**
   * Converts CSV text into Transaction[].
   */
  private parseCsv(csv: string): Transaction[] {
    const lines = csv.trim().split(/\r?\n/);

    // Remove header row
    lines.shift();

    return lines
      .filter((line) => line.trim().length > 0)
      .map((line): Transaction => {
        const [transactionId, currency, status, submitDate, country] = line.split(',');

        return {
          transactionId: transactionId.trim(),
          currency: currency.trim(),
          status: status.trim(),
          submitDate: new Date(submitDate.trim()),
          country: country.trim(),
        };
      });
  }
}
