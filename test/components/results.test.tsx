import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Results } from '../../app/[locale]/components/Results';
import { ResultProps } from '@/app/utils/interfaces';
import { load } from 'cheerio';
import { NextIntlClientProvider } from 'next-intl';
import { UNRELATED_ANSWER, LOCALES } from '../../app/utils/constants';
import { SearchQuery } from '@/types';

describe('Results', () => {
  let props: ResultProps;
  function toRender(messages: any, locale: string) { 
    return (<NextIntlClientProvider messages={messages} locale={locale}>
      <Results {...props} />
    </NextIntlClientProvider>)
  };

  beforeEach(() => {
    props = {
      searchQuery: {
        query: 'test query',
        sourceLinks: ['https://www.link1', 'https://www.link2']
      } as SearchQuery,
      answer: 'test answer',
      done: false,
      onReset: jest.fn(),
      answerIdStore: "123456789"
    };
  });
  
  test.each(LOCALES)(
    'rendered component should match snapshot (%s)',
    (locale) => {
      const messages = require(`../../locales/${locale}.json`);
      const { container } = render(toRender(messages, locale));
      expect(container).toMatchSnapshot();
    }
  );

  test.each(LOCALES)('renders correctly with correct elements (%s)', (locale) => {
    const messages = require(`../../locales/${locale}.json`);
    const { container } = render(toRender(messages, locale));
    const html = container.innerHTML;
    const $ = load(html);
  
    expect($('dl').length).toBe(1);
    expect($('a').length).toBe(1);
    expect($('p').length).toBe(3);
  });

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      done: true,
    }),
  });
  test.each(LOCALES)(
    'renders correctly with valid answer (%s)',
    async (locale) => {
      const messages = require(`../../locales/${locale}.json`);
      const { container } = render(toRender(messages, locale));
      expect(container).toMatchSnapshot();

      const html = container.innerHTML;
      const $ = load(html);

      const headings = $('.text-nhs-blue');
      expect(headings.length).toBe(2);
      expect(headings.text()).toStrictEqual(
        messages.results.question + 
        messages.results.answer
      );
      const paragraphs = $('p');
      expect(paragraphs.length).toBe(3);
      expect(paragraphs.text()).toStrictEqual(
        messages.results.question + 
        messages.results.answer + props.answer
      );
      assertQuestion($, props, messages);
    }
  );

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      answer: UNRELATED_ANSWER,
      done: true,
    }),
  });
  test.each(LOCALES)(
    'renders correctly with unrelated answer (%s)',
    async (locale) => {
      props.searchQuery.sourceLinks = [];
      props.answer = UNRELATED_ANSWER;
      const messages = require(`../../locales/${locale}.json`);
      const { container } = render(toRender(messages, locale));
      expect(container).toMatchSnapshot();

      const html = container.innerHTML;
      const $ = load(html);

      const unAnswerableDetails = $('.nhsuk-details__text');
      expect(unAnswerableDetails.length).toBe(1);
      expect(unAnswerableDetails.text()).toStrictEqual(
        messages.results.error.paragraphTwo + 
        messages.results.error.list.one + 
        messages.results.error.list.two + 
        messages.results.error.list.three
      );
      assertQuestion($, props, messages, true);
    }
  );
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      answer: UNRELATED_ANSWER,
      done: true,
    }),
  });
  test.each(LOCALES)(
    'renders correctly with unrelated answer when source is also present (%s)',
    async (locale) => {
      props.searchQuery.sourceLinks = ['https://www.link1'];
      props.answer = UNRELATED_ANSWER;
      const messages = require(`../../locales/${locale}.json`);
      const { container } = render(toRender(messages, locale));
      expect(container).toMatchSnapshot();

      const html = container.innerHTML;
      const $ = load(html);

      const unAnswerableDetails = $('.nhsuk-details__text');
      expect(unAnswerableDetails.length).toBe(1);
      expect(unAnswerableDetails.text()).toStrictEqual(
        messages.results.error.paragraphTwo + 
        messages.results.error.list.one + 
        messages.results.error.list.two + 
        messages.results.error.list.three
      );
      assertQuestion($, props, messages, true);
    }
  );
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      answer: "test answer",
      done: true,
    }),
  });
  test.each(LOCALES)(
    'renders correctly with unrelated answer when source is also present (%s)',
    async (locale) => {
      props.searchQuery.sourceLinks = ['https://www.link1'];
      const messages = require(`../../locales/${locale}.json`);
      const { container } = render(toRender(messages, locale));
      expect(container).toMatchSnapshot();

      const html = container.innerHTML;
      const $ = load(html);

      const unAnswerableDetails = $('.nhsuk-details__text');
      expect(unAnswerableDetails.length).toBe(0);
      expect(unAnswerableDetails.text()).not.toStrictEqual(
        messages.results.error.paragraphTwo + 
        messages.results.error.list.one + 
        messages.results.error.list.two + 
        messages.results.error.list.three
      );
      const paragraphs = $('p');
      expect(paragraphs.length).toBe(3);
      expect(paragraphs.text()).toStrictEqual(
        messages.results.question + 
        messages.results.answer + props.answer
      );
      assertQuestion($, props, messages);
    }
  );
});

function assertQuestion($: any, props: ResultProps, messages: any, hidden: boolean = false) {
  const summaryList = $('dl');
  expect(summaryList.length).toBe(1);
  const changeText = hidden ? '' : messages.results.change;
  const summaryText = props.searchQuery.query + ' (?)' + changeText + ` ${messages.results.question.toLowerCase()}`;
  expect(summaryList.text()).toStrictEqual(summaryText);
}
