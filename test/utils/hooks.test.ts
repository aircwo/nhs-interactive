import { renderHook } from '@testing-library/react';
import { useApiLog } from '../../app/lib/utils/hooks';
import { LogData } from '@/types';

describe('useApiLog', () => {
  test('sends POST request when logData and done change', async () => {
    const logData: LogData = {
      searchQuery: { query: 'test query', sourceLinks: [] },
      answer: 'test answer',
    };
    const fetchMock = jest.fn().mockResolvedValueOnce({ ok: true });
    global.fetch = fetchMock;

    const { rerender } = renderHook(
      ({ logData, done }) => useApiLog(logData, done),
      { initialProps: { logData, done: false } }
    );

    expect(fetchMock).not.toHaveBeenCalled();

    rerender({ logData, done: true });

    expect(fetchMock).toHaveBeenCalledWith('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });
  });
});
