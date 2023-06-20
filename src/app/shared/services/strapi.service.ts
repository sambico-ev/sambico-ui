import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../models/env.model';
import {
  Format,
  Project,
  ProjectResponse,
  Slide,
  SliderResponse,
  StrapiTypes,
  WeclomeText,
  WelcomeTextResponse,
} from '../models/strapi.models';

@Injectable({
  providedIn: 'root',
})
export class StrapiService {
  apiUrl = this.env.strapiUrl + '/api/';

  constructor(
    @Inject('env') private env: Environment,
    private http: HttpClient
  ) {}

  getSlider(): Observable<Slide[]> {
    return this.http
      .get<SliderResponse>(this.apiUrl + StrapiTypes.SLIDER + '?populate=*')
      .pipe(
        map((res) => {
          return res.data;
        })
      );
  }

  getProjects(count?: number): Observable<Project[]> {
    return this.http
      .get<ProjectResponse>(
        this.apiUrl +
          StrapiTypes.PROJECT +
          `${count ? '?pagination[pageSize]=' + count : ''}`
      )
      .pipe(
        map((res) => {
          return res.data;
        })
      );
  }

  getWelcomeText(): Observable<WeclomeText> {
    return this.http
      .get<WelcomeTextResponse>(
        this.apiUrl + StrapiTypes.WELCOME_TEXT + '?populate=*'
      )
      .pipe(
        map((res) => {
          return res.data.attributes;
        })
      );
  }

  getStrapiImageUrl(image: Format): string {
    return this.env.strapiUrl + image.url;
  }
}
