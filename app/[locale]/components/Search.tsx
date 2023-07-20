"use client";

import { ChangeEvent, FC, KeyboardEvent, useRef, useState } from "react";
import { Button, Input } from "nhsuk-react-components";
import { SearchProps } from "../../utils/interfaces";
import { fetchAnswer } from "../../utils/functions";
import { useTranslations } from "next-intl";

export const Search: FC<SearchProps> = ({
  onSearch,
  onResultUpdate: onAnswerUpdate,
  onDone,
}) => {
  
  const translate = useTranslations('search');
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
      setError(translate('error'));
      return;
    }
    // further validation?

    setLoading(true);
    try {
      await fetchAnswer(query, onAnswerUpdate, onSearch, onDone, translate('lang'));
    } catch (error) {
      setError('Service currently unavailable. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <>
          <span className='inline-flex'>
            <div data-testid='animated-progress' className='h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2'></div>
            <p>{translate('loading')}</p>
          </span>
        </>
      ) : (
        <>
        <div className='relative w-full'>
          <Input
            id="search-input"
            label={translate('query')}
            name="search"
            hint={translate('hint')}
            placeholder={translate('placeholder')}
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
            {translate('button.submit')}
          </Button>
        </div>
        </>
      )}
    </>
  );
};
