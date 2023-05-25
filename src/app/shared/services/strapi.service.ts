import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../models/env.model';
import {
  Format,
  Slide,
  SliderResponse,
  StrapiTypes,
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

  getStrapiImageUrl(image: Format): string {
    return this.env.strapiUrl + image.url;
  }
}
