import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Search } from '../../app/components/Search';

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
});
