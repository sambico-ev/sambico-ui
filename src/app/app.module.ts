import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';

import { registerLocaleData } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr
} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { env } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogModule } from './sites/blog/blog.module';
import { FestivalModule } from './sites/festival/festival.module';
import { FooterModule } from './sites/footer/footer.module';
import { HomeModule } from './sites/home/home.module';
import { NewsletterModule } from './sites/newsletter/newsletter.module';
import { PrivacyModule } from './sites/privacy/privacy.module';
import { ToolbarModule } from './sites/toolbar/toolbar.module';

registerLocaleData(localeDe, 'de', localeDeExtra);

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    HomeModule,
    BrowserModule,
    FooterModule,
    BlogModule,
    FestivalModule,
    NewsletterModule,
    PrivacyModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToolbarModule
  ],
  providers: [
    { provide: 'env', useValue: env },
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideTranslateService({
      lang: 'de',
      fallbackLang: 'de',
      loader: provideTranslateHttpLoader({
        prefix: 'assets/i18n/',
        suffix: '.json'
      })
    })
  ]
})
export class AppModule {}
