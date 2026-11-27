import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ImprintComponent } from './imprint.component';

@NgModule({
  declarations: [ImprintComponent],
  imports: [CommonModule, TranslatePipe],
  exports: [ImprintComponent],
})
export class ImprintModule {}
