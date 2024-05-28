import { FC, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./nhs";
import { ResultProps, UNRELATED_ANSWER } from "../../utils";
import { useApiLog } from "../../utils/hooks";
// import FeedbackDialog from "./Feedback";

export const Results: FC<ResultProps> = ({ searchQuery, answer, done, onReset, answerIdStore }) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [logData, setLogData] = useState({ searchQuery, answer });
  const translate = useTranslations('results');
  // const logData: LogData = { searchQuery, answer };

  const handleFeedbackSubmit = (feedback: any) => {
    const updatedLogData = { ...logData, feedback };
    setLogData(updatedLogData);
    setFeedbackGiven(true);
    useApiLog(logData, feedbackGiven, answerIdStore);
  };

  return (
    <>
    {/* {JSON.stringify(logData)} */}
      <p className='text-md text-nhs-blue mb-2'>{translate('question')}</p>
      <dl className="nhsuk-summary-list">
        <div className="nhsuk-summary-list__row">
          <dd className="nhsuk-summary-list__value">
            {searchQuery.query} (?)
          </dd>
          <dd className="nhsuk-summary-list__actions">
            <a onClick={onReset} href={`/?q=${searchQuery.query.replace(/\s+/g, '+')}#search-input`}>
            {answer !== UNRELATED_ANSWER && translate('change')}<span className="nhsuk-u-visually-hidden"> {translate('question').toLowerCase()}</span>
            </a>
          </dd>
        </div>
      </dl>

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

      {(done && answer !== UNRELATED_ANSWER && searchQuery.sourceLinks.length > 0) && (
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
                <span className="max-sm:flex-1">
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
        <div className="flex justify-between space-x-4 h-18">
          <Button onClick={onReset} as="a" href="/">{translate('button.newQuery')}</Button>
          {/* <button onClick={() => setIsFeedbackOpen(true)}>
            Give Feedback
          </button>
          <FeedbackDialog
            isOpen={isFeedbackOpen}
            onClose={() => setIsFeedbackOpen(false)}
            onSubmit={handleFeedbackSubmit}
          /> */}
        </div>
        // <div className="flex justify-between space-x-4 h-18">
        //   <div className=""><Button onClick={onReset} as="a" href="/">{translate('button.newQuery')}</Button></div>
        //   <div className="w-1/2 flex justify-center space-x-2 h-full">
        //     <p className="font-semibold text-sm my-auto">How was this response?</p>
        //     <Button secondary className="pt-30"><IconThumbUp /></Button>
        //     <Button secondary className=""><IconThumbDown /></Button>
        //   </div>
        // </div>
      )}
    </>
  );
};
