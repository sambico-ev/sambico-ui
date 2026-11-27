export enum StrapiTypes {
  BLOG = 'blogs',
  SLIDER = 'sliders',
  USER = 'user',
  WELCOME_TEXT = 'welcome-text',
  PROJECT = 'projects'
}

export type ImageSize =
  | 'xlarge'
  | 'large'
  | 'medium'
  | 'small'
  | 'xsmall'
  | 'thumbnail';

// ---------------------------------------------------------------------------
// What the components work with: one flat shape, whatever Strapi version
// answered. StrapiService converts both server shapes into these.
// ---------------------------------------------------------------------------

export interface Format {
  ext: string;
  hash: string;
  height: number;
  name: string;
  mime: string;
  path: string | null;
  size: number;
  url: string;
  width: number;
}

// Strapi only generates the sizes smaller than the upload, so any can be missing
export type Formats = Partial<Record<ImageSize, Format>>;

export interface Media {
  id: number;
  alternativeText: string | null;
  formats: Formats | null;
  url: string;
}

export interface Entry {
  id: number;
  /** Strapi 5 only: the stable key of an entry (numeric ids differ per draft/publish row and locale) */
  documentId?: string;
}

export interface Project extends Entry {
  title: string;
  subtitle: string | null;
  content: string;
  publishedAt: string;
}

export interface Slide extends Entry {
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  link: string | null;
  image: Media | null;
  publishedAt: string;
}

export interface Blog extends Entry {
  title: string;
  subTitle?: string | null;
  content: string;
  previewButtonText?: string | null;
  date: string;
  publishedAt: string;
  image: Media | null;
}

export interface WelcomeText {
  title: string | null;
  subTitle: string | null;
  content: string;
}

// ---------------------------------------------------------------------------
// What the servers send
// ---------------------------------------------------------------------------

/** Strapi 4: fields sit in `attributes` */
export interface EntityV4<T> {
  id: number;
  attributes: T;
}

/** Strapi 5: fields sit on the item, next to the `documentId` */
export type EntityV5<T> = Entry & T;

export type RawEntity<T> = EntityV4<T> | EntityV5<T>;

/** Strapi 4 nests a media field as `{ data: { id, attributes } | null }` */
export interface MediaV4 {
  data: EntityV4<Omit<Media, 'id'>> | null;
}

/** Strapi 5 sends the file itself, `null`, or `[]` when it is empty */
export type RawMedia = MediaV4 | Media | Media[] | null | undefined;

export type WithRawImage<T extends { image: Media | null }> = Omit<
  T,
  keyof Entry | 'image'
> & { image?: RawMedia };

export interface ListResponse<T> {
  data: RawEntity<T>[];
}

export interface SingleResponse<T> {
  data: RawEntity<T>;
}

export type BlogFields = WithRawImage<Blog>;
export type SlideFields = WithRawImage<Slide>;
export type ProjectFields = Omit<Project, keyof Entry>;
export type WelcomeTextFields = WelcomeText;
