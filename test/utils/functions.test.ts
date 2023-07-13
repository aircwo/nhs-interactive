import { cleanSourceText, fetchSources, handleStream, openAIStream } from '../../app/utils/functions';
import fetchMock from 'jest-fetch-mock';
import { TextEncoder, TextDecoder } from 'util';
import { UNRELATED_ANSWER, USE_AI_RESPONSE_KEY } from '../../app/utils/constants';
import { Source } from '@/types';
import endent from "endent";

describe('openAIStream', () => {
  // todo: more api call tests
  beforeEach(() => {
    fetchMock.resetMocks();
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  });

  it('throws an error if the API returns a non-200 status', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 401 });
  
    const model = 'test-model';
    const prompt = 'test-prompt';
    const apiKey = 'test-api-key';
  
    await expect(openAIStream(model, prompt, apiKey)).rejects.toThrow('OpenAI API returned an error');
  });

  // test('throws an error if the API returns a non-200 status', async () => {
  //   global.TextEncoder = TextEncoder;
  //   global.TextDecoder = TextDecoder;
  //   global.fetch = jest.fn().mockResolvedValue({
  //     ok: true,
  //     status: 200,
  //     body: async () => ({
  //       stream: 'test-stream',
  //     }),
  //   });
  
  //   const model = OpenAIModel.DAVINCI_TURBO;
  //   const prompt = 'test-prompt';
  //   const apiKey = process.env.OPENAI_API_KEY;
  
  //   const result = await openAIStream(model, prompt, apiKey);
  //   expect(result).toBeInstanceOf(ReadableStream);
  //   expect(result).toHaveBeenCalledWith('https://api.openai.com/v1/chat/completions', {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${apiKey}`,
  //     },
  //     method: 'POST',
  //     body: JSON.stringify({
  //       model: model,
  //       messages: [
  //         { role: 'system', content: "You are a medical professional that accurately answers the user's queries based on the given text and you only get your information and facts from NHS websites." },
  //         { role: 'user', content: prompt },
  //       ],
  //       max_tokens: 120,
  //       temperature: 0.1,
  //       stream: true,
  //       stop: '\n',
  //     }),
  //   });
  // });
});

describe('cleanSourceText', () => {
  test('should trim whitespace at the beginning and end of the text', () => {
    expect(cleanSourceText('  hello  ')).toBe('hello');
  });

  test('should replace multiple consecutive line breaks with single break', () => {
    expect(cleanSourceText('hello\n\n\nworld')).toBe('hello \nworld');
  });

  test('should replace two consecutive line breaks with a space', () => {
    expect(cleanSourceText('hello\n\nworld')).toBe('hello world');
  });

  test('should replace three or more consecutive spaces with two spaces', () => {
    expect(cleanSourceText('hello   world')).toBe('hello  world');
  });

  test('should remove all tabs', () => {
    expect(cleanSourceText('hello\tworld')).toBe('helloworld');
  });

  test('should remove empty lines', () => {
    expect(cleanSourceText('\nhello\n\n\nworld\n\n')).toBe('hello \nworld');
  });
});

describe("fetchSources", () => {
  afterEach(() => {
    expect(global.fetch).toHaveBeenCalledWith("/api/sources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: "query" }),
    });
  });

  test("returns a list of empty sources", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        sources: [],
      }),
    });
    const sources = await fetchSources("query");
    expect(sources).toEqual([{ "url": USE_AI_RESPONSE_KEY, "text": '' }]);
  });

  test("throws an error if ok not truthy and should supply statusText", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: "error",
    });
    await expect(fetchSources('query')).rejects.toThrow('error');
  });

  test("should return a list of sources", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        sources: ['www.google.com', 'www.nhs.nhs.uk', 'www.nhsbsa.nhs.uk'],
      }),
    });
    const sources = await fetchSources("query");
    expect(sources).toHaveLength(3);
    expect(sources).toEqual([
      "www.google.com",
      "www.nhs.nhs.uk",
      "www.nhsbsa.nhs.uk",
    ]);
  });
});

