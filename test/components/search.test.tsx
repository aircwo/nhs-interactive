import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Search } from '../../app/[locale]/components/Search';
import { NextIntlProvider } from 'next-intl';
import { LOCALES } from '../../app/utils/constants';

describe('Search', () => {
  function toRender(messages: any, locale: string) { 
    return (<NextIntlProvider messages={messages} locale={locale}>
      <Search
        onSearch={jest.fn()}
        onResultUpdate={jest.fn()}
        onDone={jest.fn()}
      />
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
    "displays error message when submit with empty query (%s)",
    async (locale) => {
      const messages = require(`../../locales/${locale}.json`);
      render(toRender(messages, locale));
      const submitButton = screen.getByRole("button", { name: messages.search.button.submit });
      fireEvent.click(submitButton);
      const errorMessage = await screen.findByText(messages.search.error);
      expect(errorMessage).toBeInTheDocument();
    }
  );

  test.each(LOCALES)(
    "displays loading spinner when searching",
    async (locale) => {
      const messages = require(`../../locales/${locale}.json`);
      const { container } = render(toRender(messages, locale));
      const submitButton = screen.getByRole("button", { name: messages.search.button.submit });
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "test query" },
      });
      fireEvent.click(submitButton);
      const loadingSpinner = await screen.findByTestId("animated-progress");
      expect(loadingSpinner).toBeInTheDocument();
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
