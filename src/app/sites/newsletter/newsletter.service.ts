import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Environment } from 'src/app/shared/models/env.model';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  constructor(
    private readonly http: HttpClient,
    @Inject('env') private readonly env: Environment,
  ) {}

  // listmonk sends the double opt-in mail itself; the address only counts once confirmed
  subscribe(email: string, name: string) {
    return this.http.post<{ data: boolean }>(
      `${this.env.newsletterUrl}/api/public/subscription`,
      {
        email,
        ...(name && { name }),
        list_uuids: this.env.newsletterListUuids,
      },
    );
  }

  // the mails link to our pages with listmonk's own URL as ?u=; only pass it
  // on when it really points at our listmonk, never at anything else
  listmonkTarget(raw: string | null, path: '/subscription/' | '/subscription/optin/') {
    if (!raw) return null;
    try {
      const target = new URL(raw);
      const listmonk = new URL(this.env.newsletterUrl);
      return target.origin === listmonk.origin &&
        target.pathname.startsWith(path)
        ? target.href
        : null;
    } catch {
      return null;
    }
  }

  // listmonk answers both with an HTML page; only the status matters here
  unsubscribe(target: string) {
    return this.http.post(target, new HttpParams(), { responseType: 'text' });
  }

  // only this POST confirms; mail scanners open the link but never press the button
  confirm(target: string) {
    return this.http.post(target, new HttpParams().set('confirm', 'true'), {
      responseType: 'text',
    });
  }
}
