import { Component, Input } from '@angular/core';
import { Blog, Formats } from 'src/app/shared/models/strapi.models';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { StrapiService } from 'src/app/shared/services/strapi.service';

@Component({
  selector: 'app-blog-entry',
  templateUrl: './blog-entry.component.html',
  styleUrls: ['./blog-entry.component.scss']
})
export class BlogEntryComponent {
  @Input() blog!: Blog;

  isMobile = this.breakpointService.isMobile();

  constructor(
    public readonly breakpointService: BreakpointService,
    public readonly strapiService: StrapiService
  ) {}

  openImage(url?: Formats): void {
    if (!url) return;
    const test = this.strapiService.getStrapiImageUrl(url, 'xlarge');
    if (test) {
      window.open(test, '_blank');
    }
  }
}
