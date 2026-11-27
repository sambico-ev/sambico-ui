import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CarouselComponent, SlideComponent } from 'ngx-bootstrap/carousel';
import { SlideshowComponent } from './slideshow.component';

// TEMP, MOVE TO SHARED COMPS WHEN READY
@NgModule({
  declarations: [SlideshowComponent],
  imports: [CommonModule, CarouselComponent, SlideComponent],
  exports: [SlideshowComponent],
})
export class SlideshowModule {}
