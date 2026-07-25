import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Icons } from '@shared/icons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly Icons = Icons;
}
