import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Results } from '../../app/components/Results';
import { UNRELATED_ANSWER } from '../../app/lib/utils/constants';
import { ResultProps } from '@/app/lib/utils/interfaces';
import { load } from 'cheerio';

describe('Results', () => {
  let props: ResultProps;

  beforeEach(() => {
    props = {
      searchQuery: {
        query: 'test query',
        sourceLinks: ['https://www.link1', 'https://www.link2']
      },
      answer: 'test answer',
      done: true,
      onReset: jest.fn()
    };
  });
  
  test('rendered component should match snapshot', () => {
    const { container } = render(<Results {...props} />);
    expect(container).toMatchSnapshot();
  });

  test('renders correctly with unrelated answer', () => {
    props.answer = UNRELATED_ANSWER;
    const { container } = render(<Results {...props} />);
    expect(container).toMatchSnapshot();
  });

  test('renders correctly with correct elements', () => {
    const { container } = render(<Results {...props} />);
    const html = container.innerHTML;
    const $ = load(html);
  
    expect($('a').length).toBe(2); // 2 links
    expect($('p').length).toBe(5);
  });
});
