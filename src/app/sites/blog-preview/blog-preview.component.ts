import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { RouteNames } from 'src/app/app-routing.module';
import { Blog } from 'src/app/shared/models/strapi.models';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { StrapiService } from 'src/app/shared/services/strapi.service';

const style1 = style({
  opacity: 1,
});

const style2 = style({
  opacity: 0,
});

@Component({
  selector: 'app-blog-preview',
  templateUrl: './blog-preview.component.html',
  styleUrls: ['./blog-preview.component.scss'],
  animations: [
    trigger('animate', [
      state('show', style1),
      state('hide', style2),
      transition('show => hide', animate('700ms ease-out')),
      transition('hide => show', animate('700ms ease-in')),
    ]),
  ],
})
export class BlogPreviewComponent implements OnInit {
  blogEntries: Blog[] = [];
  isMobile = this.breakpointService.isMobile();
  routes = RouteNames;
  visible = false;

  constructor(
    public readonly strapiService: StrapiService,
    private readonly breakpointService: BreakpointService,
    public el: ElementRef
  ) {}

  ngOnInit(): void {
    this.isMobile
      .pipe(
        switchMap((isMobile) => {
          return isMobile
            ? this.strapiService.getBlogPosts(1)
            : this.strapiService.getBlogPosts(3);
        })
      )
      .subscribe((res) => {
        this.blogEntries = res;
      });
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const componentPosition =
      this.el.nativeElement.offsetTop - this.el.nativeElement.offsetHeight;
    const scrollPosition = window.scrollY;
    if (scrollPosition >= componentPosition) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }
}
