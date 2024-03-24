import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { CalEvent } from 'src/app/shared/models/calEvent.model';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent {
  @ViewChild('event-title') eventTitle!: ElementRef;

  @Input() events: CalEvent[] = [];

  isMobile = this.breakpointService.isMobile();

  constructor(
    private readonly breakpointService: BreakpointService,
    public el: ElementRef
  ) {}

  ngOnInit(): void {}

  @HostListener('window:scroll', ['$event'])
  checkScroll(e: WheelEvent) {}
}
