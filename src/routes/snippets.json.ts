import type { RequestHandler } from "@sveltejs/kit";
import { getAllSnippets } from "$lib/snippets";

export const get: RequestHandler = (): { body: string } => {
  const snippets = getAllSnippets();
  const body = JSON.stringify(snippets);
  return { body };
};
