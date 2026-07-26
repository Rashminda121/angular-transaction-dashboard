# Transaction Data Model

This application uses a `Transaction` model to represent each record loaded from the CSV file.

## Transaction Interface

```typescript
export interface Transaction {
  transactionId: string;
  currency: string;
  status: string;
  submitDate: Date;
  country: string;
}
```

## Fields

| Field           | Type     | Example                  | Description                                  |
| --------------- | -------- | ------------------------ | -------------------------------------------- |
| `transactionId` | `string` | `"TXN-E4D06683-51A"`     | A unique identifier for the transaction.     |
| `currency`      | `string` | `"JPY"`                  | The currency code used for the transaction.  |
| `status`        | `string` | `"Pending"`              | The current status of the transaction.       |
| `submitDate`    | `Date`   | `new Date('2024-12-31')` | The date the transaction was submitted.      |
| `country`       | `string` | `"China"`                | The country associated with the transaction. |

## Data Transformation

The transaction data is loaded from a CSV file. Since all CSV values are read as strings, the following transformation is applied during parsing:

- `submitDate` is converted from a `string` to a JavaScript `Date` object using `new Date()`.
- The remaining fields are stored as strings.

## Status Values

The dataset includes the following transaction statuses:

- Cancelled
- Completed
- Failed
- Pending
- Processing
- Refunded

## Currency Values

The dataset includes the following currency codes:

- AED
- AUD
- CAD
- CHF
- CNY
- EUR
- GBP
- INR
- JPY
- LKR
- SGD
- USD
