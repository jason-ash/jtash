import { process } from "$lib/posts";

export function get({ params }) {
  const { slug } = params;

  const { metadata, content } = process(`src/posts/${slug}.md`);
  const body = JSON.stringify({ metadata, content });

  return {
    body,
  };
}
