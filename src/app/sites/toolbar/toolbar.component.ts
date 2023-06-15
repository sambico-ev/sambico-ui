import { Component } from '@angular/core';
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

  constructor(private breakpointService: BreakpointService) {}

  toggleMenu(open: boolean) {
    this.menuOpen = open;
  }
}
