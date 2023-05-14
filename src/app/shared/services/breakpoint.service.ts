import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Breakpoints } from '../models/breakpoint.model';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  constructor(private readonly breakpointObserver: BreakpointObserver) {}

  getBreakpoint(): Observable<Breakpoints> {
    return this.breakpointObserver.observe(Object.values(Breakpoints)).pipe(
      map((state: BreakpointState) => {
        const matchingBreakpoint: Breakpoints = Breakpoints.DESKTOP;
        const breakpoints = Object.keys(state.breakpoints);
        for (let i = 0; i < breakpoints.length; i++) {
          if (state.breakpoints[breakpoints[i]]) {
            return breakpoints[i] as Breakpoints;
          }
        }
        return matchingBreakpoint;
      })
    );
  }

  isMobile(): Observable<boolean> {
    return this.getBreakpoint().pipe(
      map((breakpoint: any) => {
        return breakpoint === Breakpoints.MOBILE;
      })
    );
  }
}
