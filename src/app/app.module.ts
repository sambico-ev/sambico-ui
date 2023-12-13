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
import { env } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogModule } from './sites/blog/blog.module';
import { FooterModule } from './sites/footer/footer.module';
import { HomeModule } from './sites/home/home.module';
import { ToolbarModule } from './sites/toolbar/toolbar.module';

export function createTranslateLoader(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

registerLocaleData(localeDe, 'de', localeDeExtra);

@NgModule({
  declarations: [AppComponent],
  imports: [
    HomeModule,
    BrowserModule,
    HttpClientModule,
    FooterModule,
    BlogModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToolbarModule,
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
