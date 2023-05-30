import { cleanSourceText, openAIStream } from '../../app/lib/utils/functions';

import fetchMock from 'jest-fetch-mock';
import { TextEncoder, TextDecoder } from 'util';

describe('openAIStream', () => {
  // todo: more api call tests
  beforeEach(() => {
    fetchMock.resetMocks();
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  });

  it('throws an error if the API returns a non-200 status', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });
  
    const model = 'test-model';
    const prompt = 'test-prompt';
    const apiKey = 'test-api-key';
  
    await expect(openAIStream(model, prompt, apiKey)).rejects.toThrow('OpenAI API returned an error');
  });
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
