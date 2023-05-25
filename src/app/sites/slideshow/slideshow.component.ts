import { Component, OnInit } from '@angular/core';
import { Slide } from '../../shared/models/strapi.models';
import { StrapiService } from '../../shared/services/strapi.service';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss'],
})
export class SlideshowComponent implements OnInit {
  slides: Slide[] = [];

  constructor(public strapiService: StrapiService) {}

  ngOnInit(): void {
    this.strapiService.getSlider().subscribe((res) => {
      this.slides = res;
    });
  }
}
