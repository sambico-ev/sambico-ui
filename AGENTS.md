# SAMBICO UI — AI Agent Reference

This file contains comprehensive context about the project for AI coding agents.

---

## Overview

**sambico-ui** is the frontend web application for **SAMBICO e.V.**, a German non-profit association (Verein) based in Backnang that fundraises to support development projects in Zambia.

- **Framework**: Angular 22 (NgModules, components declared `standalone: false`; zone.js change detection kept as `Eager`, the pre-22 behaviour)
- **Language**: TypeScript ~6.0 (Node 22.22.3 or newer for the CLI)
- **Styling**: SCSS + Bootstrap 5
- **i18n**: `@ngx-translate/core`, default language **German (`de`)**
- **Backend/CMS**: Strapi 4 or 5 (the data layer reads both, see Data Models) at `https://cms.sambico.de` (repo `sambico-cms`, same Hetzner server as the site)
- **Newsletter**: listmonk at `https://newsletter.sambico.de` (see Newsletter below)
- **Tests**: none; the Karma/Jasmine setup was removed with the Angular 22 upgrade
- **Build**: `@angular/build:application` (esbuild); output stays flat in `dist/sambico-ui/`

---

## Organisation Details

| Field | Value |
|---|---|
| Name | SAMBICO e.V. |
| Address | Murrhardter Str. 30, 71522 Backnang |
| Email | kontakt@sambico.de |
| Instagram | instagram.com/sambico |
| TikTok | tiktok.com/@sambicoe.v |
| Facebook | facebook.com/SambicoeV |
| Bank IBAN | DE07 6025 0010 0015 2080 79 (Kreissparkasse Waiblingen) |
| Registry | Vereinsregister Amtsgericht Stuttgart, VR 725855 |
| Representatives | Silvan Vollmer, Laura Radatz, Julian Hofer, Adrian Vollmer, Max Härtner (also in the listmonk campaign template footer) |

---

## Commands

```bash
npm start       # ng serve  — dev server at http://localhost:4200
npm run build   # ng build  — production build to dist/sambico-ui/
npm run watch   # ng build --watch --configuration development
```

Hosting and deploys (nginx on the Hetzner server, `deploy.sh`): see `DEPLOYMENT.md`.

---

## Routing

Defined in `src/app/app-routing.module.ts`. Route names are exported via the `RouteNames` enum.

| Path | Component | RouteNames key |
|---|---|---|
| `` (empty) | `HomeComponent` | `HOME` |
| `blog` | `BlogComponent` | `BLOG` |
| `blog/:id` | `BlogComponent` | — |
| `impressum` | `ImprintComponent` | `IMPRINT` |
| `datenschutz` | `PrivacyComponent` | `PRIVACY` |
| `projekte` | `ProjectsComponent` | `PROJECTS` |
| `festival` | `FestivalComponent` | `FESTIVAL` |
| `newsletter` | `NewsletterComponent` | `NEWSLETTER` |
| `newsletter/qr` | `NewsletterQrComponent` | `NEWSLETTER_QR` |
| `newsletter/abmelden`, `…/:campaign/:subscriber` | `NewsletterUnsubscribeComponent` | `NEWSLETTER_UNSUBSCRIBE` |
| `newsletter/bestaetigen`, `…/:subscriber` | `NewsletterConfirmComponent` | `NEWSLETTER_CONFIRM` |
| `**` | `HomeComponent` | — |

Always reference routes via `RouteNames` enum, never hardcode path strings.

`blog/:id` shows that one entry (with a link back to the list). `:id` is the entry's `documentId` on Strapi 5 and the numeric id on Strapi 4; `blogRouteKey()` builds it, and `StrapiService.getBlogPost()` accepts both on either server, so links keep working across the CMS move. An id that matches nothing shows the whole list. Newsletter mails that link to a post should use `https://sambico.de/blog/<documentId>`.

---

## Project Structure

