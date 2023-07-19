import { fetchAnswer } from '../../app/utils/functions';
import fetchMock from 'jest-fetch-mock';
import { UNRELATED_ANSWER } from '../../app/utils/constants';

describe("fetchAnswer", () => {
  const onAnswerUpdate = jest.fn();
  const onSearch = jest.fn();
  const onDone = jest.fn();
  const lang = "English";

  test("returns an unrelated answer if empty source list is given", async () => {
    await expect(fetchAnswer(
      "query",
      onAnswerUpdate,
      onSearch,
      onDone,
      lang
    ));

    expect(onAnswerUpdate).toHaveBeenCalledWith(UNRELATED_ANSWER);
    // expect(onSearch).toHaveBeenCalledWith({ query: "query", sourceLinks: [], sourceHeadings: [] });
    // expect(global.fetch).not.toHaveBeenCalledWith("/api/answer");
  });

  test("should throw error upon api call failure", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: "error",
    });

    await expect(fetchAnswer(
      "query",
      onAnswerUpdate,
      onSearch,
      onDone,
      lang
    ));

    expect(onAnswerUpdate).toHaveBeenCalledWith(UNRELATED_ANSWER);
    expect(onSearch).toHaveBeenCalledWith({ query: "error", sourceLinks: [], sourceHeadings: [] });
    expect(global.fetch).not.toHaveBeenCalledWith("/api/answer");
  });

  test("returns an unrelated answer if error is given", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      statusText: "error",
    });

    await expect(fetchAnswer(
      "query",
      onAnswerUpdate,
      onSearch,
      onDone,
      lang
    ));

    expect(onAnswerUpdate).toHaveBeenCalledWith(UNRELATED_ANSWER);
    // expect(onSearch).toHaveBeenCalledWith({ query: "query", sourceLinks: [], sourceHeadings: [] });
    expect(global.fetch).not.toHaveBeenCalledWith("/api/answer");
  });
});