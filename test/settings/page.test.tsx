import Page from "../../app/settings/page";
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { load } from "cheerio";

describe('Settings', () => {
  test('rendered component should match snapshot', () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });

  test('should render the component with the correct links & elements', () => {
    const { container, getByText } = render(<Page />);
    const html = container.innerHTML;
    const $ = load(html);
  
    expect($('h1').length).toBe(1);
    expect($('h1').text()).toBe('Settings BETA');
    expect($('h2').length).toBe(1);
    expect($('h2').text()).toBe('Here you can update the OpenAI API Key');
    expect($('a').length).toBe(3);
    expect($('svg').length).toBe(1);
    expect($('p').length).toBe(2);
    expect(getByText('Show Settings')).toBeInTheDocument();
  });
});