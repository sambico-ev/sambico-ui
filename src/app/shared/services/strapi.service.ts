import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../models/env.model';
import {
  Blog,
  BlogFields,
  Formats,
  ImageSize,
  ListResponse,
  Project,
  ProjectFields,
  SlideFields,
  Slide,
  SingleResponse,
  StrapiTypes,
  WelcomeText,
  WelcomeTextFields
} from '../models/strapi.models';
import {
  flattenEntity,
  normalizeBlog,
  normalizeSlide
} from './strapi.normalize';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  apiUrl = this.env.strapiUrl + '/api/';
  // Only the Authorization header: any other custom header makes the browser
  // send a CORS preflight that the Strapi 4 server rejects.
  headers = { Authorization: 'Bearer ' + this.env.strapiApiToken };

  constructor(
    @Inject('env') private env: Environment,
    private http: HttpClient
  ) {}

  getSlider(): Observable<Slide[]> {
    return this.http
      .get<
        ListResponse<SlideFields>
      >(this.apiUrl + StrapiTypes.SLIDER + '?populate=*', { headers: this.headers })
      .pipe(map((res) => res.data.map(normalizeSlide)));
  }

  getProjects(count?: number): Observable<Project[]> {
    return this.http
      .get<ListResponse<ProjectFields>>(
        this.apiUrl +
          StrapiTypes.PROJECT +
          `${count ? '?pagination[pageSize]=' + count : ''}`,
        { headers: this.headers }
      )
      .pipe(map((res) => res.data.map((item) => flattenEntity(item))));
  }

  getWelcomeText(): Observable<WelcomeText> {
    return this.http
      .get<
        SingleResponse<WelcomeTextFields>
      >(this.apiUrl + StrapiTypes.WELCOME_TEXT + '?populate=*', { headers: this.headers })
      .pipe(map((res) => flattenEntity(res.data)));
  }

  getBlogPosts(count?: number, orderDir?: 'asc' | 'desc'): Observable<Blog[]> {
    return this.http
      .get<ListResponse<BlogFields>>(
        this.apiUrl +
          StrapiTypes.BLOG +
          '?populate=*' +
          `${count ? '&pagination[pageSize]=' + count : ''}`,
        {
          headers: this.headers,
          params: { sort: 'id:' + (orderDir ? orderDir : 'asc') }
        }
      )
      .pipe(map((res) => res.data.map(normalizeBlog)));
  }

  /**
   * Finds one entry by the key `blogRouteKey` produces: the documentId on
   * Strapi 5, the numeric id on Strapi 4. Also accepts the numeric id on a v5
   * server. It picks from the list instead of asking `/api/blogs/:id`, which
   * takes only one of the two key kinds per server version and would 404 on
   * the other. The list is a handful of entries.
   */
  getBlogPost(key: string): Observable<Blog | undefined> {
    return this.getBlogPosts().pipe(
      map((blogs) =>
        blogs.find((blog) => blog.documentId === key) ??
        blogs.find((blog) => String(blog.id) === key)
      )
    );
  }

  getStrapiImageUrl(formats: Formats | null | undefined, size: ImageSize): string {
    if (!formats) {
      return '';
    }

    const format =
      formats[size] ?? formats.large ?? formats.medium ?? formats.small;
    return format?.url ? this.absoluteUrl(format.url) : '';
  }

  /** Strapi's local upload provider answers with `/uploads/..`, a cloud provider with a full URL */
  private absoluteUrl(url: string): string {
    return /^https?:\/\//.test(url) ? url : this.env.strapiUrl + url;
  }
}
