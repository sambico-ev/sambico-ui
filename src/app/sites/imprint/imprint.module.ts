import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImprintComponent } from './imprint.component';



@NgModule({
  declarations: [
    ImprintComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ImprintComponent]
})
export class ImprintModule { }
