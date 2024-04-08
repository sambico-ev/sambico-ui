import { Component, Input } from '@angular/core';
import { CalEvent } from 'src/app/shared/models/calEvent.model';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent {
  @Input() events: CalEvent[] = [];

  isMobile = this.breakpointService.isMobile();

  constructor(private readonly breakpointService: BreakpointService) {}
}
