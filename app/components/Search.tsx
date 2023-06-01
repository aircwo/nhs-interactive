"use client";

import { ChangeEvent, FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ActionLink, Button, Input, InsetText } from "nhsuk-react-components";
import { Source } from "@/types";
import endent from "endent";
import { LOCAL_KEY_ID, UNRELATED_ANSWER } from "../lib/utils/constants";
import { SearchProps } from "../lib/utils/interfaces";

export const Search: FC<SearchProps> = ({
  onSearch,
  onResultUpdate: onAnswerUpdate,
  onDone,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const API_KEY = localStorage.getItem(LOCAL_KEY_ID);
    if (API_KEY) {
      setApiKey(JSON.parse(API_KEY));
    }
  }, []);

  const handleSearch = async () => {
    if (!query) {
      setError(true);
      return;
    }

    setLoading(true);
    const sources = await fetchSources();
    await handleStream(sources);
  };

  const fetchSources = async () => {
    const response = await fetch("/api/sources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const { sources }: { sources: Source[] } = await response.json();
    return sources;
  };

  const handleStream = async (sources: Source[]) => {
    if (sources.length <= 0) {
      setLoading(false);
      onAnswerUpdate(UNRELATED_ANSWER);
      onSearch({ query, sourceLinks: []})
      return;
    }
    try {
      const prompt = endent`Provide a 1 to 3 sentence answer (with the last sentence ending with a full stop) to the query based on the following sources. Be original, concise, accurate, and helpful. Cite sources as [1] or [2] or [3] after each sentence (not just the very end) to back up your answer (Ex: Correct: [1], Correct: [2][3], Incorrect: [1, 2]).
      ${sources
        .map((source, idx) => `Source [${idx + 1}]:\n${source.text}`)
        .join("\n\n")}
      `;

      const response = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, apiKey }),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error(response.statusText);
      }

      setLoading(false);
      onSearch({ query, sourceLinks: sources.map((source) => source.url) });

      const data = response.body;

      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        onAnswerUpdate(chunkValue);
      }

      onDone(true);
    } catch (err) {
      onAnswerUpdate("Error");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {loading ? (
        <>
          <span className='inline-flex'>
            <div className='h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2'></div>
            <p>Thinking...</p>
          </span>
        </>
      ) : (
        <>
          {apiKey.length === 51 || apiKey === "local" ? (
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
                error={error ? 'must provide a search term' : ''}
              />
              <Button id='submit' as='a' data-prevent-double-click onClick={handleSearch}>
                Submit
              </Button>
            </div>
          ) : (
            <InsetText visuallyHiddenText='An Open AI Key must be set in order to search.'>
              <p>An Open AI Key must be set in order to search.</p>
            </InsetText>
          )}
          <ActionLink href="/settings">You can change the OpenAI API Key here</ActionLink>
        </>
      )}
    </>
  );
};
