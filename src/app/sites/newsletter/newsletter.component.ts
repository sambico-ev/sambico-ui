import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsletterService } from './newsletter.service';
import { RouteNames } from 'src/app/app-routing.module';

type Status = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss'],
  standalone: false
})
export class NewsletterComponent {
  readonly routes = RouteNames;
  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    name: new FormControl('', { nonNullable: true }),
    // honeypot: hidden from people, bots fill every field they find
    website: new FormControl('', { nonNullable: true })
  });
  status: Status = 'idle';

  constructor(private readonly newsletterService: NewsletterService) {}

  submit() {
    const { email, name, website } = this.form.getRawValue();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // a bot gets the same answer as a person, so it learns nothing
    if (website) {
      this.status = 'sent';
      return;
    }
    this.status = 'sending';
    this.newsletterService.subscribe(email, name.trim()).subscribe({
      next: () => (this.status = 'sent'),
      error: () => (this.status = 'error')
    });
  }
}
