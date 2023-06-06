import Page from "../app/page";
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { load } from "cheerio";

describe('Home page', () => {
  test('rendered component should match snapshot', () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });

  test('should render the component with the correct links & elements', () => {
    const { container } = render(<Page />);
    const html = container.innerHTML;
    const $ = load(html);
  
    expect($('h1').length).toBe(1);
    expect($('h1').text()).toBe('NHSInteractive');
    expect($('h2').length).toBe(0);
    expect($('a').length).toBe(1);
    expect($('svg').length).toBe(1);
    expect($('p').length).toBe(2);
  });
});