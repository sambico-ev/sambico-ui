import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule, NbButtonModule],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
