import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsletterService } from '../newsletter.service';

type Status = 'ready' | 'sending' | 'done' | 'expired' | 'error' | 'invalid';

@Component({
  selector: 'app-newsletter-unsubscribe',
  templateUrl: './newsletter-unsubscribe.component.html',
  styleUrls: ['./newsletter-unsubscribe.component.scss'],
})
export class NewsletterUnsubscribeComponent {
  private readonly target = this.newsletterService.unsubscribeTarget(
    this.route.snapshot.queryParamMap.get('u'),
  );
  status: Status = this.target ? 'ready' : 'invalid';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly newsletterService: NewsletterService,
  ) {}

  unsubscribe() {
    if (!this.target) return;
    this.status = 'sending';
    this.newsletterService.unsubscribe(this.target).subscribe({
      next: () => (this.status = 'done'),
      // listmonk answers 403 when the signed link has expired
      error: (err: HttpErrorResponse) =>
        (this.status = err.status === 403 ? 'expired' : 'error'),
    });
  }
}
