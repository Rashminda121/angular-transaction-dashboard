/**
 * Represents a single transaction record.
 * @interface Transaction
 * @property {string} transactionId - Unique identifier for the transaction
 * @property {string} currency - Currency code of the transaction (e.g., 'USD', 'EUR')
 * @property {string} status - Current status of the transaction (e.g., 'COMPLETED', 'PENDING')
 * @property {Date} submitDate - Date and time the transaction was submitted
 * @property {string} country - Country code associated with the transaction
 */
export interface Transaction {
  transactionId: string;
  currency: string;
  status: string;
  submitDate: Date;
  country: string;
}
