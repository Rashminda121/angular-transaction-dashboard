import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';

import { BarChart, LineChart, PieChart } from 'echarts/charts';

import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';

/**
 * Register chart types and components for ECharts.
 * Includes: BarChart, LineChart, PieChart, GridComponent, TooltipComponent,
 * LegendComponent, TitleComponent, and CanvasRenderer.
 */
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  CanvasRenderer,
]);

/**
 * Application configuration.
 * Provides:
 * - Router configuration with application routes
 * - HTTP client for making API requests
 * - ECharts with core functionality and chart types (Bar, Line, Pie)
 * - Global error listeners for handling unhandled errors
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideEchartsCore({
      echarts,
    }),
  ],
};
