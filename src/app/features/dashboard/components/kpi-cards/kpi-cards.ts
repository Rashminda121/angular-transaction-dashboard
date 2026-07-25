import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-kpi-cards',
  imports: [RouterLink, CommonModule],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.scss',
})
export class KpiCards {
  readonly title = input.required<string>();
  readonly value = input.required<number>();
  readonly description = input.required<string>();
  readonly valueClass = input('text-slate-900');
  readonly route = input.required<string>();
  readonly queryParams = input<Record<string, unknown>>({});
}
