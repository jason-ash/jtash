import { getAllPosts } from "$lib/posts";

export const get = (): { body: string } => {
  const posts = getAllPosts();
  const body = JSON.stringify(posts);
  return { body };
};
