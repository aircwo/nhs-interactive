export type SearchQuery = {
  query: string;
  sourceLinks: string[];
  sourceHeadings: string[];
};

export type LogData = {
  searchQuery: SearchQuery;
  answer: string;
  feedback?: Feedback;
  id?: string;
};

export type HealthAPIResponse = {
  answer: string;
  sources: string[];
  headings: string[];
}

export type Feedback = {
  comment: string;
  helpful: boolean;
  searchId: string;
}
