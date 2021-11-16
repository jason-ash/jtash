import fs from "fs";
import vfile from "to-vfile";
import unified from "unified";
import parse from "remark-parse";
import gfm from "remark-gfm";
import remark2rehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import frontmatter from "remark-frontmatter";
import highlight from "rehype-highlight";
import yaml from "js-yaml";

export interface postType {
  metadata: {
    title: string;
    date: string;
    slug: string;
    excerpt: string;
  };
  content: string;
  slug?: string;
}

export const getAllPosts = (): postType[] => {
  const posts = fs
    .readdirSync("src/posts")
    .filter((fileName) => /.+\.md$/.test(fileName))
    .map((fileName) => {
      const { metadata, content } = process(`src/posts/${fileName}`);
      return {
        metadata,
        content,
        slug: fileName.slice(0, -3),
      };
    });
  return posts;
};

export const process = (fileName: string): postType => {
  const parser = unified().use(parse).use(gfm).use(frontmatter, ["yaml"]);
  const runner = unified().use(remark2rehype).use(highlight).use(rehypeStringify);
  const tree = parser.parse(vfile.readSync(fileName));
  let metadata = null;
  if (tree.children.length > 0 && tree.children[0].type == "yaml") {
    metadata = yaml.load(tree.children[0].value);
    tree.children = tree.children.slice(1, tree.children.length);
  }
  const content = runner.stringify(runner.runSync(tree));
  return { metadata, content };
};
