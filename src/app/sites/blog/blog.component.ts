import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RouteNames } from 'src/app/app-routing.module';
import { Blog } from 'src/app/shared/models/strapi.models';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { StrapiService } from 'src/app/shared/services/strapi.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class BlogComponent implements OnInit {
  blogEntries: Blog[] = [];
  /** `blog/:id` shows just that entry, `blog` the whole list */
  single = false;
  isMobile = this.breakpointService.isMobile();
  routes = RouteNames;

  constructor(
    public readonly breakpointService: BreakpointService,
    public readonly strapiService: StrapiService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        switchMap((id) => this.load(id))
      )
      .subscribe(({ entries, single }) => {
        this.blogEntries = entries;
        this.single = single;
      });
  }

  /** An id that matches nothing falls back to the list instead of an empty page */
  private load(
    id: string | null
  ): Observable<{ entries: Blog[]; single: boolean }> {
    if (id === null) {
      return this.strapiService
        .getBlogPosts()
        .pipe(map((blogs) => ({ entries: newestFirst(blogs), single: false })));
    }
    return this.strapiService.getBlogPost(id).pipe(
      switchMap((blog) =>
        blog
          ? of({ entries: [blog], single: true })
          : this.load(null)
      )
    );
  }
}

function newestFirst(blogs: Blog[]): Blog[] {
  return [...blogs].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
