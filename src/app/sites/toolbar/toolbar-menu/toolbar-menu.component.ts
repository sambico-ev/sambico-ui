import { Component } from '@angular/core';
import { RouteNames } from 'src/app/app-routing.module';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';

@Component({
  selector: 'app-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  styleUrls: ['./toolbar-menu.component.scss'],
})
export class ToolbarMenuComponent {
  routes = RouteNames;
  isMobile = this.breakpointService.isMobile();

  constructor(private readonly breakpointService: BreakpointService) {}

  downloadMembershipApplication(): void {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = 'assets/files/Antrag_auf_Mitgliedschaft.pdf';
    link.download = 'Antrag_auf_Mitgliedschaft.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
