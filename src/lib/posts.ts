import fs from "fs";
import path from "path";

// return the post filenames for now
export const getPostTitles = (): string[] => {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const titles = fs.readdirSync(postsDirectory);
  return titles;
};
