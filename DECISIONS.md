# Technical Decisions

## Decision: Used Standalone Components

**Context:**  
The project was built with Angular 21, where Standalone Components are the recommended approach.

**Options:**

- NgModules
- Standalone Components

**Choice:**  
Standalone Components were chosen because they reduce boilerplate, simplify dependency management, and create a cleaner project structure.

**Trade-offs:**  
Some existing Angular projects still use NgModules, so developers may need to be familiar with both approaches.

---

## Decision: Selected Apache ECharts for Data Visualization

**Context:**  
The dashboard required interactive charts to display transaction statistics and trends.

**Options:**

- Chart.js
- Apache ECharts
- Highcharts

**Choice:**  
Apache ECharts with ngx-echarts was selected because it offers a wide range of chart types, responsive visualizations, and integrates well with Angular.

**Trade-offs:**  
The library has more configuration options than simpler charting libraries, resulting in a slightly steeper learning curve.

---

## Decision: Used Angular Signals for State Management

**Context:**  
The dashboard needed to update summary cards and charts whenever the transaction data changed.

**Options:**

- Angular Signals
- RxJS Subjects
- NgRx

**Choice:**  
Angular Signals were chosen because they provide simple, reactive state management without requiring an additional state management library.

**Trade-offs:**  
Signals are ideal for local state but may not be suitable for large applications with complex shared state.

---

## Decision: Separated Data Loading into a Service

**Context:**  
The application loads transaction data from a CSV file before displaying it in the dashboard.

**Options:**

- Load data directly in the component
- Use a dedicated service

**Choice:**  
A dedicated service was used to keep data loading and parsing separate from the UI, improving code organization and maintainability.

**Trade-offs:**  
This introduces an additional layer, but makes the application easier to extend and maintain.

---

## Decision: Used Tailwind CSS for Styling

**Context:**  
The application required a responsive and consistent user interface.

**Options:**

- Plain CSS
- Bootstrap
- Tailwind CSS

**Choice:**  
Tailwind CSS was chosen because it enables rapid development with utility classes while making it easier to build responsive layouts.

**Trade-offs:**  
Templates can become cluttered with utility classes if they are not organized carefully.
