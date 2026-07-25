import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Not Found Component
 *
 * Displayed when a user navigates to a route that doesn't exist.
 * Serves as the fallback component for the wildcard '**' route.
 * @component
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {}