```
src/
  main.ts
  styles.scss          # Global styles, Bootstrap imports, font declarations, utility classes
  variables.scss       # Bootstrap theme overrides (colors, spacing vars)
  environments/
    environment.ts          # Dev: strapiUrl + strapiApiToken
    environment.prod.ts     # Prod: same credentials
  assets/
    fonts/             # Poppins (thin/light/medium) + Vollkorn (regular/extra-bold)
    i18n/
      de.json          # PRIMARY translation file (German)
      en.json          # Partial English overrides
    icons/             # SVG icons (e.g. donate.svg)
    logo/              # logo-full-horizontal.png, logo-text-alt.png
    files/             # Downloadable files (e.g. membership application PDF)
  app/
    app.module.ts          # Root module — bootstraps AppComponent
    app-routing.module.ts  # Routes + RouteNames enum
    app.component.ts       # Sets lang to 'de', inits TitleService, handles fragment scroll
    shared/
      shared.module.ts     # Exports: MarkdownPipe, NgxBootstrapIconsModule
      models/
        strapi.models.ts   # Flat models the components use + the raw Strapi 4/5 response types + StrapiTypes enum
        breakpoint.model.ts # Breakpoints enum
        env.model.ts       # Environment interface
      pipes/
        markdown.pipe.ts   # `markdown` pipe — wraps marked.parse()
      services/
        strapi.service.ts  # All Strapi HTTP calls + getStrapiImageUrl()
        strapi.normalize.ts # Pure functions: Strapi 4/5 response -> flat models (no Angular imports)
        breakpoint.service.ts # CDK breakpoint observer, isMobile()
        title.service.ts   # Updates document.title on route change
    sites/
      home/              # Shell page: slideshow + welcome + blog-preview + projects-preview
      slideshow/         # ngx-bootstrap carousel, Strapi sliders (reversed order)
      welcome/           # Strapi welcome-text, renders markdown
      blog/              # Full blog list (all posts, sorted by publishedAt desc)
        blog-entry/      # Single blog card component (@Input() blog: Blog)
      blog-preview/      # Home preview: 1 post (mobile) / 3 posts (desktop)
      newsletter/        # Signup, QR, confirm and unsubscribe pages + NewsletterService (listmonk)
      privacy/           # Datenschutzerklärung (static; promises tied to the server setup)
      festival/          # Festival page
      projects/          # Full projects list (reversed order, markdown content)
      projects-preview/  # Slot machine animation cycling through projects
      toolbar/           # Top nav bar (logo, social icons, burger menu)
        toolbar-menu/    # Expanded menu panel (nav, participate, social sections)
        burger-button/   # Animated hamburger toggle button
      footer/            # Address, nav links, social icons, copyright
      imprint/           # Static legal / Impressum page
```

---

## Shared Module

`SharedModule` must be imported in any feature module that needs:
- **`MarkdownPipe`** — use `[innerHTML]="value | markdown"` to render Strapi markdown content as HTML (`marked.parse`, synchronous)
- **`NgxBootstrapIconsModule`** — use `<i-bs name="icon-name" width="X" height="X">` for Bootstrap Icons. Only the icons listed in `shared.module.ts` are bundled (`allIcons` would add 1 MB); add a new icon there when a template needs one

---

## Services

### `StrapiService`
Injected via `'env'` token. All methods return `Observable`.

| Method | Returns | Notes |
|---|---|---|
| `getSlider()` | `Observable<Slide[]>` | Fetches slideshow slides |
| `getProjects(count?)` | `Observable<Project[]>` | Optional `count` limits results |
| `getWelcomeText()` | `Observable<WelcomeText>` | Single entry (title, subTitle, content) |
| `getBlogPosts(count?, orderDir?)` | `Observable<Blog[]>` | `orderDir`: `'asc'`\|`'desc'`, default `'asc'` |
| `getBlogPost(key)` | `Observable<Blog \| undefined>` | Picks the entry whose `documentId` or numeric `id` equals `key` out of the list |
| `getStrapiImageUrl(formats, size)` | `string` | Falls back to next available size if requested size missing |

Image size options (approx px widths): `xsmall`(96), `thumbnail`(156), `small`(563), `medium`(750), `large`(1440), `xlarge`(1920).

### `BreakpointService`
- `getBreakpoint()`: `Observable<Breakpoints>`
- `isMobile()`: `Observable<boolean>` — true when viewport ≤ 700px
- Breakpoints enum: `MOBILE = '(max-width: 700px)'`, `DESKTOP = '(min-width: 701px)'`

