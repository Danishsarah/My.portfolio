export interface BlogFrontMatter {
  date: string;
  title: string;
  tagline: string;
  preview: string;
  image: string;
}

export interface BlogPost extends BlogFrontMatter {
  slug: string;
  content: string;
}

export type BlogField = keyof BlogPost | "author";
