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
  // ?u= is the old link form; newsletters sent before the template switch carry it
  private readonly target = this.route.snapshot.paramMap.has('subscriber')
    ? this.newsletterService.unsubscribeTarget(
        this.route.snapshot.paramMap.get('campaign'),
        this.route.snapshot.paramMap.get('subscriber'),
      )
    : this.newsletterService.listmonkTarget(
        this.route.snapshot.queryParamMap.get('u'),
        '/subscription/',
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
      // listmonk versions with signed links answer 403 once a link has expired
      error: (err: HttpErrorResponse) =>
        (this.status = err.status === 403 ? 'expired' : 'error'),
    });
  }
}
