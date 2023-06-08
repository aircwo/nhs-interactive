import { LogData } from '@/types';
import { useEffect, useState } from 'react';
import { LOCAL_KEY_ID, UNRELATED_ANSWER } from './constants';

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
export const useApiLog = (logData: LogData, done: boolean) => {
  const [logSubmitted, setLogSubmitted] = useState(false);
  useEffect(() => {
    const fetchApiLog = async () => {
      try {
        const response = await fetch('/api/log', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(logData),
        });

        if (!response.ok) {
          // Handle error case
        }
      } catch (error) {
        // Handle network error
      }
    };
    if (!logSubmitted) {
      if (done || logData.answer === UNRELATED_ANSWER) {
        fetchApiLog();
        setLogSubmitted(true);
      };
    };
    
  }, [logData, done, logSubmitted]);
};

/**
 * A custom React hook that takes a function `setApiKey` as a parameter. It retrieves an API
 * key from local storage and sets it using the `setApiKey` function. 
 * This hook is used to manage the API key across several pages within the application.
 * 
 * @function
 * @name useApiKey
 * @kind variable
 * @param {(apiKey: string) => void} setApiKey
 * @returns {void}
 * @exports
 */
export const useApiKey = (setApiKey: (apiKey: string) => void) => {
  useEffect(() => {
    const API_KEY = localStorage.getItem(LOCAL_KEY_ID);
    if (API_KEY) {
      setApiKey(JSON.parse(API_KEY));
    }
  }, [setApiKey]);
};
