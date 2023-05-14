import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlideshowModule } from './core/components/slideshow/slideshow.module';
import { BurgerButtonComponent } from './core/components/toolbar/burger-button/burger-button.component';
import { ToolbarComponent } from './core/components/toolbar/toolbar.component';

@NgModule({
  declarations: [AppComponent, ToolbarComponent, BurgerButtonComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlideshowModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    ButtonsModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
