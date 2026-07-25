import { inject, Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { map, Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

/**
 * Service for managing and fetching transaction data from a CSV file.
 * Provides methods to retrieve all transactions or filter by ID.
 * Caches the results for optimal performance.
 * @class TransactionService
 */
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  /** HTTP client for making requests to fetch the CSV file */
  private readonly http = inject(HttpClient);

  /** URL path to the CSV file containing transaction data */
  private readonly csvUrl = environment.transactionCsv;

  /**
   * Fetches all transactions from the CSV file and returns them as a typed array.
   * Results are cached and shared across multiple subscriptions.
   * @returns {Observable<Transaction[]>} Observable of array of transactions
   */
  getTransactions(): Observable<Transaction[]> {
    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map((csv) => this.parseCsv(csv)),
      shareReplay(1),
    );
  }

  /**
   * Parses CSV text content into an array of Transaction objects.
   * Expects CSV format with headers: transactionId,currency,status,submitDate,country
   * @private
   * @param {string} csv - Raw CSV text content
   * @returns {Transaction[]} Array of parsed transactions
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

  /**
   * Retrieves a single transaction by its ID.
   * @param {string} id - The transaction ID to search for
   * @returns {Observable<Transaction | undefined>} Observable of the matching transaction or undefined if not found
   */
  getTransactionById(id: string): Observable<Transaction | undefined> {
    return this.getTransactions().pipe(
      map((transactions) => transactions.find((t) => t.transactionId === id)),
    );
  }
}
