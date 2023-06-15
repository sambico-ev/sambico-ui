import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BurgerButtonComponent } from './burger-button/burger-button.component';
import { ToolbarMenuComponent } from './toolbar-menu/toolbar-menu.component';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
  declarations: [ToolbarComponent, BurgerButtonComponent, ToolbarMenuComponent],
  imports: [CommonModule, TranslateModule, RouterModule],
  exports: [ToolbarComponent],
  // exports: [HomeComponent]
})
export class ToolbarModule {}