describe("handleStream", () => {
  const onAnswerUpdate = jest.fn();
  const setLoading = jest.fn();
  const onSearch = jest.fn();
  const onDone = jest.fn();
  const lang = "en";

  test("returns an unrelated answer if empty source list is given", async () => {
    const sources: Source[] = [];

    await expect(handleStream(
      "query",
      sources,
      onAnswerUpdate,
      onSearch,
      onDone,
      setLoading,
      lang
    ));

    expect(onAnswerUpdate).toHaveBeenCalledWith(UNRELATED_ANSWER);
    expect(onSearch).toHaveBeenCalledWith({ query: "query", sourceLinks: [], sourceHeadings: [] });
    expect(setLoading).toHaveBeenNthCalledWith(1, false);
    expect(global.fetch).not.toHaveBeenCalledWith("/api/answer");
  });

  test("should throw error upon api call failure", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: "error",
    });
    const sources: Source[] = [{ url: "www.google.com", text: "text" }, { url: "www.nhs.nhs.uk", text: "text" }];

    await expect(handleStream(
      "query",
      sources,
      onAnswerUpdate,
      onSearch,
      onDone,
      setLoading,
      lang
    ));

    expect(onAnswerUpdate).toHaveBeenCalledWith(UNRELATED_ANSWER);
    expect(onSearch).toHaveBeenCalledWith({ query: "error", sourceLinks: [], sourceHeadings: [] });
    expect(setLoading).toHaveBeenNthCalledWith(1, false);
    expect(global.fetch).not.toHaveBeenCalledWith("/api/answer");
  });

  test("returns an unrelated answer if error is given", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      statusText: "error",
    });
    const sources: Source[] = [{ url: "www.google.com", text: "text" }, { url: "www.nhs.nhs.uk", text: "text" }];

    await expect(handleStream(
      "query",
      sources,
      onAnswerUpdate,
      onSearch,
      onDone,
      setLoading,
      lang
    ));

    expect(onAnswerUpdate).toHaveBeenCalledWith(UNRELATED_ANSWER);
    expect(onSearch).toHaveBeenCalledWith({ query: "query", sourceLinks: [], sourceHeadings: [] });
    expect(setLoading).toHaveBeenNthCalledWith(1, false);
    expect(global.fetch).not.toHaveBeenCalledWith("/api/answer");
  });

  test("returns a valid answer", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        sources: ['www.google.com', 'www.nhs.nhs.uk', 'www.nhsbsa.nhs.uk'],
      }),
    });
    const sources: Source[] = [{ url: "www.google.com", text: "text", heading: "text" }, { url: "www.nhs.nhs.uk", text: "text", heading: "text" }];

    await expect(handleStream(
      "query",
      sources,
      onAnswerUpdate,
      onSearch,
      onDone,
      setLoading,
      lang
    ));

    expect(onAnswerUpdate).toHaveBeenCalledWith(UNRELATED_ANSWER);
    expect(onSearch).toHaveBeenCalledWith({ query: "query", sourceLinks: [], sourceHeadings: [] });
    expect(setLoading).toHaveBeenNthCalledWith(1, false);
    expect(onDone).toHaveBeenNthCalledWith(1, true);
    const prompt = endent`In ${lang}, provide a short answer to the query based on the following sources. The answer must end on a full stop and be concise, accurate, and helpful. Cite sources as [1] or [2] or [3] after each sentence (not just the very end) to back up your answer (Ex: Correct: [1], Correct: [2][3], Incorrect: [1, 2]).
    ${sources
      .map((source, idx) => `Source [${idx + 1}]:\n${source.text}`)
      .join("\n\n")}
    `;
    expect(global.fetch).toHaveBeenCalledWith("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });
  });
});