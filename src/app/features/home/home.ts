import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icons } from '@shared/icons/icons';
import { LucideAngularModule } from 'lucide-angular/src/icons';
import { NavigationCard } from './components/navigation-card/navigation-card';

interface NavigationCardItem {
  title: string;
  route: string;
  description: string;
  buttonText: string;
  icon: typeof Icons.LayoutDashboard;
}

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, RouterLink, NavigationCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly Icons = Icons;

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
