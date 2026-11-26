import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PrivacyComponent } from './privacy.component';

@NgModule({
  declarations: [PrivacyComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [PrivacyComponent],
})
export class PrivacyModule {}
