import { process } from "$lib/posts";
import fs from "fs";

export const get = () => {
  const posts = fs
    .readdirSync("src/posts")
    .filter((fileName) => /.+\.md$/.test(fileName))
    .map((fileName) => {
      const { metadata } = process(`src/posts/${fileName}`);
      return {
        metadata,
        slug: fileName.slice(0, -3),
      };
    });
  const body = JSON.stringify(posts);
  return { body };
};
