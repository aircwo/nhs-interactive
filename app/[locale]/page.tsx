"use client";

import { useTranslations } from 'next-intl';
import { Search } from "./components/Search";
import { Results } from "./components/Results";
import { useState } from "react";
import { SearchQuery } from "@/types";

export default function Page() {
  const translate = useTranslations('landing');
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    query: "",
    sourceLinks: [],
    sourceHeadings: [],
  });
  const [results, setResults] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);

  return (
    <>
      <h1>
        {translate('nhs')}
        <span className='ml-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-purple-700'>
          {translate('title')}
        </span>
      </h1>
      <div className="nhsuk-warning-callout">
        <h3 className="nhsuk-warning-callout__label">
          <span role="text">
            <span className="nhsuk-u-visually-hidden">Important: </span>
            {translate('warning.title')}
          </span>
        </h3>
        <p>{translate('warning.content')}</p>
      </div>
      {results ? (
        <>
          <Results
            searchQuery={searchQuery}
            answer={results}
            done={done}
            onReset={() => {
              setResults("");
              setSearchQuery({ query: "", sourceLinks: [], sourceHeadings: [] });
              setDone(false);
            }}
          />
        </>
      ) : (
        <Search
          onSearch={setSearchQuery}
          onResultUpdate={(value: string) => setResults((prev) => prev + value)}
          onDone={setDone} />
      )}
    </>
  );
}
