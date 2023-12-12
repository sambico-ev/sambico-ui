import { Component, OnInit } from '@angular/core';
import { RouteNames } from 'src/app/app-routing.module';
import { Blog, Formats } from 'src/app/shared/models/strapi.models';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { StrapiService } from 'src/app/shared/services/strapi.service';

@Component({
  selector: 'app-blog-preview',
  templateUrl: './blog-preview.component.html',
  styleUrls: ['./blog-preview.component.scss'],
})
export class BlogPreviewComponent implements OnInit {
  blogs: Blog[] = [];
  isMobile = this.breakpointService.isMobile();
  routes = RouteNames;

  constructor(
    public readonly strapiService: StrapiService,
    private readonly breakpointService: BreakpointService
  ) {}

  ngOnInit(): void {
    this.strapiService.getBlogPosts(1).subscribe((res) => {
      this.blogs = res;
    });
  }

  openImage(url: Formats): void {
    const test = this.strapiService.getStrapiImageUrl(url, 'xlarge');
    window.open(test, '_blank');
  }
}
