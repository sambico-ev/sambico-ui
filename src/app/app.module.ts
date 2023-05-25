import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { env } from '../environment/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './sites/home/home.module';
import { SlideshowModule } from './sites/slideshow/slideshow.module';
import { BurgerButtonComponent } from './sites/toolbar/burger-button/burger-button.component';
import { ToolbarMenuComponent } from './sites/toolbar/toolbar-menu/toolbar-menu.component';
import { ToolbarComponent } from './sites/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    BurgerButtonComponent,
    ToolbarMenuComponent,
  ],
  imports: [
    HomeModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SlideshowModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    ButtonsModule.forRoot(),
  ],
  providers: [{ provide: 'env', useValue: env }],
  bootstrap: [AppComponent],
})
export class AppModule {}
