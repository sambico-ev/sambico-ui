import { Component } from '@angular/core';
import { RouteNames } from 'src/app/app-routing.module';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  routes = RouteNames;
  year = new Date().getFullYear();
  isMobile = this.breakpointService.isMobile();

  constructor(private readonly breakpointService: BreakpointService) {}
}