### `TitleService`
- Call `init()` once in `AppComponent` constructor
- Base title: `"SAMBICO e.V."`, appends `" - ROUTE"` on navigation

---

## Data Models (Strapi)

The CMS is moving from Strapi 4 to Strapi 5, and the UI has to work against both while the two are not deployed at the same moment. `StrapiService` is the only place that knows the difference; it hands the components one flat shape (`strapi.models.ts`, converted in `strapi.normalize.ts`):

| | Strapi 4 | Strapi 5 | What components get |
|---|---|---|---|
| Entry | `{ id, attributes: { ...fields } }` | `{ id, documentId, ...fields }` | `{ id, documentId?, ...fields }` |
| Media field | `{ data: { id, attributes: { url, formats } } \| null }` | the file object, `null` or `[]` | `Media \| null` |
| Single entry URL | `/api/blogs/:id` (numeric) | `/api/blogs/:documentId` | not used, see `getBlogPost` |

Only the `Authorization` header is sent; any custom header would trigger a CORS preflight that the Strapi 4 server rejects. The numeric `id` of a Strapi 5 entry differs between draft and published rows and per locale, so links use `documentId` (`blogRouteKey()`).

```typescript
// Strapi content types
StrapiTypes.BLOG         = 'blogs'
StrapiTypes.SLIDER       = 'sliders'
StrapiTypes.WELCOME_TEXT = 'welcome-text'
StrapiTypes.PROJECT      = 'projects'

// Project
{ id, documentId?, title, subtitle, content (markdown), publishedAt }

// Blog
{ id, documentId?, title, subTitle?, content (markdown), image, previewButtonText?, date, publishedAt }

// Slide
{ id, documentId?, title, subtitle, buttonText, link, image, publishedAt }

// WelcomeText
{ title, subTitle, content (markdown) }
```

Locale: no `locale` parameter is sent, so each server answers with its default locale. A Strapi 5 server whose default locale is not German needs that checked when it goes live.

---

## Styling System

### Colors (Bootstrap CSS Variables)
| Variable | Hex | Usage |
|---|---|---|
| `--bs-primary` | `#0c3521` | Dark green — main background |
| `--bs-secondary` | `#f49912` | Orange/amber — CTAs, links, accents |
| `--bs-tertiary` | `#432a18` | Dark brown |
| `--bs-light` | `#f3f1f0` | Off-white — body text, headings |
| `--bs-success` | `#098757` | |
| `--bs-danger` | `#f72314` | |

### Typography
- Body font: `poppins-light` (default), `poppins-medium` (headings/buttons)
- Display font: `vollkorn-bold` (h1 page headings)
- Font sizes use fluid scaling: `calc(Xpx + 0.390625vw)`
- All fonts are self-hosted in `src/assets/fonts/`

### Spacing Utilities (generated in styles.scss)
- `.padding-{4|8|16|32}`, `.padding-{top|bottom|left|right}-{4|8|16|32}`
- `.margin-{4|8|16|32}`, `.margin-{top|bottom|left|right}-{4|8|16|32}`

### Responsive Pattern
Components use `isMobile = this.breakpointService.isMobile()` (an `Observable<boolean>`) and apply `[class.mobile]="isMobile | async"` to toggle mobile-specific styles. The breakpoint is **700px**.

Global vars:
```scss
$padding: calc(8px + 1.5625vw);
$footer-height: 225px;
$header-height: 120px;
$header-height-mobile: 80px;
```

---

## Feature Module Pattern

Angular 22 generates standalone components by default; this app declares them in modules, so use `ng generate component ... --standalone=false` or write the standalone component and import it.

Each page/feature has its own NgModule. When creating a new component:
1. Create the module file (e.g. `my-feature.module.ts`)
2. Import `SharedModule` if markdown or icons are needed
3. Import `CommonModule`, `RouterModule` as needed
4. Add the component to `declarations` and `exports`
5. Import the module in `AppModule` (for top-level pages)

Angular schematics are configured to:
- Skip test file generation (`skipTests: true`)
- Default to SCSS stylesheets

---

## i18n Translation Keys

Translation files live in `src/assets/i18n/`. German (`de.json`) is the source of truth; English (`en.json`) contains only partial overrides.

