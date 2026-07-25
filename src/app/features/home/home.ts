import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icons } from '@shared/icons/icons';
import { LucideAngularModule, Route } from 'lucide-angular/src/icons';

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly Icons = Icons;
}
