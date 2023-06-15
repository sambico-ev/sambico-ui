import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlogPreviewModule } from '../blog-preview/blog-preview.module';
import { SlideshowModule } from '../slideshow/slideshow.module';
import { HomeComponent } from './home.component';
import { WelcomeModule } from '../welcome/welcome.module';
import { ImprintModule } from '../imprint/imprint.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    SlideshowModule,
    BlogPreviewModule,
    WelcomeModule,
    ImprintModule,
  ],
  // exports: [HomeComponent]
})
export class HomeModule {}
