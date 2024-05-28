import { fetchAnswer } from '../../app/utils/functions';
import { UNRELATED_ANSWER } from '../../app/utils/constants';

describe("fetchAnswer", () => {
  const onAnswerUpdate = jest.fn();
  const onSearch = jest.fn();
  const onDone = jest.fn();
  const lang = "English";
  const setResultIdStore = jest.fn();

  test("returns an unrelated answer if empty source list is given", async () => {
    await expect(fetchAnswer(
      "query",
      onAnswerUpdate,
      onSearch,
      onDone,
      lang,
      setResultIdStore
    ));

    expect(onAnswerUpdate).toHaveBeenCalledWith(UNRELATED_ANSWER);
    expect(onSearch).toHaveBeenCalledWith({ query: "query", sourceLinks: [], sourceHeadings: [] });
    expect(onDone).toHaveBeenCalledTimes(0);
    expect(setResultIdStore).toHaveBeenCalledTimes(0);
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
      lang,
      setResultIdStore
    ));

    expect(onAnswerUpdate).toHaveBeenCalledWith(UNRELATED_ANSWER);
    expect(onSearch).toHaveBeenCalledWith({ query: "query", sourceLinks: [], sourceHeadings: [] });
    expect(onDone).toHaveBeenCalledTimes(0);
    expect(setResultIdStore).toHaveBeenCalledTimes(0);
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
      lang,
      setResultIdStore
    ));

    expect(onAnswerUpdate).toHaveBeenCalledWith(UNRELATED_ANSWER);
    expect(onSearch).toHaveBeenCalledWith({ query: "query", sourceLinks: [], sourceHeadings: [] });
    expect(onDone).toHaveBeenCalledTimes(0);
    expect(setResultIdStore).toHaveBeenCalledTimes(0);
    expect(global.fetch).not.toHaveBeenCalledWith("/api/answer");
  });
});