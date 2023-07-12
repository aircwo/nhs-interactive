import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Results } from '../../app/[locale]/components/Results';
import { ResultProps } from '@/app/utils/interfaces';
import { load } from 'cheerio';
import { NextIntlProvider } from 'next-intl';
import { UNRELATED_ANSWER, LOCALES } from '../../app/utils/constants';

describe('Results', () => {
  let props: ResultProps;
  function toRender(messages: any, locale: string) { 
    return (<NextIntlProvider messages={messages} locale={locale}>
      <Results {...props} />
    </NextIntlProvider>)
  };

  beforeEach(() => {
    props = {
      searchQuery: {
        query: 'test query',
        sourceLinks: ['https://www.link1', 'https://www.link2']
      },
      answer: 'test answer',
      done: false,
      onReset: jest.fn()
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
  
    expect($('a').length).toBe(0);
    expect($('p').length).toBe(4);
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
      expect(paragraphs.length).toBe(4);
      expect(paragraphs.text()).toStrictEqual(
        messages.results.question + 
        props.searchQuery.query + ' (?)' +
        messages.results.answer + props.answer
      );
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
    }
  );
});
