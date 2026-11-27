# Deployment

The site is a static Angular build served by nginx on the Hetzner cloud server (`178.104.6.98`, `2a01:4f8:1c19:6647::1`, Ubuntu 24.04, arm64). The same server runs Strapi (`cms.sambico.de`), listmonk (`newsletter.sambico.de`) and Leantime (`pm.sambico.de`); the server as a whole is described in `sambico-cms/DEPLOYMENT.md`, the newsletter in `sambico-cms/NEWSLETTER-SETUP.md`.

We left Vercel in November 2026 because its Hobby plan has no data processing agreement (Art. 28 DSGVO); with one server all visitor data stays with one processor (Hetzner). The Datenschutzerklärung (`src/app/sites/privacy/`) says so; hosting elsewhere means changing it.

## Current state

| What | Where |
|---|---|
| Files | `/var/www/sambico` (only build output, replaced on every deploy) |
| nginx | `/etc/nginx/sites-available/sambico` (config below) |
| Certificate | `sambico.de` + `www.sambico.de`, Let's Encrypt, renews by itself through the webroot `/var/www/certbot` |
| DNS | Hetzner DNS console, zone `sambico.de`: `@` and `www` A → `178.104.6.98`, AAAA → `2a01:4f8:1c19:6647::1`, TTL 3600 |
| Redirects | `www.sambico.de` and `http://` → `https://sambico.de` |
| Vercel | not serving anything any more; the old project only waits to be deleted |

## Deploying an update

```bash
SAMBICO_HOST=root@178.104.6.98 RSYNC_RSH="ssh -i ~/.ssh/id_ed25519_hetzner" ./deploy.sh
```

It runs `npm ci` and the production build, then copies `dist/sambico-ui/` to `/var/www/sambico` with `rsync --delete`. nginx serves the new files immediately; nothing restarts. `index.html` is never cached, the hashed JS/CSS files are cached for a year, so visitors get the new version on their next page load.

When the build already exists, the copy alone is enough:

```bash
rsync -az --delete -e "ssh -i ~/.ssh/id_ed25519_hetzner" dist/sambico-ui/ root@178.104.6.98:/var/www/sambico/
```

The trailing slashes matter. Check afterwards: `curl -s https://sambico.de/ | grep -o 'main\.[a-f0-9]*\.js'` shows the new build's file name.

## nginx

`/etc/nginx/sites-available/sambico`, linked into `sites-enabled`. The server runs nginx 1.24: `http2` goes on the `listen` line (`http2 on;` is not supported). After any change: `sudo nginx -t && sudo systemctl reload nginx`, never reload without the test.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name sambico.de www.sambico.de;

    # certificate renewal answers here
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://sambico.de$request_uri;
    }
}

server {
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

## Certificate

One certificate for both names, fetched through the webroot, so renewal needs no DNS step. `sudo certbot renew --dry-run` proves it. Should it ever have to be fetched again:

```bash
sudo certbot certonly --webroot -w /var/www/certbot --cert-name sambico.de -d sambico.de -d www.sambico.de
```

## Moving the site again

The move from Vercel went like this, and a future move works the same way:

1. A day ahead, set the TTL of the records that change to `300`, so the switch and a rollback reach visitors quickly.
2. Set up the new host and test it without DNS: `curl -sI --resolve sambico.de:443:<new IP> https://sambico.de/newsletter`, or an `/etc/hosts` line for a real look.
3. Switch the A/AAAA records, keep the old host running as the rollback until the new one has run quietly for a few days.
4. Raise the TTLs again (`3600`, the highest step below a day that the console offers).

Hetzner's DNS refuses `_acme-challenge` records under a name that is a CNAME; that is why `www` was switched to A/AAAA records first and certified afterwards.
