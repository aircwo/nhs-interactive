export type Source = {
  url: string;
  text: string;
};

export type SearchQuery = {
  query: string;
  sourceLinks: string[];
};

export type SourceData = {
  sources: Source[];
};
