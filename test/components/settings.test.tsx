import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Settings } from '../../app/components/Settings';
import { LOCAL_KEY_ID } from '../../app/lib/utils/constants';

describe('Settings', () => {
  test('rendered component should match snapshot', () => {
    const { container } = render(<Settings />);
    expect(container).toMatchSnapshot();
  });

  test('should render the component with the correct button text to match snapshot', () => {
    const { container, getByText } = render(<Settings />);
    const showSettingsButton = getByText('Show Settings');

    fireEvent.click(showSettingsButton);

    expect(getByText('Hide Settings')).toBeInTheDocument();
    expect(localStorage.getItem(LOCAL_KEY_ID)).toEqual(null);
    expect(container).toMatchSnapshot();
  });

  test('displays error message when an invalid API key is entered to match snapshot', () => {
    const { container, getByLabelText, getByText } = render(<Settings />);
    const showSettingsButton = getByText('Show Settings');
    fireEvent.click(showSettingsButton); // open setting options

    const apiKeyInput = getByLabelText('OpenAi API Key');
    fireEvent.change(apiKeyInput, { target: { value: 'invalid-api-key' } });
  
    const saveButton = getByText('Save');
    fireEvent.click(saveButton);
  
    expect(apiKeyInput).toHaveValue('invalid-api-key');
    expect(saveButton).toBeInTheDocument();
    expect(getByText('Clear')).toBeInTheDocument();
    expect(getByText('provide a valid OpenAi API Key')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  
  test('clear API key input field when Clear button is used', () => {
    const { getByLabelText, getByText } = render(<Settings />);
    const showSettingsButton = getByText('Show Settings');
    fireEvent.click(showSettingsButton); // open setting options

    const apiKeyInput = getByLabelText('OpenAi API Key');
    fireEvent.change(getByLabelText('OpenAi API Key'), { target: { value: 'invalid-api-key' } });
  
    const clearButton = getByText('Clear');
    fireEvent.click(clearButton);
  
    expect(apiKeyInput).toHaveValue('');
    expect(clearButton).toBeInTheDocument();
    expect(getByText('Save')).toBeInTheDocument();
  });

  test('full user journey should set valid API key into localStorage', () => {
    const { getByLabelText, getByText } = render(<Settings />);
    fireEvent.click(getByText('Show Settings')); // open setting options

    const apiKeyInput = getByLabelText('OpenAi API Key');
    fireEvent.change(apiKeyInput, { target: { value: 'local' } }); // use locally stored api key
  
    const saveButton = getByText('Save');
    fireEvent.click(saveButton);
  
    expect(saveButton).not.toBeInTheDocument();
    expect(getByText('Show Settings')).toBeInTheDocument();
    expect(localStorage.getItem(LOCAL_KEY_ID)).toEqual(JSON.stringify('local'));
  });
  
});