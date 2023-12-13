import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogPreviewComponent } from './blog-preview.component';

@NgModule({
  declarations: [BlogPreviewComponent],
  imports: [CommonModule, RouterModule, TranslateModule, SharedModule],
  exports: [BlogPreviewComponent],
})
export class BlogPreviewModule {}
