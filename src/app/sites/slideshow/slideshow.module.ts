import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { SlideshowComponent } from './slideshow.component';

// TEMP, MOVE TO SHARED COMPS WHEN READY
@NgModule({
  declarations: [SlideshowComponent],
  imports: [CommonModule, CarouselModule],
  exports: [SlideshowComponent],
})
export class SlideshowModule {}
