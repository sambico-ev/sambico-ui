import { Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { RouteNames } from '../../app-routing.module';

@Injectable({
  providedIn: 'root',
})
export class TitleService implements OnDestroy {
  private readonly baseTitle = 'SAMBICO e.V.';
  private readonly destroy$ = new Subject();

  constructor(private readonly title: Title, private readonly router: Router) {}

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  init(): void {
    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        const url = route.urlAfterRedirects.replace(/^\/+/, '');
        switch (url) {
          case RouteNames.ABOUT:
            this.title.setTitle(this.baseTitle + ' - ' + 'About');
            break;
          default:
            this.title.setTitle(this.baseTitle);
            break;
        }
      }
    });
  }
}
