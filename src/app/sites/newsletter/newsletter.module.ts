import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewsletterConfirmComponent } from './newsletter-confirm/newsletter-confirm.component';
import { NewsletterQrComponent } from './newsletter-qr/newsletter-qr.component';
import { NewsletterUnsubscribeComponent } from './newsletter-unsubscribe/newsletter-unsubscribe.component';
import { NewsletterComponent } from './newsletter.component';

@NgModule({
  declarations: [
    NewsletterComponent,
    NewsletterQrComponent,
    NewsletterUnsubscribeComponent,
    NewsletterConfirmComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslatePipe,
    SharedModule,
  ],
  exports: [
    NewsletterComponent,
    NewsletterQrComponent,
    NewsletterUnsubscribeComponent,
    NewsletterConfirmComponent,
  ],
})
export class NewsletterModule {}
