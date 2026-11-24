export type Plate = {
  id: string;
  src: string;
  full: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  kind: 'render' | 'sheet';
};

export type Picture = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type Chapter = {
  id: string;
  eyebrow: string;
  title: string;
  body: string[];
  plates: string[];
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  place: string;
  year: string;
  studio: string;
  authorship: string;
  role: string;
  lead: string;
  cover: string;
  hero: string;
  chapters: Chapter[];
  plates: Plate[];
  video?: {
    src: string;
    poster: string;
    width: number;
    height: number;
    caption: string;
  };
};
