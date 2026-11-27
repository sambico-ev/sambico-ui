import type {
  Blog,
  BlogFields,
  EntityV4,
  Entry,
  Media,
  RawEntity,
  RawMedia,
  Slide,
  SlideFields
} from '../models/strapi.models';

function isEntityV4<T>(raw: RawEntity<T>): raw is EntityV4<T> {
  return 'attributes' in raw && typeof raw.attributes === 'object';
}

/** Strapi 4 `{ id, attributes }` and Strapi 5 `{ id, documentId, ...fields }` to the flat v5 shape */
export function flattenEntity<T extends object>(raw: RawEntity<T>): T & Entry {
  if (isEntityV4(raw)) {
    return { ...raw.attributes, id: raw.id };
  }
  return raw;
}

/** Strapi 4 `{ data: { id, attributes } }` and Strapi 5 file object to one file object */
export function normalizeMedia(raw: RawMedia): Media | null {
  if (!raw) {
    return null;
  }
  if (Array.isArray(raw)) {
    return normalizeMedia(raw[0]);
  }
  if ('data' in raw) {
    return raw.data ? flattenEntity(raw.data) : null;
  }
  return raw;
}

function withImage<T extends { image?: RawMedia }>(
  fields: T
): Omit<T, 'image'> & { image: Media | null } {
  return { ...fields, image: normalizeMedia(fields.image) };
}

export function normalizeBlog(raw: RawEntity<BlogFields>): Blog {
  return withImage(flattenEntity(raw));
}

export function normalizeSlide(raw: RawEntity<SlideFields>): Slide {
  return withImage(flattenEntity(raw));
}

/** The path segment `blog/:id` links to; Strapi 5 entries are only stable by documentId */
export function blogRouteKey(blog: Entry): string {
  return blog.documentId ?? String(blog.id);
}
