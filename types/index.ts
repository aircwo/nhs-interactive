export type SearchQuery = {
  query: string;
  sourceLinks: string[];
  sourceHeadings: string[];
};

export type LogData = {
  searchQuery: SearchQuery;
  answer: string;
};

export type HealthAPIResponse = {
  answer: string;
  sources: string[];
  headings: string[];
}
