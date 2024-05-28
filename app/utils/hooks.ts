import { LogData } from '@/types';
import { useEffect, useRef } from 'react';
import { UNRELATED_ANSWER } from './constants';

/**
 * A custom React hook that takes in two parameters: `logData` of type `LogData` and `done` of
 * type `boolean`. It sets up an effect that sends a POST request to the `/api/log` endpoint with the `logData` object as
 * the request body when `done` is true or when `logData.answer` is equal to `UNRELATED_ANSWER`. The hook also manages the
 * state of `logSubmitted` using the `useState` hook to ensure that the POST request is only sent once.
 * 
 * @function
 * @name useApiLog
 * @kind variable
 * @param {LogData} logData
 * @param {boolean} done
 * @returns {void}
 * @exports
 */
export const useApiLog = (logData: LogData, done: boolean, id: string) => {
  const isEffectActive = useRef<boolean>(false);
  useEffect(() => {
    if (!isEffectActive.current && (done || logData.answer === UNRELATED_ANSWER)) {
      const data = {
        ...logData,
        id
      }
      const fetchApiLog = async () => {
        await fetch('/api/log', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        // do we really need error handling here..?
      };

      fetchApiLog()
      isEffectActive.current = true;
    }
  }, [logData, done]);
};
