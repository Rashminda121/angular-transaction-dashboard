import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * KPI Cards Component
 *
 * Reusable component for displaying Key Performance Indicator cards.
 * Each card displays a metric value with title, description, and a clickable link.
 * @component
 */
@Component({
  selector: 'app-kpi-cards',
  imports: [RouterLink, CommonModule],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.scss',
})
export class KpiCards {
  /** Title text displayed on the card */
  readonly title = input.required<string>();

  /** Numeric value representing the KPI metric */
  readonly value = input.required<number>();

  /** Description text providing context about the metric */
  readonly description = input.required<string>();

  /** CSS class for styling the value text (default: 'text-slate-900') */
  readonly valueClass = input('text-slate-900');

  /** Route path for the card's clickable link */
  readonly route = input.required<string>();

  /** Optional query parameters to pass when navigating */
  readonly queryParams = input<Record<string, unknown>>({});
}
