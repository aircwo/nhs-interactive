"use client";

import { ChangeEvent, FC, KeyboardEvent, useRef, useState } from "react";
import { Button, Input } from "nhsuk-react-components";
import { SearchProps } from "../lib/utils/interfaces";
import { fetchSources, handleStream } from "../lib/utils/functions";

export const Search: FC<SearchProps> = ({
  onSearch,
  onResultUpdate: onAnswerUpdate,
  onDone,
}) => {
  
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!query) {
      setError('must provide a search term');
      return;
    }

    setLoading(true);
    try {
      const sources = await fetchSources(query);
      await handleStream(query, sources, onAnswerUpdate, onSearch, onDone, setLoading);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <span className='inline-flex'>
            <div data-testid='animated-progress' className='h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2'></div>
            <p>Thinking...</p>
          </span>
        </>
      ) : (
        <>
        <div className='relative w-full'>
          <Input
            id="search-input"
            label="Enter a health related query"
            name="search"
            hint="e.g What is an HRT PPC?"
            placeholder='type something here'
            ref={inputRef}
            value={query}
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            error={error}
          />
          <Button
            id='submit'
            as='a'
            data-prevent-double-click
            onClick={handleSearch}
            disabled={!!error && query === ''}
          >
            Submit
          </Button>
        </div>
        </>
      )}
    </>
  );
};
