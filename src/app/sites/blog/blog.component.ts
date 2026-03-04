import { Component, OnInit } from '@angular/core';
import { Blog } from 'src/app/shared/models/strapi.models';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { StrapiService } from 'src/app/shared/services/strapi.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  blogEntries: Blog[] = [];
  isMobile = this.breakpointService.isMobile();

  constructor(
    public readonly breakpointService: BreakpointService,
    public readonly strapiService: StrapiService
  ) {}

  ngOnInit(): void {
    this.strapiService.getBlogPosts().subscribe((res) => {
      this.blogEntries = res.sort((a, b) => {
        return (
          new Date(b?.attributes.publishedAt).getTime() -
          new Date(a?.attributes.publishedAt).getTime()
        );
      });
    });
  }
}
