import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NgxBootstrapIconsModule,
  at,
  checkCircle,
  chevronRight,
  download,
  envelope,
  envelopeCheck,
  facebook,
  geoAlt,
  instagram,
  qrCode,
  tiktok
} from 'ngx-bootstrap-icons';

// only the icons the templates use; `allIcons` would ship all ~2000
const icons = {
  at,
  checkCircle,
  chevronRight,
  download,
  envelope,
  envelopeCheck,
  facebook,
  geoAlt,
  instagram,
  qrCode,
  tiktok
};
import { ImageUrlPipe } from './pipes/image-url.pipe';
import { MarkdownPipe } from './pipes/markdown.pipe';

@NgModule({
  declarations: [MarkdownPipe, ImageUrlPipe],
  imports: [CommonModule, NgxBootstrapIconsModule.pick(icons)],
  exports: [MarkdownPipe, ImageUrlPipe, NgxBootstrapIconsModule]
})
export class SharedModule {}
