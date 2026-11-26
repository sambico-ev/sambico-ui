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
    listen [::]:80;
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
    # nginx 1.24 on this server: http2 goes on the listen line
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name sambico.de;
    ssl_certificate     /etc/letsencrypt/live/sambico.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sambico.de/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;

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
sudo certbot certonly --manual --preferred-challenges dns --cert-name sambico.de -d sambico.de
```

certbot shows a TXT value for `_acme-challenge`. Put it into that record in the Hetzner DNS console (replace the old value; no spaces), wait until `dig +short TXT _acme-challenge.sambico.de @ns1.your-server.de` shows it, then continue in certbot. Only `sambico.de` can be done this way: Hetzner refuses `_acme-challenge.www` because `www` is a CNAME, so `www` gets its certificate in step 7. Until then it keeps pointing to Vercel, which redirects it to `sambico.de` anyway. Afterwards:

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
- `sambico.de` A → `178.104.6.98`, plus an AAAA record → `2a01:4f8:1c19:6647::1`
- `www`: leave it on Vercel for now; it redirects to `sambico.de`, which is now us

Mail is not affected: MX is a separate record. SPF's `+a` now allows the cloud server instead of Vercel, which is harmless.

### 7. Move www, and make the certificate renew itself

The manual certificate from step 4 does not renew. Once `dig +short sambico.de` shows `178.104.6.98`:

1. In the DNS console replace `www`'s CNAME with an A record → `178.104.6.98` and an AAAA record → `2a01:4f8:1c19:6647::1`.
2. As soon as `dig +short www.sambico.de` shows the new address, fetch one certificate for both names through the webroot; this also makes renewal automatic:

   ```bash
   sudo certbot certonly --webroot -w /var/www/certbot --cert-name sambico.de -d sambico.de -d www.sambico.de --expand --force-renewal
   sudo certbot renew --dry-run
   ```

3. Add the HTTPS block for www to `/etc/nginx/sites-available/sambico`, then `sudo nginx -t && sudo systemctl reload nginx`:

   ```nginx
   server {
       listen 443 ssl http2;
       listen [::]:443 ssl http2;
       server_name www.sambico.de;
       ssl_certificate     /etc/letsencrypt/live/sambico.de/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/sambico.de/privkey.pem;
       include /etc/letsencrypt/options-ssl-nginx.conf;
       return 301 https://sambico.de$request_uri;
   }
   ```

Between 1 and 2, `https://www.sambico.de` shows a certificate warning for a minute or two; `sambico.de` never does.

### 8. Rollback, and cleaning up

- If something is wrong: put the old records back (`sambico.de` A `216.198.79.1` and no AAAA, `www` CNAME `6eb89138070e33a7.vercel-dns-017.com.`). With TTL 300 visitors follow quickly.
- Once the new site has run without trouble for a while: delete the project in Vercel and set the TTLs back to `3600`.
