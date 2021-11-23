import fs from "fs";
import matter from "gray-matter";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import unified from "unified";

export interface postType {
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  status: "draft" | "published";
  content: string;
}

// process a single post by reading its contents and parsing its metadata
export const processPost = (fileName: string): postType => {
  const fileContents = fs.readFileSync(fileName, "utf-8");
  const metadata = matter(fileContents).data;
  const parser = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkFrontmatter)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true });
  const content = parser.processSync(fileContents).toString();
  return {
    title: metadata.title,
    date: metadata.date,
    slug: metadata.slug,
    excerpt: metadata.excerpt,
    status: metadata.status,
    content,
  };
};

// return an array of posts by reading all files in the posts directory
export const getAllPosts = (): postType[] => {
  const posts = fs.readdirSync("src/posts");
  const allPosts = posts.map((fileName) => processPost(`src/posts/${fileName}`));
  const publishedPosts = allPosts.filter((post) => post.status === "published");
  return publishedPosts;
};

// return a single post by matching its slug
export const getPostBySlug = (slug: string): postType | void => {
  return getAllPosts().find((post) => post.slug == slug);
};

// return an array of posts by searching the post title, slug, and contents
export const searchPosts = (searchTerm: string): postType[] => {
  return getAllPosts().filter((post) => {
    post.content.includes(searchTerm) ||
      post.title.includes(searchTerm) ||
      post.slug.includes(searchTerm);
  });
};
