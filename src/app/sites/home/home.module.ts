import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlogPreviewModule } from '../../shared/components/blog-preview/blog-preview.module';
import { SlideshowModule } from '../slideshow/slideshow.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SlideshowModule, BlogPreviewModule],
  // exports: [HomeComponent]
})
export class HomeModule {}
