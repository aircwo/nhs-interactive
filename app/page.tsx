"use client";

import { WarningCallout } from "nhsuk-react-components";
import { Search } from "./components/Search";
import { useState } from "react";
import { SearchQuery } from "@/types";
import { Results } from "./components/Results";
import { ModelInfo } from "./components/defaults";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    query: "",
    sourceLinks: [],
  });
  const [results, setResults] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);

  return (
    <>
      <h1>
        NHS
        <span className='ml-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-purple-700'>
          Interactive
        </span>
      </h1>
      <WarningCallout>
        <WarningCallout.Label>Disclaimer</WarningCallout.Label>
        <p>
          This is a mock service made to look like an NHS website using their
          frontend toolkit and react components. Information given may also
          differ from truth. Do not use this for real medical advice or as a source of truth.
        </p>
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
