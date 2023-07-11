"use client";

import { useTranslations } from 'next-intl';
import { WarningCallout } from "nhsuk-react-components";
import { Search } from "./components/Search";
import { Results } from "./components/Results";
import { useState } from "react";
import { SearchQuery } from "@/types";
import { ModelInfo } from "./components/defaults";

export default function Page() {
  const translate = useTranslations('landing');
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    query: "",
    sourceLinks: [],
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
      <WarningCallout>
        <WarningCallout.Label>{translate('warning.title')}</WarningCallout.Label>
        <p>{translate('warning.content')}</p>
      </WarningCallout>
      {results ? (
        <>
          <Results
            searchQuery={searchQuery}
            answer={results}
            done={done}
            onReset={() => {
              setResults("");
              setSearchQuery({ query: "", sourceLinks: [] });
              setDone(false);
            }}
          />
          <ModelInfo />
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
