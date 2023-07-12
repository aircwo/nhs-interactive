import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LanguageSelector from '../../app/[locale]/components/LanguageSelector';
import { load } from 'cheerio';
import { NextIntlProvider } from 'next-intl';
import { LOCALES } from '../constants';

jest.mock('next-intl/link', () => 'Link'); // mock Link is needed here

describe('LanguageSelector component', () => {
  let translation: { 'button.language': string };
  const mockTranslate = jest.fn((key: keyof { 'button.language': string }) => {
    const translations = translation;
    return translations[key];
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function toRender(messages: any, locale: string) {
    translation = { 'button.language': messages.header.button.language };
    return (<NextIntlProvider messages={messages} locale={locale}>
      <LanguageSelector locale={locale} translate={mockTranslate} />
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
      
      const languageButton = $('button');
      
      expect(languageButton.length).toBe(1);
      expect(languageButton.text()).toStrictEqual(messages.header.button.language);
    }
  );

  test.each(LOCALES)(
    'should render the component with the correct links & elements (%s)',
    async (locale) => {
      const messages = require(`../../locales/${locale}.json`);
      const { container } = render(toRender(messages, locale));
      const html = container.innerHTML;
      const $ = load(html);
      
      const submitButton = screen.getByRole("button", { name: messages.header.button.language });
      fireEvent.click(submitButton);
      expect(container).toMatchSnapshot();

      const languageItems = screen.getAllByTestId('language-item');
      const expectedLanguages = LOCALES.filter((lang) => lang !== locale);
      const expectedLanguagesText = expectedLanguages.map((lang) =>
        lang === 'en' ? 'English' : lang === 'cy' ? 'Cymraeg' : 'Gaelic'
      );

      expect(languageItems).toHaveLength(expectedLanguages.length);
      languageItems.forEach((item, index) => {
        const languageText = expectedLanguagesText[index];
        expect(item).toHaveTextContent(languageText);
      });
    }
  );
});
