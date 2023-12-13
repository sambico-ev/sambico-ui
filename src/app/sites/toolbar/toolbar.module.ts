import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BurgerButtonComponent } from './burger-button/burger-button.component';
import { ToolbarMenuComponent } from './toolbar-menu/toolbar-menu.component';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
  declarations: [ToolbarComponent, BurgerButtonComponent, ToolbarMenuComponent],
  imports: [CommonModule, TranslateModule, RouterModule, SharedModule],
  exports: [ToolbarComponent],
  // exports: [HomeComponent]
})
export class ToolbarModule {}
