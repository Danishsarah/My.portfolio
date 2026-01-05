import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import type { BlogField, BlogFrontMatter, BlogPost } from "../types/blog";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(
  slug: string,
  fields: BlogField[] = []
): Partial<BlogPost> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items: Partial<BlogPost> = {};

  fields.forEach((field) => {
    if (field === "slug") {
      items.slug = realSlug;
      return;
    }

    if (field === "content") {
      items.content = content;
      return;
    }

    if (field in data) {
      items[field as keyof BlogFrontMatter] = data[field] as never;
    }
  });

  return items;
}

export function getAllPosts(fields: BlogField[] = []): Partial<BlogPost>[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((post1, post2) => {
      const date1 = post1.date ?? "";
      const date2 = post2.date ?? "";
      return date1 > date2 ? -1 : 1;
    });
  return posts;
}
