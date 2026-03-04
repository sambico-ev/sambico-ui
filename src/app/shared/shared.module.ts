import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { ImageUrlPipe } from './pipes/image-url.pipe';
import { MarkdownPipe } from './pipes/markdown.pipe';

@NgModule({
  declarations: [MarkdownPipe, ImageUrlPipe],
  imports: [CommonModule, NgxBootstrapIconsModule.pick(allIcons)],
  exports: [MarkdownPipe, ImageUrlPipe, NgxBootstrapIconsModule]
})
export class SharedModule {}
