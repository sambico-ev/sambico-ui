import { Component, ElementRef, HostListener } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { RouteNames } from 'src/app/app-routing.module';
import { BreakpointService } from '../../shared/services/breakpoint.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  menuOpen = false;
  isMobile = this.breakpointService.isMobile();
  routes = RouteNames;

  constructor(
    private breakpointService: BreakpointService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    router.events.subscribe((e: Event) => {
      if (e instanceof NavigationEnd) {
        this.menuOpen = false;
      }
    });
  }

  toggleMenu(open: boolean) {
    this.menuOpen = open;
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }
}
