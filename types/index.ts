export type Source = {
  url: string;
  text: string;
  heading?: string;
};

export type SearchQuery = {
  query: string;
  sourceLinks: string[];
  sourceHeadings: string[];
};

export type SourceData = {
  sources: Source[];
};

export type LogData = {
  searchQuery: SearchQuery;
  answer: string;
};

export type HealthAPIResponse = {
  answer: string;
  source: string;
}
