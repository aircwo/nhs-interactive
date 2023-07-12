import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Results } from '../../app/[locale]/components/Results';
import { ResultProps } from '@/app/utils/interfaces';
import { load } from 'cheerio';
import { useTranslations } from 'next-intl';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn().mockReturnValue(() => 'Translated Text'),
}));

describe('Results', () => {
  let props: ResultProps;

  beforeEach(() => {
    props = {
      searchQuery: {
        query: 'test query',
        sourceLinks: ['https://www.link1', 'https://www.link2']
      },
      answer: 'test answer',
      done: false, // TODO: truthy tests
      onReset: jest.fn()
    };
  });
  
  test('rendered component should match snapshot', () => {
    const { container } = render(<Results {...props} />);
    expect(container).toMatchSnapshot();
  });

  // test('renders correctly with unrelated answer', () => {
  //   props.answer = UNRELATED_ANSWER;
  //   const { container } = render(<Results {...props} />);
  //   expect(container).toMatchSnapshot();
  // });

  test('renders correctly with correct elements', () => {
    const { container } = render(<Results {...props} />);
    const html = container.innerHTML;
    const $ = load(html);
  
    expect($('a').length).toBe(0);
    expect($('p').length).toBe(4);
  });
});
