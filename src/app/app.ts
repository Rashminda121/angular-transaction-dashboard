import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root application component.
 * Serves as the main container for the application with router outlet
 * for displaying routed views.
 * @component
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /** Application title displayed in the browser title bar */
  protected readonly title = signal('transaction-dashboard');
}
