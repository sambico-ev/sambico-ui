export enum StrapiTypes {
  BLOG = 'blogs',
  SLIDER = 'sliders',
  USER = 'user',
  WELCOME_TEXT = 'welcome-text',
  PROJECT = 'projects',
}

export interface SliderResponse {
  data: Slide[];
}

export interface ProjectResponse {
  data: Project[];
}

export interface Project {
  id: number;
  attributes: {
    title: string;
    subtitle: string;
    content: string;
    image: Image;
    createdAt: Date;
    locale: string;
    localizations: Localization;
    publishedAt: Date;
    updatedAt: Date;
  };
}

export interface Slide {
  id: number;
  attributes: {
    buttonText: string;
    createdAt: Date;
    image: Image;
    link: string;
    locale: string;
    localizations: Localization;
    publishedAt: Date;
    subtitle: string;
    title: string;
    updatedAt: Date;
  };
}

interface Localization {
  date: any[]; //TODO: Type
}

export interface Formats {
  large: Format;
  medium: Format;
  small: Format;
  thumbnail: Format;
}

export interface Format {
  ext: string;
  hash: string;
  height: number;
  name: string;
  mime: string;
  path: string;
  size: number;
  url: string;
  width: number;
}

export interface Image {
  data: {
    id: number;
    attributes: {
      alternativeText: string;
      caption: string;
      createdAt: Date;
      ext: string;
      formats: Formats;
      hash: string;
      height: number;
      mime: string;
      name: string;
      previewUrl: string;
      provider: string;
      provider_metadata: string;
      size: number;
      updatedAt: Date;
      url: string;
      width: number;
    };
  };
}

export interface WelcomeTextResponse {
  data: { attributes: WeclomeText };
}

export interface WeclomeText {
  title: string;
  subtitle: string;
  content: string;
}
