import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { wrapper } from '../../app/[locale]/components/nhs/wrapper';
import { load } from 'cheerio';

describe('wrapper', () => {
  test('rendered component should match snapshot', () => {
    const { container } = render(<>{ wrapper('content', false) }</>);
    expect(container).toMatchSnapshot();
  });

  test('should render the component with the correct links & elements', () => {
    const { container } = render(<>{ wrapper('content', false) }</>);
    const html = container.innerHTML;
    const $ = load(html);
    const nhsContainer = $('.nhsuk-width-container');
  
    expect(nhsContainer.text()).toStrictEqual('content');
    expect(nhsContainer.find('p').length).toBe(0);
  });
});
