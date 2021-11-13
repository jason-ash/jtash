import { getPostTitles } from "../lib/posts";

export const get = (): { body: string } => {
  const titles = getPostTitles();
  const body = JSON.stringify(titles);
  return { body };
};
