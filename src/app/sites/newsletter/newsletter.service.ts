import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Environment } from 'src/app/shared/models/env.model';

const isUuid = (value: string | null): value is string =>
  !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

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

  // the old link form carried listmonk's own URL as ?u=; only pass it on when
  // it really points at our listmonk, never at anything else
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

  // The mails link to our pages with only the UUIDs listmonk's own URLs are
  // made of, never a nested URL (spam filters read those as phishing):
  //   /newsletter/bestaetigen/<subscriber>?l=<list>
  //   /newsletter/abmelden/<campaign>/<subscriber>
  // Here the listmonk URLs are rebuilt from them.
  optinTarget(subscriber: string | null, lists: string[]) {
    if (!isUuid(subscriber) || !lists.length || !lists.every(isUuid)) return null;
    const target = new URL(`/subscription/optin/${subscriber}`, this.env.newsletterUrl);
    lists.forEach((l) => target.searchParams.append('l', l));
    return target.href;
  }

  unsubscribeTarget(campaign: string | null, subscriber: string | null) {
    if (!isUuid(campaign) || !isUuid(subscriber)) return null;
    return new URL(`/subscription/${campaign}/${subscriber}`, this.env.newsletterUrl).href;
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
