import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { GitHubIcon, ModelInfo, makeSourcesLinks } from '../../app/components/defaults';
import { load } from 'cheerio';

describe('GitHubIcon', () => {
  test('rendered component should match snapshot', () => {
    const { container } = render(GitHubIcon());
    expect(container).toMatchSnapshot();
  });

  test('should render the component with the correct links & elements', () => {
    const { container } = render(GitHubIcon());
    const html = container.innerHTML;
    const $ = load(html);  

    expect($('a').length).toBe(1);
    expect($('svg').length).toBe(1);
    expect($('p').length).toBe(0);
  });
});

describe('ModelInfo', () => {
  test('rendered component should match snapshot', () => {
    const { container } = render(ModelInfo());
    expect(container).toMatchSnapshot();
  });

  test('should render the component with the correct links & elements', () => {
    const { container } = render(ModelInfo());
    const html = container.innerHTML;
    const $ = load(html);  

    expect($('a').length).toBe(0);
    expect($('svg').length).toBe(0);
    expect($('p').length).toBe(1);
    expect($('p').text()).toBe("Model: gpt-3.5-turbo");
  });
});

describe('makeSourcesLinks', () => {
  const answer = "The running fox jumped over the hill. They jump so high due to their ability to contract muscles [1] at lightning speed. [2]";
  test('rendered component should match snapshot', () => {
    const { container } = render(<>{ makeSourcesLinks(answer, ["link1", "link2"]) }</>);
    expect(container).toMatchSnapshot();
  });

  test('should render the component with the correct links & elements', () => {
    const { container } = render(<>{ makeSourcesLinks(answer, ["link1", "link2"]) }</>);

    const html = container.innerHTML;
    const $ = load(html);  

    expect($('a').length).toBe(2);
    expect($('a').text()).toBe("[1][2]");
    expect($('a').hasClass('text-blue-500')).toBeTruthy();
    expect($('a').hasClass('hover:cursor-pointer')).toBeTruthy();
    expect($('svg').length).toBe(0);
    expect($('p').length).toBe(0);
  });
});
