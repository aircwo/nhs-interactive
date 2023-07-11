import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Header } from '../../app/[locale]/components/nhs/Header';
import { load } from 'cheerio';

describe('NHSHeader component', () => {
  test('rendered component should match snapshot', () => {
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });

  test('should render the component with the correct links & elements', () => {
    const { container } = render(<Header />);
    const html = container.innerHTML;
    const $ = load(html);
    const nhsHeader = $('.nhsuk-header');
  
    expect(nhsHeader.text()).toStrictEqual('NHS LogoInteractive');
    expect(nhsHeader.find('p').length).toBe(0);
    const headerLinks = nhsHeader.find('a');
    expect(headerLinks.length).toBe(2);
    expect(headerLinks.text()).toStrictEqual('NHS LogoInteractive');
  });
});
