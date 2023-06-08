import { LogData } from '@/types';
import { useEffect, useState } from 'react';
import { LOCAL_KEY_ID, UNRELATED_ANSWER } from './constants';

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

export const useApiKey = (setApiKey: (apiKey: string) => void) => {
  useEffect(() => {
    const API_KEY = localStorage.getItem(LOCAL_KEY_ID);
    if (API_KEY) {
      setApiKey(JSON.parse(API_KEY));
    }
  }, [setApiKey]);
};
