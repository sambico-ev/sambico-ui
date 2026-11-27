import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteNames } from 'src/app/app-routing.module';
import { NewsletterService } from '../newsletter.service';

type Status = 'ready' | 'sending' | 'done' | 'error' | 'invalid';

@Component({
  selector: 'app-newsletter-confirm',
  templateUrl: './newsletter-confirm.component.html',
  styleUrls: ['../newsletter-unsubscribe/newsletter-unsubscribe.component.scss'],
})
export class NewsletterConfirmComponent {
  readonly routes = RouteNames;
  // ?u= is the old link form; opt-in mails sent before the switch still carry it
  private readonly target = this.route.snapshot.paramMap.has('subscriber')
    ? this.newsletterService.optinTarget(
        this.route.snapshot.paramMap.get('subscriber'),
        this.route.snapshot.queryParamMap.getAll('l'),
      )
    : this.newsletterService.listmonkTarget(
        this.route.snapshot.queryParamMap.get('u'),
        '/subscription/optin/',
      );
  status: Status = this.target ? 'ready' : 'invalid';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly newsletterService: NewsletterService,
  ) {}

  confirm() {
    if (!this.target) return;
    this.status = 'sending';
    this.newsletterService.confirm(this.target).subscribe({
      next: () => (this.status = 'done'),
      error: () => (this.status = 'error'),
    });
  }
}
