import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icons } from '@shared/icons/icons';
import { LucideAngularModule } from 'lucide-angular';
import { NavigationCard } from './components/navigation-card/navigation-card';

/**
 * Navigation card item configuration.
 * @interface NavigationCardItem
 * @property {string} title - Card title
 * @property {string} route - Navigation route for the card
 * @property {string} description - Card description text
 * @property {string} buttonText - Button label text
 * @property {LucideIconData} icon - Icon to display on the card
 */
interface NavigationCardItem {
  title: string;
  route: string;
  description: string;
  buttonText: string;
  icon: typeof Icons.LayoutDashboard;
}

/**
 * Home Component
 *
 * Landing page displaying navigation options to main application features.
 * Shows cards for accessing the dashboard and transaction list.
 * @component
 */
@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, RouterLink, NavigationCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  /** Reference to available icons */
  protected readonly Icons = Icons;

  /**
   * Array of navigation card configurations displayed on the home page.
   * Each card links to a major feature of the application.
   */
  cards: NavigationCardItem[] = [
    {
      title: 'Dashboard',
      route: '/dashboard',
      icon: Icons.LayoutDashboard,
      description:
        'View transaction summaries, statistics, recent activity and key metrics through an interactive dashboard.',
      buttonText: 'Open Dashboard',
    },
    {
      title: 'Transactions',
      route: '/transactions',
      icon: Icons.ReceiptText,
      description:
        'Browse, search, filter and inspect transaction records with powerful filtering and sorting capabilities.',
      buttonText: 'View Transactions',
    },
  ];
}
