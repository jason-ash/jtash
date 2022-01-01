import fs from "fs";
import matter from "gray-matter";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import unified from "unified";

export interface postType {
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  tags: string[];
  status: "draft" | "published";
  content: string;
}

// reformat a date from "YYYY-MM-DD" to "month dd, YYYY"
export const formatDateString = (date: string): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [year, month, day] = date.split("-");
  return `${months[Number(month) - 1]} ${Number(day)}, ${year}`;
};

// process a single post by reading its contents and parsing its metadata
export const processPost = (fileName: string): postType => {
  const fileContents = fs.readFileSync(fileName, "utf-8");
  const metadata = matter(fileContents).data;
  const parser = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkMath)
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
    tags: metadata.tags || [],
    status: metadata.status,
    content,
  };
};

// return an array of posts by reading all files in the posts directory, sorted by date
export const getAllPosts = (): postType[] => {
  const posts = fs
    .readdirSync("src/posts")
    .map((fileName) => processPost(`src/posts/${fileName}`))
    .filter((post) => post.status === "published")
    .sort((first, second) => {
      const a = first.date.split("-").join("");
      const b = second.date.split("-").join("");
      return a > b ? -1 : a < b ? 1 : 0;
    });
  return posts;
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
