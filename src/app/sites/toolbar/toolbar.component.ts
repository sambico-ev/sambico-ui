import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouteNames } from 'src/app/app-routing.module';
import { BreakpointService } from '../../shared/services/breakpoint.service';

const SCROLL_THRESHOLD_DOWN = 50;
const SCROLL_THRESHOLD_UP = 20;

const TOOLBAR_HEIGHTS = {
  default: 120,
  mobile: 80,
  scrolled: 70,
  scrolledMobile: 60
} as const;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  isMobile = this.breakpointService.isMobile();
  routes = RouteNames;
  scrolled = false;

  private _isMobile = false;
  private readonly destroy$ = new Subject<void>();

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

  ngOnInit(): void {
    this.breakpointService
      .isMobile()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mobile) => {
        this._isMobile = mobile;
        this.updateToolbarHeight();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollY = window.scrollY;
    if (!this.scrolled && scrollY > SCROLL_THRESHOLD_DOWN) {
      this.scrolled = true;
      this.updateToolbarHeight();
    } else if (this.scrolled && scrollY < SCROLL_THRESHOLD_UP) {
      this.scrolled = false;
      this.updateToolbarHeight();
    }
  }

  private updateToolbarHeight(): void {
    const height = this.scrolled
      ? this._isMobile
        ? TOOLBAR_HEIGHTS.scrolledMobile
        : TOOLBAR_HEIGHTS.scrolled
      : this._isMobile
        ? TOOLBAR_HEIGHTS.mobile
        : TOOLBAR_HEIGHTS.default;
    document.documentElement.style.setProperty(
      '--toolbar-height',
      `${height}px`
    );
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
