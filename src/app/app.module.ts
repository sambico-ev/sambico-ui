import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { env } from '../environment/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './sites/home/home.module';
import { BurgerButtonComponent } from './sites/toolbar/burger-button/burger-button.component';
import { ToolbarMenuComponent } from './sites/toolbar/toolbar-menu/toolbar-menu.component';
import { ToolbarComponent } from './sites/toolbar/toolbar.component';

export function createTranslateLoader(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

registerLocaleData(localeDe, 'de', localeDeExtra);

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
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ButtonsModule.forRoot(),
  ],
  providers: [{ provide: 'env', useValue: env }],
  bootstrap: [AppComponent],
})
export class AppModule {}
