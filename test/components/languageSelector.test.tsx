import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageSelector from '../../app/[locale]/components/LanguageSelector';
import { load } from 'cheerio';
import { LOCALES } from '../../app/utils/constants';
import { NextIntlClientProvider } from 'next-intl';
import { act } from 'react';

describe('LanguageSelector component', () => {
  let translation: { 'button.language': string };
  const mockTranslate = jest.fn((key: keyof { 'button.language': string }) => {
    const translations = translation;
    return translations[key];
  });

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      })),
    });
  });

  function toRender(messages: any, locale: string) {
    translation = { 'button.language': messages.header.button.language };
    return (<NextIntlClientProvider messages={messages} locale={locale}>
      <LanguageSelector locale={locale} translate={mockTranslate} />
    </NextIntlClientProvider>)
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
      
      const submitButton = screen.getByRole("button", { name: messages.header.button.language });
      act(() => {
        fireEvent.click(submitButton);
      });
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
