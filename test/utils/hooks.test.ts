import { useApiKey } from '../../app/lib/utils/hooks';
import { renderHook } from '@testing-library/react';

describe('useApiKey', () => {
  it('should set the API key from localStorage', () => {
    const apiKey = 'test-api-key';
    const setApiKey = jest.fn();
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(apiKey));

    renderHook(() => useApiKey(setApiKey));

    expect(setApiKey).toHaveBeenCalledWith(apiKey);
  });

  it('should not set the API key when it does not exist in localStorage', () => {
    const setApiKey = jest.fn();
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    renderHook(() => useApiKey(setApiKey));

    expect(setApiKey).not.toHaveBeenCalled();
  });
});
