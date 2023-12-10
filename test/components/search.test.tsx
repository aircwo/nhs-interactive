import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Search } from '../../app/[locale]/components/Search';
import { NextIntlClientProvider } from 'next-intl';
import { LOCALES } from '../../app/utils/constants';
import { act } from 'react-dom/test-utils';

describe('Search', () => {
  function toRender(messages: any, locale: string) { 
    return (<NextIntlClientProvider messages={messages} locale={locale}>
      <Search
        onSearch={jest.fn()}
        onResultUpdate={jest.fn()}
        onDone={jest.fn()}
      />
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
    "displays error message when submit with empty query (%s)",
    async (locale) => {
      const messages = require(`../../locales/${locale}.json`);
      render(toRender(messages, locale));
      const submitButton = await screen.findByText(messages.search.button.submit);
      act(() => {
      fireEvent.click(submitButton);
      });
      const errorMessage = await screen.findByText(messages.search.errors.too_small);
      expect(errorMessage).toBeInTheDocument();
    }
  );

  test.each(LOCALES)(
    "displays loading spinner when searching",
    async (locale) => {
      const messages = require(`../../locales/${locale}.json`);
      const { container } = render(toRender(messages, locale));
      const submitButton = await screen.findByText(messages.search.button.submit);
      
      act(() => {
        fireEvent.change(screen.getByRole("textbox"), {
          target: { value: "what is an HRT PPC" },
        });
      });
      act(() => {
      fireEvent.click(submitButton);
      });
      const loadingSpinner = await screen.findByTestId("animated-progress");
      // expect(loadingSpinner).toBeInTheDocument(); fix test
      expect(container.firstChild).toMatchSnapshot();
    }
  );

  test.each(LOCALES)('displays input label text', (locale) => {
    const messages = require(`../../locales/${locale}.json`);
    render(toRender(messages, locale));
    const inputLabel = screen.getByLabelText(messages.search.query);
    expect(inputLabel).toBeInTheDocument();
  });
});
