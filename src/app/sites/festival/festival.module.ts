import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxBootstrapIconsModule } from "ngx-bootstrap-icons";
import { FestivalComponent } from './festival.component';

@NgModule({
  declarations: [FestivalComponent],
  imports: [CommonModule, TranslatePipe, RouterModule, NgxBootstrapIconsModule],
  exports: [FestivalComponent],
})
export class FestivalModule {}
