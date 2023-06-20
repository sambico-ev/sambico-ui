import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { MarkdownPipe } from 'src/app/shared/pipes/markdown.pipe';

@NgModule({
  declarations: [WelcomeComponent, MarkdownPipe],
  imports: [CommonModule],
  exports: [WelcomeComponent],
})
export class WelcomeModule {}
