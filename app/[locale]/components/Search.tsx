"use client";

import { ChangeEvent, FC, KeyboardEvent, useRef, useState } from "react";
import { SearchProps } from "../../utils/interfaces";
import { fetchAnswer } from "../../utils/functions";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { ALLOWED_SEARCH_CHARS_REGEX } from "../../utils/constants";

const querySchema = z.string().nonempty().min(4).max(100).regex(ALLOWED_SEARCH_CHARS_REGEX);

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
    const result = querySchema.safeParse(query);
    if (!result.success) {
      // dont care for multiple errors here so using the first in array is fine.
      setError(translate(`errors.${result.error.issues[0].code}`));
      return;
    }

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
      {/* todo: skeleton loading here? */}
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
          <div className={ error ? "nhsuk-form-group nhsuk-form-group--error" : "nhsuk-form-group"}>
            <label className="nhsuk-label" htmlFor="search-input">
              {translate('query')}
            </label>
            <span className="nhsuk-error-message" id="example-error">
              <span className="nhsuk-u-visually-hidden">Error:</span>{error}
            </span>
            <div className="nhsuk-hint" id="example-with-hint-text-hint">
              {translate('hint')}
            </div>
            <input className={ error ? "nhsuk-input nhsuk-input--error" : "nhsuk-input"}
                id="search-input"
                name="search"
                placeholder={translate('placeholder')}
                ref={inputRef}
                value={query}
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-describedby={error}
              />
          </div>
          <button 
            className="nhsuk-button" 
            data-module="nhsuk-button" 
            type="submit"
            id='submit'
            // as='a'
            data-prevent-double-click
            onClick={handleSearch}
            disabled={!!error && query === ''}
          >
            {translate('button.submit')}
          </button>
        </div>
        </>
      )}
    </>
  );
};
