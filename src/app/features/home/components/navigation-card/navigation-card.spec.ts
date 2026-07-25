import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationCard } from './navigation-card';

describe('NavigationCard', () => {
  let component: NavigationCard;
  let fixture: ComponentFixture<NavigationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationCard],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
