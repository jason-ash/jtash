import { getPostBySlug } from "$lib/posts";

export const get = ({ params }): { body: string } => {
  const { slug } = params;
  const post = getPostBySlug(slug);
  const body = JSON.stringify(post);
  return {
    body,
  };
};
