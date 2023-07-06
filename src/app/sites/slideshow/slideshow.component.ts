import { Component, OnInit } from '@angular/core';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { Slide } from '../../shared/models/strapi.models';
import { StrapiService } from '../../shared/services/strapi.service';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss'],
})
export class SlideshowComponent implements OnInit {
  slides: Slide[] = [];
  isMobile = this.breakpointService.isMobile();

  constructor(
    public strapiService: StrapiService,
    private readonly breakpointService: BreakpointService
  ) {}

  ngOnInit(): void {
    this.strapiService.getSlider().subscribe((res) => {
      this.slides = res;
    });
  }
}
