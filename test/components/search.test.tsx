import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Search } from '../../app/[locale]/components/Search';
import { useTranslations } from 'next-intl';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn().mockReturnValue(() => ({
    search: {
      lang: 'english',
      query: 'Enter a health related query',
      hint: 'e.g What is an HRT PPC?',
      error: 'must provide a search term',
      loading: 'Thinking...',
      placeholder: 'type something here',
      button: {
        submit: 'Submit',
      },
    },
  })),
}));

describe('Search', () => {
  test('renders correctly and matches snapshot', () => {
    const { container } = render(
      <Search
        onSearch={jest.fn()}
        onResultUpdate={jest.fn()}
        onDone={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('displays error message when submit with empty query', async () => {
    render(
      <Search
        onSearch={jest.fn()}
        onResultUpdate={jest.fn()}
        onDone={jest.fn()}
      />
    );
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    const errorMessage = await screen.findByText(/must provide a search term/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('displays loading spinner when searching', async () => {
    const { container } = render(
      <Search
        onSearch={jest.fn()}
        onResultUpdate={jest.fn()}
        onDone={jest.fn()}
      />
    );
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'test query' },
    });
    fireEvent.click(submitButton);
    const loadingSpinner = await screen.findByTestId('animated-progress');
    expect(loadingSpinner).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('displays input label text', () => {
    render(
      <Search
        onSearch={jest.fn()}
        onResultUpdate={jest.fn()}
        onDone={jest.fn()}
      />
    );
    const inputLabel = screen.getByLabelText(/enter a health related query/i);
    expect(inputLabel).toBeInTheDocument();
  });
});
