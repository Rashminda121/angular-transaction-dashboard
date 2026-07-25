# Transaction Dashboard

A responsive analytics dashboard built with **Angular 21** that visualizes transaction data from a CSV file. It provides an overview of key statistics, interactive charts, and summary metrics to help users analyze transaction trends and distributions.

## Features

- **Total Transactions** – Quick view of overall transaction volume
- **Transaction Status Summary** – Breakdown of transaction statuses
- **Monthly Transaction Distribution** – Insights into activity by month
- **Transactions Over Time** – Trend analysis across time periods
- **Top Countries by Transaction Volume** – Geographic distribution of activity
- **Currency Distribution** – Breakdown of transactions by currency
- **Interactive Charts** – Powered by ECharts for dynamic exploration

## Data Source

The application loads transaction data from a static CSV file located in the project's `assets` directory and processes it entirely on the client side.

## Tech Stack

**Frontend**

- Angular 21 (Standalone Components)
- TypeScript
- RxJS
- Angular Signals
- Angular Services
- Angular HttpClient

**UI**

- Tailwind CSS

**Charts**

- Apache ECharts
- ngx-echarts

**Development**

- Angular CLI
- npm

## Prerequisites

Before running the project, install the following:

| Tool        | Version          |
| ----------- | ---------------- |
| Node.js     | 24.14.1 or later |
| npm         | 11.11.0 or later |
| Angular CLI | 21.2.19          |

Verify your installation:

```bash
node -v
npm -v
ng version
```

## Installation & Running Locally

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd transaction-dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

Open your browser:

```
http://localhost:4200
```

## Build for Production

Generate a production build:

```bash
ng build
```

The build output will be generated inside:

```bash
dist/transaction-dashboard/browser
```

## Project Structure

```bash
├── src/
│   ├── app/
│   │   ├── features/
│   │   │   ├── dashboard/                 # Dashboard feature
│   │   │   │   ├── components/
│   │   │   │   │   └── kpi-cards/         # Reusable KPI summary cards
│   │   │   │   ├── dashboard.html         # Dashboard template
│   │   │   │   ├── dashboard.scss         # Dashboard styles
│   │   │   │   └── dashboard.ts           # Dashboard component logic
│   │   │   │
│   │   │   ├── home/                      # Landing page
│   │   │   │   ├── components/
│   │   │   │   │   └── navigation-card/   # Navigation card component
│   │   │   │   ├── home.html
│   │   │   │   ├── home.scss
│   │   │   │   └── home.ts
│   │   │   │
│   │   │   ├── not-found/                 # 404 page
│   │   │   │   ├── not-found.html
│   │   │   │   ├── not-found.scss
│   │   │   │   └── not-found.ts
│   │   │   │
│   │   │   └── transactions/              # Transaction management feature
│   │   │       ├── models/
│   │   │       │   └── transaction.ts     # Transaction data model
│   │   │       ├── services/
│   │   │       │   └── transaction-service.ts # Loads and processes transaction data
│   │   │       ├── transaction-detail/    # Transaction details page
│   │   │       └── transaction-list/      # Transaction listing page
│   │   │
│   │   ├── shared/
│   │   │   └── icons/                     # Shared Lucide icon registrations
│   │   │
│   │   ├── app.config.ts                  # Global providers and application configuration
│   │   ├── app.routes.ts                  # Application routes
│   │   └── app.ts                         # Root standalone component
│   │
│   ├── assets/
│   │   └── transactions.csv               # Sample transaction dataset
│   │
│   ├── environments/                      # Environment-specific configuration
│   │
│   ├── main.ts                            # Application entry point
│   ├── styles.scss                        # Global styles
│   └── tailwind.css                       # Tailwind CSS imports
│
├── angular.json                           # Angular workspace configuration
├── package.json                           # Project dependencies and scripts
├── tsconfig.json                          # TypeScript configuration
└── README.md                              # Project documentation
```

## Architecture Decisions

### Standalone Components

The application uses Standalone Components instead of NgModules because they simplify the project structure, reduce boilerplate code, and are the recommended approach in Angular 21. They also make components easier to develop and maintain.

### Charting Library

The dashboard uses Apache ECharts with ngx-echarts to create interactive charts. It was chosen because it provides a variety of chart types, good customization options, responsive design, and integrates well with Angular.

### State Management

The application uses Angular Signals for state management. Signals automatically update the dashboard when the transaction data changes, making the code simpler and reducing the need for manual updates or subscriptions.

### Data Layer

Transaction data is loaded through a `TransactionService` using Angular's HttpClient. Keeping data loading in a service separates it from the UI, making the code easier to maintain and allowing the data source to be replaced with an API in the future if needed.

## Known Issues / Limitations

- The application uses a CSV file instead of a live API.
- No user login or authentication is included.
- Error handling can be improved.
- The application has not been tested with very large datasets.

## Future Improvements

- Connect the dashboard to a live backend API.
- Add more filtering and search options.
- Implement user authentication.
- Add export options (CSV or PDF).
- Improve error handling and validation.
- Add unit and end-to-end tests.
- Optimize performance for larger datasets.
