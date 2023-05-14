import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlideshowModule } from './slideshow/slideshow.module';
import { ToolbarModule } from './toolbar/toolbar.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot(),
    ToolbarModule,
    SlideshowModule,
    BrowserAnimationsModule,
    ButtonsModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
