# SAMBICO UI — AI Agent Reference

This file contains comprehensive context about the project for AI coding agents.

---

## Overview

**sambico-ui** is the frontend web application for **SAMBICO e.V.**, a German non-profit association (Verein) based in Backnang that fundraises to support development projects in Zambia.

- **Framework**: Angular 15 (standalone component schematics disabled; uses NgModules)
- **Language**: TypeScript ~4.9.4
- **Styling**: SCSS + Bootstrap 5
- **i18n**: `@ngx-translate/core`, default language **German (`de`)**
- **Backend/CMS**: Strapi v4 (hosted at `https://strapi-vnv3.onrender.com`)
- **Test runner**: Karma + Jasmine (tests skipped by default per schematics config)

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
| Representatives | Silvan Vollmer, Laura Radatz, Julian Hofer, Janine Weißschuh, Max Härtner |

---

## Commands

```bash
npm start       # ng serve  — dev server at http://localhost:4200
npm run build   # ng build  — production build to dist/sambico-ui/
npm test        # ng test   — Karma/Jasmine unit tests
npm run watch   # ng build --watch --configuration development
```

---

## Routing

Defined in `src/app/app-routing.module.ts`. Route names are exported via the `RouteNames` enum.

| Path | Component | RouteNames key |
|---|---|---|
| `` (empty) | `HomeComponent` | `HOME` |
| `blog` | `BlogComponent` | `BLOG` |
| `blog/:id` | `BlogComponent` | — |
| `impressum` | `ImprintComponent` | `IMPRINT` |
| `projekte` | `ProjectsComponent` | `PROJECTS` |
| `**` | `HomeComponent` | — |

Always reference routes via `RouteNames` enum, never hardcode path strings.

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
    app-routing.module.ts  # Routes + RouteNames enum + TitleResolver
    app.component.ts       # Sets lang to 'de', inits TitleService, handles fragment scroll
    shared/
      shared.module.ts     # Exports: MarkdownPipe, NgxBootstrapIconsModule
      models/
        strapi.models.ts   # All Strapi API interfaces + StrapiTypes enum
        calEvent.model.ts  # CalEvent interface
        breakpoint.model.ts # Breakpoints enum
        env.model.ts       # Environment interface
      pipes/
        markdown.pipe.ts   # `markdown` pipe — wraps marked() library
      services/
        strapi.service.ts  # All Strapi HTTP calls + getStrapiImageUrl()
        breakpoint.service.ts # CDK breakpoint observer, isMobile()
        title.service.ts   # Updates document.title on route change
        utils.service.ts   # shuffleArray<T>(), parseDate() (DD.MM.YYYY)
    sites/
      home/              # Shell page: slideshow + welcome + blog-preview + projects-preview
      slideshow/         # ngx-bootstrap carousel, Strapi sliders (reversed order)
      welcome/           # Strapi welcome-text, renders markdown
      blog/              # Full blog list (all posts, sorted by publishedAt desc)
        blog-entry/      # Single blog card component (@Input() blog: Blog)
      blog-preview/      # Home preview: 1 post (mobile) / 3 posts (desktop) + events
      events/            # Upcoming events list (@Input() events: CalEvent[])
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
- **`MarkdownPipe`** — use `[innerHTML]="value | markdown"` to render Strapi markdown content as HTML
- **`NgxBootstrapIconsModule`** — use `<i-bs name="icon-name" width="X" height="X">` for Bootstrap Icons

---

## Services

### `StrapiService`
Injected via `'env'` token. All methods return `Observable`.

| Method | Returns | Notes |
|---|---|---|
| `getSlider()` | `Observable<Slide[]>` | Fetches slideshow slides |
| `getProjects(count?)` | `Observable<Project[]>` | Optional `count` limits results |
| `getWelcomeText()` | `Observable<WeclomeText>` | Single entry (title, subtitle, content) |
| `getBlogPosts(count?, orderDir?)` | `Observable<Blog[]>` | `orderDir`: `'asc'`\|`'desc'`, default `'asc'` |
| `getStrapiImageUrl(formats, size)` | `string` | Falls back to next available size if requested size missing |

