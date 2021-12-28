import type { RequestHandler } from "@sveltejs/kit";
import { getAllPosts } from "$lib/posts";

export const get: RequestHandler = (): { body: string } => {
  const posts = getAllPosts();
  const body = JSON.stringify(posts);
  return { body };
};
