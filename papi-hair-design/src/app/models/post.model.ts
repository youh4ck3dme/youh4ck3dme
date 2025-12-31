export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  tags: string[];
  contentHTML: string;
  dateISO: string;
}
