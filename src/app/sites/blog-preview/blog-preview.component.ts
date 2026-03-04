import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { RouteNames } from 'src/app/app-routing.module';
import { CalEvent } from 'src/app/shared/models/calEvent.model';
import { Blog } from 'src/app/shared/models/strapi.models';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { StrapiService } from 'src/app/shared/services/strapi.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

const style1 = style({
  opacity: 1
});

const style2 = style({
  opacity: 0
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
      transition('hide => show', animate('700ms ease-in'))
    ])
  ]
})
export class BlogPreviewComponent implements OnInit {
  blogEntries: Blog[] = [];
  events!: CalEvent[];
  isMobile = this.breakpointService.isMobile();
  routes = RouteNames;
  visible = false;

  constructor(
    public readonly strapiService: StrapiService,
    private readonly breakpointService: BreakpointService,
    private readonly http: HttpClient,
    private readonly utilsService: UtilsService,
    public el: ElementRef
  ) {}

  ngOnInit(): void {
    this.http
      .get(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vSSGiKs_8gTfF-eACbbKuDyTjf7sjC1RatZHx2XulycZzgZIUooGxBTbk6jKyzHZteY5wWADVvq-LVq/pub?gid=0&single=true&output=csv',
        {
          responseType: 'text'
        }
      )
      .subscribe((res) => {
        console.log('csv res', res);
        if (!res) return;
        const csv = res.split('\n');
        this.events = csv.map((line) => {
          const regex = /,(?=(?:[^"]|"[^"]*")*$)/;
          const [date, title, description, location] = line
            .split(regex)
            .map((item) => item.replace(/"/g, '').replace(/\r/g, ''));
          return {
            date: this.utilsService.parseDate(date) || new Date(),
            title,
            description,
            location
          };
        });
      });

    this.isMobile
      .pipe(
        switchMap((isMobile) => {
          return isMobile
            ? this.strapiService.getBlogPosts(1, 'desc')
            : this.strapiService.getBlogPosts(3, 'desc');
        })
      )
      .subscribe((res) => {
        console.log('blog entries', res);
        this.blogEntries = res.sort((a, b) => {
          return (
            new Date(b.attributes.publishedAt).getTime() -
            new Date(a.attributes.publishedAt).getTime()
          );
        });
      });
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll(_: Event): void {
    const componentPosition =
      this.el.nativeElement.offsetTop -
      this.el.nativeElement.offsetHeight +
      400;
    const scrollPosition = window.scrollY;
    if (scrollPosition >= componentPosition) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  getImageUrl(blog: Blog): string {
    return this.strapiService.getStrapiImageUrl(
      blog.attributes.image.data.attributes.formats,
      'small'
    );
  }
}
