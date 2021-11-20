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
    content,
  };
};

// return an array of posts by reading all files in the posts directory
export const getAllPosts = (): postType[] => {
  const posts = fs
    .readdirSync("src/posts")
    .filter((fileName) => /.+\.md$/.test(fileName))
    .map((fileName) => processPost(`src/posts/${fileName}`));
  return posts;
};

// return a single post by matching its slug
export const getPostBySlug = (slug: string): postType | void => {
  return getAllPosts().find((post) => post.slug == slug);
};
