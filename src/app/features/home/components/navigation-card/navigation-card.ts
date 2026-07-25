import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icons } from '@shared/icons/icons';
import { LucideAngularModule } from 'lucide-angular/src/icons';
import { LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-navigation-card',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './navigation-card.html',
  styleUrl: './navigation-card.scss',
})
export class NavigationCard {
  protected readonly Icons = Icons;

  icon = input.required<LucideIconData>();
  routerLink = input<string>();
  title = input.required<string>();
  description = input.required<string>();
  buttonText = input.required<string>();
}
