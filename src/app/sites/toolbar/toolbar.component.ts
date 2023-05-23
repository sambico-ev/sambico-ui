import { Component } from '@angular/core';
import { BreakpointService } from '../../shared/services/breakpoint.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  menuOpen = false;
  isMobile = this.breakpointService.isMobile();

  constructor(private breakpointService: BreakpointService) {}

  toggleMenu(open: boolean) {
    this.menuOpen = open;
  }
}
