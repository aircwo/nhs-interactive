import { FC } from "react";
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
      <p className='text-md text-nhs-blue mb-2'>{translate('question')}</p>
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
            {answer}
          </p>
        </>
      }
      
      {(done && answer !== UNRELATED_ANSWER) && (
        <>
          <hr className='nhsuk-section-break nhsuk-section-break--m nhsuk-section-break--visible' />
          <p className='text-nhs-blue mb-2'>{translate('sources')}</p>
          {searchQuery.sourceLinks.map((source, index) => (
            <div key={index} className='my-2 overflow-auto max-sm:flex'>
              <a
                className='hover:cursor-pointer hover:underline'
                target='_blank'
                rel='noopener noreferrer'
                href={source}
              >
                <span className="max-sm:flex-1  ">
                  {searchQuery.sourceHeadings[index] ?? 'NHS Search'}
                  <span className="ml-4 max-sm:float-none sm:float-right inline-flex items-center rounded-md bg-sky-50 max-sm:px-1.5 px-2 py-1 max-sm:text-xs text-xs max-sm:font-semibold font-bold text-sky-600 ring-1 ring-inset ring-sky-600/90 hover:bg-sky-100">
                    Verified source: {source.split("//")[1].split("/")[0].replace("www.", "")}
                  </span>
                </span>
              </a>
            </div>
          ))}
          <hr className='nhsuk-section-break nhsuk-section-break--m nhsuk-section-break--visible' />
        </>
      )}
      { (done || answer === UNRELATED_ANSWER) && (
        <button className="nhsuk-button" onClick={onReset}>{translate('button.newQuery')}</button>
      )}
    </>
  );
};
