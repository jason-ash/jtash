import type { RequestHandler } from "@sveltejs/kit";
import { getPostBySlug } from "$lib/posts";

export const get: RequestHandler = ({ params }): { body: string } => {
  const { slug } = params;
  const post = getPostBySlug(slug);
  const body = JSON.stringify(post);
  return {
    body,
  };
};