Key namespaces:
- `toolbar.actions.*` — nav menu labels (blog, projects, participate, contact, imprint, social, donate, download_membership_application, facebook, instagram, tiktok)
- `blogPreview.*` — showAll, readMore, title
- `newsletter.*` — signup, QR, confirm (`newsletter.confirm.*`) and unsubscribe (`newsletter.unsubscribe.*`) pages
- `privacy.title`
- `projectPreview.*` — showAll, title
- `projects.*` — title, info
- `blog.title`, `imprint.title`, `home.tabTitle`
- `footer.rights-reserved`
- `contact`, `readMore`

Use `{{ 'key' | translate }}` in templates. The pipe is available globally via the root `TranslateModule.forRoot()`.

---

## Environment / Backend Config

The `env` object is provided via `{ provide: 'env', useValue: env }` in `AppModule` and injected with `@Inject('env')` in services.

```typescript
interface Environment {
  production: boolean;
  strapiUrl: string;      // 'https://cms.sambico.de'
  strapiApiToken: string; // Bearer token for Strapi API
  newsletterUrl: string;  // listmonk, 'https://newsletter.sambico.de'
  newsletterListUuids: string[]; // listmonk list(s) the public form subscribes to
}
```

API base URL: `${strapiUrl}/api/`  
All requests include header: `Authorization: Bearer <strapiApiToken>`

---

## Newsletter (listmonk)

The newsletter runs on **listmonk** at `newsletter.sambico.de`, not Strapi. The site only talks to its public endpoints:

- `/newsletter`: signup form, posts to `POST /api/public/subscription`. listmonk sends the double opt-in mail itself. A hidden `website` field is a honeypot: when filled, the form fakes success and sends nothing.
- `/newsletter/qr`: QR code for events. It is a static SVG (`assets/images/newsletter-qr.svg`) pointing at `https://sambico.de/newsletter`; regenerate it only if that URL changes.
- `/newsletter/bestaetigen/<subscriber-uuid>?l=<list-uuid>`: the confirmation mail links here (template in `sambico-cms/listmonk-static/`). Only the button posts `confirm=true` to listmonk's opt-in URL; mail scanners open links but never press it.
- `/newsletter/abmelden/<campaign-uuid>/<subscriber-uuid>`: the campaign template links here (`{{ .Campaign.UUID }}/{{ .Subscriber.UUID }}`).
- The links carry only UUIDs, never a nested URL, because spam filters read a URL inside a URL as phishing. `NewsletterService` rebuilds listmonk's URLs from them. The old `?u=<listmonk URL>` form still works for mails sent before the switch and is only passed on when it points at `newsletterUrl`.

## Notable Patterns & Conventions

- **Fragment scrolling**: `AppComponent.ngOnInit` subscribes to `ActivatedRoute.fragment` and calls `scrollIntoView` on the matching element ID.
- **Slot machine (ProjectsPreview)**: Uses `setTimeout` chains with `SLOT_DELAYS = [185, 175, 170, 210, 280, 340, 400]`ms. Starts/stops based on scroll visibility (component must be ≥30% in viewport). Angular `@slideCard` animation handles enter/leave transitions.
- **Blog fade-in (BlogPreview)**: Uses Angular `@animate` state machine (`show`/`hide`) triggered by scroll position.
- **Menu close on outside click**: `ToolbarComponent` uses `@HostListener('document:mousedown')` to close the menu.
- **Menu close on navigation**: `ToolbarComponent` subscribes to `router.events` and closes on `NavigationEnd`.
- **Image fallback**: `getStrapiImageUrl()` falls back gracefully through `large → medium → small` if the requested size doesn't exist.
- **Blog sorting**: Always sorted client-side by `publishedAt` descending. Slider is reversed (`res.reverse()`). Projects are also reversed.

---

## Known Issues / Notes

- Page titles come from `TitleService` (route path in upper case); there is no route title resolver.
- The slot machine in `ProjectsPreviewComponent` is switched off (the calls are commented out); the preview shows one random project.
- Sass: Bootstrap 5 and our styles still use `@import`; the Sass deprecation warnings for it are silenced in `angular.json` until Bootstrap 6 or a move to `@use`.
- `en.json` is intentionally sparse; the app always defaults to German.
