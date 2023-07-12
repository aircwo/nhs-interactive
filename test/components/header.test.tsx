import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Header } from '../../app/[locale]/components/nhs/Header';
import { load } from 'cheerio';
import { NextIntlProvider } from 'next-intl';
import { LOCALES } from '../constants';

jest.mock('next-intl/link', () => 'Link'); // mock Link is needed here

describe('NHSHeader component', () => {
  function toRender(messages: any, locale: string) { 
    return (<NextIntlProvider messages={messages} locale={locale}>
      <Header locale={locale} />
    </NextIntlProvider>)
  };

  test.each(LOCALES)(
    'rendered component should match snapshot (%s)',
    (locale) => {
      const messages = require(`../../locales/${locale}.json`);
      const { container } = render(toRender(messages, locale));
      expect(container).toMatchSnapshot();
    }
  );

  test.each(LOCALES)(
    'should render the component with the correct links & elements (%s)',
    (locale) => {
      const messages = require(`../../locales/${locale}.json`);
      const { container } = render(toRender(messages, locale));
      const html = container.innerHTML;
      const $ = load(html);
      const nhsHeader = $('.nhsuk-header__transactional-service-name');

      expect(nhsHeader.text()).toStrictEqual(messages.header.title);
      expect(nhsHeader.find('p').length).toBe(0);
      const headerLinks = nhsHeader.find('a');
      expect(headerLinks.length).toBe(1);
      expect(headerLinks.text()).toStrictEqual(messages.header.title);
      // language button
      const languageButton = $('button');
      expect(languageButton.length).toBe(1);
      expect(languageButton.text()).toStrictEqual(messages.header.button.language);
    }
  );
});
