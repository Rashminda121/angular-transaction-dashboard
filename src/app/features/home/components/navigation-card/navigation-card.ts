import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icons } from '@shared/icons/icons';
import { LucideAngularModule } from 'lucide-angular';
import { LucideIconData } from 'lucide-angular';

/**
 * Navigation Card Component
 *
 * Reusable card component for displaying navigation options.
 * Each card shows an icon, title, description, and a call-to-action button.
 * @component
 */
@Component({
  selector: 'app-navigation-card',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './navigation-card.html',
  styleUrl: './navigation-card.scss',
})
export class NavigationCard {
  /** Reference to available icons */
  protected readonly Icons = Icons;

  /** Icon to display on the card */
  icon = input.required<LucideIconData>();

  /** Route path for navigation when the card is clicked */
  routerLink = input<string>();

  /** Card title text */
  title = input.required<string>();

  /** Card description text providing context about the navigation target */
  description = input.required<string>();

  /** Text displayed on the call-to-action button */
  buttonText = input.required<string>();
}