Image size options (approx px widths): `xsmall`(96), `thumbnail`(156), `small`(563), `medium`(750), `large`(1440), `xlarge`(1920).

### `BreakpointService`
- `getBreakpoint()`: `Observable<Breakpoints>`
- `isMobile()`: `Observable<boolean>` — true when viewport ≤ 700px
- Breakpoints enum: `MOBILE = '(max-width: 700px)'`, `DESKTOP = '(min-width: 701px)'`

### `TitleService`
- Call `init()` once in `AppComponent` constructor
- Base title: `"SAMBICO e.V."`, appends `" - ROUTE"` on navigation

### `UtilsService`
- `shuffleArray<T>(array: T[]): T[]` — Fisher-Yates shuffle, returns new array
- `parseDate(date: string): Date | undefined` — parses `DD.MM.YYYY` strings

---

## Data Models (Strapi)

All Strapi responses follow the Strapi v4 structure: `{ data: T | T[] }` with items shaped as `{ id: number, attributes: {...} }`.

```typescript
// Strapi content types
StrapiTypes.BLOG         = 'blogs'
StrapiTypes.SLIDER       = 'sliders'
StrapiTypes.WELCOME_TEXT = 'welcome-text'
StrapiTypes.PROJECT      = 'projects'
StrapiTypes.USER         = 'user'

// Project.attributes
{ title, subtitle, content (markdown), image, locale, localizations, createdAt, updatedAt, publishedAt }

// Blog.attributes
{ title, subTitle?, content (markdown), image, previewButtonText, date, locale, createdAt, updatedAt, publishedAt }

// Slide.attributes
{ title, subtitle, buttonText, link, image, locale, localizations, createdAt, updatedAt, publishedAt }

// WeclomeText
{ title, subtitle, content (markdown) }
```

### CalEvent
Fetched from a **public Google Sheets CSV** (not Strapi):
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vSSGiKs_.../pub?gid=0&single=true&output=csv
```
CSV columns (in order): `date (DD.MM.YYYY)`, `title`, `description`, `location`

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
- `blogPreview.*` — showAll, readMore, title, events.title
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
  strapiUrl: string;      // 'https://strapi-vnv3.onrender.com'
  strapiApiToken: string; // Bearer token for Strapi API
}
```

API base URL: `${strapiUrl}/api/`  
All requests include header: `Authorization: Bearer <strapiApiToken>`

---

## Notable Patterns & Conventions

- **Fragment scrolling**: `AppComponent.ngOnInit` subscribes to `ActivatedRoute.fragment` and calls `scrollIntoView` on the matching element ID.
- **Slot machine (ProjectsPreview)**: Uses `setTimeout` chains with `SLOT_DELAYS = [185, 175, 170, 210, 280, 340, 400]`ms. Starts/stops based on scroll visibility (component must be ≥30% in viewport). Angular `@slideCard` animation handles enter/leave transitions.
- **Blog fade-in (BlogPreview)**: Uses Angular `@animate` state machine (`show`/`hide`) triggered by scroll position.
- **Menu close on outside click**: `ToolbarComponent` uses `@HostListener('document:mousedown')` to close the menu.
- **Menu close on navigation**: `ToolbarComponent` subscribes to `router.events` and closes on `NavigationEnd`.
- **Image fallback**: `getStrapiImageUrl()` falls back gracefully through `large → medium → small` if the requested size doesn't exist.
- **Blog sorting**: Always sorted client-side by `publishedAt` descending. Slider is reversed (`res.reverse()`). Projects are also reversed.
- **TODO markers**: `Localization.date` in `strapi.models.ts` is typed as `any[]` with a `//TODO: Type` comment.

---

## Known Issues / Notes

- `TitleResolver` in `app-routing.module.ts` only handles `RouteNames.HOME`; all other routes fall back to `'Custom About Me'` (placeholder, not used for actual title).
- `en.json` is intentionally sparse; the app always defaults to German.
