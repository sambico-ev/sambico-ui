import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { MarkdownPipe } from './pipes/markdown.pipe';

@NgModule({
  declarations: [MarkdownPipe],
  imports: [CommonModule, NgxBootstrapIconsModule.pick(allIcons)],
  exports: [MarkdownPipe, NgxBootstrapIconsModule],
})
export class SharedModule {}
