import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { FooterComponent } from './footer.component';

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, TranslateModule, RouterModule, SharedModule],
  exports: [FooterComponent],
})
export class FooterModule {}
