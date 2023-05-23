import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BlogComponent } from './sites/blog/blog.component';
import { HomeComponent } from './sites/home/home.component';

@Injectable({ providedIn: 'root' })
export class TitleResolver {
  constructor(private readonly translateService: TranslateService) {}
  resolve(snapshot: ActivatedRouteSnapshot) {
    console.log('snapshot', snapshot);
    switch (snapshot.routeConfig?.path) {
      case RouteNames.HOME:
        return Promise.resolve(this.translateService.get('home.tabTitle'));
    }
    return 'Custom About Me';
  }
}

export enum RouteNames {
  HOME = '',
  BLOG = 'blog',
}

const routes: Routes = [
  { path: RouteNames.HOME, component: HomeComponent, pathMatch: 'full' },
  { path: RouteNames.BLOG, component: BlogComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      anchorScrolling: 'enabled',
      enableTracing: false,
      scrollOffset: [0, 64], // offset height of toolbar
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
