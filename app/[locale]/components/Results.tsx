import { Button } from "nhsuk-react-components";
import { FC } from "react";
import { makeSourcesLinks } from "./defaults";
import { UNRELATED_ANSWER } from "../../utils/constants";
import { ResultProps } from "../../utils/interfaces";
import { useApiLog } from "../../utils/hooks";
import { LogData } from "@/types";
import { useTranslations } from "next-intl";

export const Results: FC<ResultProps> = ({ searchQuery, answer, done, onReset }) => {
  const translate = useTranslations('results');
  const logData: LogData = { searchQuery, answer };
  useApiLog(logData, done);
  return (
    <>
      <p className='text-md text-nhs-blue'>{translate('question')}</p>
      <p className='italic'>{searchQuery.query} (?)</p>
      <hr className='nhsuk-section-break nhsuk-section-break--m nhsuk-section-break--visible' />
      { answer === UNRELATED_ANSWER ? <>
        <p>{translate('error.paragraphOne')}</p>
        <div className='nhsuk-details__text mb-6'>
          <p>{translate('error.paragraphTwo')}</p>
          <ul>
            <li>{translate('error.list.one')}</li>
            <li>{translate('error.list.two')}</li>
            <li>{translate('error.list.three')}</li>
          </ul>
        </div>
        </> : <>
          <p className='text-nhs-blue mb-2'>{translate('answer')}</p>
          <p className='overflow-auto'>
            {makeSourcesLinks(answer, searchQuery.sourceLinks)}
          </p>
        </>
      }
      
      {done && (
        <>
          <hr className='nhsuk-section-break nhsuk-section-break--m nhsuk-section-break--visible' />
          <p className='text-nhs-blue'>{translate('sources')}</p>
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
        <Button onClick={onReset}>{translate('button.newQuery')}</Button>
      )}
    </>
  );
};
