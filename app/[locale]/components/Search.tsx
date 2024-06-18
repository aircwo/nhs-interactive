"use client";

import { FC, KeyboardEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Button, Input } from "./nhs";
import { ALLOWED_SEARCH_CHARS_REGEX, SearchProps, fetchAnswer, validateInput } from "../../utils";
import { parseAsString, useQueryState } from 'next-usequerystate';

const querySchema = z.string().min(4).max(100).regex(ALLOWED_SEARCH_CHARS_REGEX);

export const Search: FC<SearchProps> = ({
  onSearch,
  onResultUpdate: onAnswerUpdate,
  onDone,
  setResultIdStore,
}) => {
  const translate = useTranslations('search');
  const [query] = useQueryState('q', parseAsString.withDefault(""));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    const sanitisedQuery = validateInput(query);
    const result = querySchema.safeParse(sanitisedQuery);
    if (!result.success) {
      // dont care for multiple errors here so using the first in array is fine.
      setError(translate(`errors.${result.error.issues[0].code}`));
      return;
    }

    setLoading(true);
    try {
      await fetchAnswer(query, onAnswerUpdate, onSearch, onDone, translate('lang'), setResultIdStore);
    } catch (error) {
      setError('Service currently unavailable. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <>
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-[88px] bg-gray-200 rounded"></div>
          <div className="flex justify-between space-x-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-[68px]"></div>
          </div>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-1 bg-gray-200 rounded mb-10 mt-3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-14 bg-gray-200 rounded w-[196px]"></div>
        </div>
        </>
      ) : (
        <div className='relative w-full'>
          <Input
            id="search-input"
            label={translate('query')}
            name="search"
            hint={translate('hint')}
            placeholder={translate('placeholder')}
            value={query}
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
          <span className="nhsuk-body-s">Queries and results are stored for further analysis. We wont pass personally identifiable information to OpenAI or our internal systems.</span>
        </div>
      )}
    </>
  );
};
