import { Button } from "nhsuk-react-components";
import { FC } from "react";
import { makeSourcesLinks } from "./defaults";
import { UNRELATED_ANSWER } from "../lib/utils/constants";
import { ResultProps } from "../lib/utils/interfaces";
import { useApiLog } from "../lib/utils/hooks";
import { LogData } from "@/types";

export const Results: FC<ResultProps> = ({ searchQuery, answer, done, onReset }) => {
  const logData: LogData = { searchQuery, answer };
  useApiLog(logData, done);
  return (
    <>
      <p className='text-md text-nhs-blue'>Question</p>
      <p className='italic'>{searchQuery.query} (?)</p>
      <hr className='nhsuk-section-break nhsuk-section-break--m nhsuk-section-break--visible' />
      { answer === UNRELATED_ANSWER ? <>
        <p>It looks like your query may not be answerable.</p>
        <div className='nhsuk-details__text mb-6'>
          <p>This could be for several reasons:</p>
          <ul>
            <li>your query is not health related</li>
            <li>your query contained inappropriate language</li>
            <li>your query did not give enough detail</li>
          </ul>
        </div>
        </> : <>
          <p className='text-nhs-blue mb-2'>Answer</p>
          <p className='overflow-auto'>
            {makeSourcesLinks(answer, searchQuery.sourceLinks)}
          </p>
        </>
      }
      
      {done && (
        <>
          <hr className='nhsuk-section-break nhsuk-section-break--m nhsuk-section-break--visible' />
          <p className='text-nhs-blue'>Trusted Sources</p>
          {searchQuery.sourceLinks.map((source, index) => (
            <div key={index} className='mt-1 overflow-auto'>
              {`[${index + 1}] `}
              <a
                className='hover:cursor-pointer hover:underline'
                target='_blank'
                rel='noopener noreferrer'
                href={source}
              >
                {source.split("//")[1].split("/")[0].replace("www.", "")}
              </a>
            </div>
          ))}
          <hr className='nhsuk-section-break nhsuk-section-break--m nhsuk-section-break--visible' />
        </>
      )}
      { (done || answer === UNRELATED_ANSWER) && (
        <Button onClick={onReset}>Ask New Question</Button>
      )}
    </>
  );
};
