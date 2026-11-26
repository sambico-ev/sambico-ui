# Deployment

The site is a static Angular build served by nginx on the Hetzner cloud server (`178.104.6.98`). The same server runs Strapi (`cms.sambico.de`) and listmonk (`newsletter.sambico.de`); their setup lives in `sambico-cms/DEPLOYMENT.md` and `sambico-cms/NEWSLETTER-SETUP.md`.

We left Vercel because its Hobby plan has no data processing agreement (Art. 28 DSGVO), and that one server keeps all visitor data with one processor. The Datenschutzerklärung (`src/app/sites/privacy/`) says so; hosting elsewhere means changing it.

## Deploying an update

```bash
SAMBICO_HOST=user@178.104.6.98 ./deploy.sh
```

It builds, then copies `dist/sambico-ui/` to `/var/www/sambico` on the server. nginx serves new files immediately; nothing restarts.

## Moving from Vercel (once)

The order keeps the live site on Vercel until the new one is proven, and lets you switch back by changing DNS again.

### 1. Lower the DNS TTL

In konsoleH, set the TTL of `sambico.de` (A) and `www` (CNAME) to `300`. Wait for the old TTL (`7200` s) to run out before step 5, so the switch and any rollback reach visitors quickly.

### 2. Stop Vercel from deploying

In Vercel → project → Settings → Git, disconnect the repository. Otherwise the next push deploys the newsletter pages to Vercel before listmonk exists. Leave the current deployment running; it is the rollback.

### 3. Prepare the server

```bash
sudo mkdir -p /var/www/sambico /var/www/certbot && sudo chown $USER /var/www/sambico
```

Then deploy once from your machine: `SAMBICO_HOST=user@178.104.6.98 ./deploy.sh`.

Create `/etc/nginx/sites-available/sambico`:

```nginx
server {
    listen 80;
    server_name sambico.de www.sambico.de;

    # certificate renewal (step 7) answers here
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://sambico.de$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name www.sambico.de;
    ssl_certificate     /etc/letsencrypt/live/sambico.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sambico.de/privkey.pem;
    return 301 https://sambico.de$request_uri;
}

server {
    listen 443 ssl;
    server_name sambico.de;
    ssl_certificate     /etc/letsencrypt/live/sambico.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sambico.de/privkey.pem;

    root /var/www/sambico;
    index index.html;

    # Angular routes (/blog, /newsletter, ...) all load index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # the build hashes file names, so these never change under the same name
    location ~* \.(js|css|woff2?|ttf|svg|png|jpe?g|webp|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
```

### 4. Get the certificate before switching

DNS still points at Vercel, so the usual HTTP check can't reach this server yet. Use the DNS check instead:

```bash
sudo certbot certonly --manual --preferred-challenges dns -d sambico.de -d www.sambico.de
```

certbot shows TXT records for `_acme-challenge`. Add them in konsoleH, wait until `dig +short TXT _acme-challenge.sambico.de` shows them, then continue in certbot. Afterwards:

```bash
sudo ln -s /etc/nginx/sites-available/sambico /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Test on the server, without DNS

From your machine:

```bash
curl -sI --resolve sambico.de:443:178.104.6.98 https://sambico.de/newsletter
```

That should return `200`. For a real look, add `178.104.6.98 sambico.de www.sambico.de` to `/etc/hosts`, then click through home, blog, projects, Impressum, Datenschutz, the newsletter and a reload on a sub-page. Remove the line afterwards.

### 6. Switch DNS

In konsoleH:
- `sambico.de` A → `178.104.6.98`
- `www`: delete the CNAME to Vercel, add an A record → `178.104.6.98`

Mail is not affected: MX is a separate record. SPF's `+a` now allows the cloud server instead of Vercel, which is harmless.

### 7. Make the certificate renew itself

The manual certificate from step 4 does not renew. Once DNS points here (`dig +short sambico.de` shows `178.104.6.98`):

```bash
sudo certbot certonly --webroot -w /var/www/certbot --cert-name sambico.de -d sambico.de -d www.sambico.de --force-renewal
sudo certbot renew --dry-run
sudo systemctl reload nginx
```

### 8. Rollback, and cleaning up

- If something is wrong: put the old records back (`sambico.de` A `216.198.79.1`, `www` CNAME `6eb89138070e33a7.vercel-dns-017.com.`). With TTL 300 visitors follow quickly.
- Once the new site has run without trouble for a while: delete the project in Vercel and set the TTLs back to `3600`.
