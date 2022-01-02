export interface snippetType {
  title: string;
  date: string;
  description: string;
  src: string;
}

// for now, grab a manually-curated list of snippets; in the future, find a way to
// dynamically search all post content for blocks of code that indicate a snippet.
export const getAllSnippets = (): snippetType[] => {
  const snippets: snippetType[] = [
    {
      title: "NamedTuple Class",
      date: "2022-01-01",
      description: "Using a NamedTuple to create a container class",
      src: "/python-container-classes#namedtuple",
    },
  ];
  return snippets;
};
