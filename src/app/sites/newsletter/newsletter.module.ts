import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewsletterQrComponent } from './newsletter-qr/newsletter-qr.component';
import { NewsletterUnsubscribeComponent } from './newsletter-unsubscribe/newsletter-unsubscribe.component';
import { NewsletterComponent } from './newsletter.component';

@NgModule({
  declarations: [
    NewsletterComponent,
    NewsletterQrComponent,
    NewsletterUnsubscribeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    SharedModule,
  ],
  exports: [
    NewsletterComponent,
    NewsletterQrComponent,
    NewsletterUnsubscribeComponent,
  ],
})
export class NewsletterModule {}
