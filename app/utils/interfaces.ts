import { SearchQuery } from "@/types";

export interface SearchProps {
  onSearch: (searchResult: SearchQuery) => void;
  onResultUpdate: (answer: string) => void;
  onDone: (done: boolean) => void;
}

export interface ResultProps {
  searchQuery: SearchQuery;
  answer: string;
  done: boolean;
  onReset: () => void;
}