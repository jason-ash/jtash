import { getAllPosts } from "$lib/posts";

export const get = () => {
  const posts = getAllPosts();
  const body = JSON.stringify(posts);
  return { body };
};
