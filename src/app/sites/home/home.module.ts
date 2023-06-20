import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlogPreviewModule } from '../blog-preview/blog-preview.module';
import { ImprintModule } from '../imprint/imprint.module';
import { ProjectsPreviewModule } from '../projects-preview/projects-preview.module';
import { SlideshowModule } from '../slideshow/slideshow.module';
import { WelcomeModule } from '../welcome/welcome.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    SlideshowModule,
    BlogPreviewModule,
    ProjectsPreviewModule,
    WelcomeModule,
    ImprintModule,
  ],
  // exports: [HomeComponent]
})
export class HomeModule {}
