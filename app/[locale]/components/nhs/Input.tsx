import { classNames } from '../../../utils';
import { parseAsString, useQueryState } from 'next-usequerystate';
import React from 'react';

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string;
  label?: string;
  hint?: string;
  error?: string | null;
}

/**
 * Represents a customisable input component.
 *
 * @component
 * @param {object} props - The properties of the component.
 * @param {string} [props.id] - The unique identifier for the input.
 * @param {string} [props.label] - The label for the input.
 * @param {string} [props.hint] - The hint for the input.
 * @param {string | null} [props.error] - The error message for the input.
 * @param {ReactNode} props.children - The content of the input.
 * @returns {ReactNode} The rendered input component.
 */
const Input: React.FC<InputProps> = ({
  id,
  label,
  hint,
  error,
  ...restProps
}) => {
  const [rows, setRows] = React.useState(1);
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(""));
  const [showText, setShowText] = React.useState(false);
  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    if (event.target.value.length >= 50 && query.length >= 50) {
      setShowText(true);
      setRows(3);
    } else {
      setShowText(false);
      // dont set rows here
    }
    
    setQuery(event.target.value);
  };

  const inputContainerClasses = `nhsuk-character-count nhsuk-form-group ${error ? 'nhsuk-form-group--error' : ''}`;
  const textBoxClasses = `nhsuk-textarea nhsuk-js-character-count ${error ? 'nhsuk-textarea--error' : ''}`;
  
  return (
    <div className={inputContainerClasses}>
      {label && <label className="nhsuk-label" htmlFor={id}>{label}</label>}
      {hint && <span className="nhsuk-hint">{hint}</span>}
      {error && <span className="nhsuk-error-message">{error}</span>}
      <textarea 
        id={id}
        value={query}
        className={textBoxClasses} 
        rows={rows}
        maxLength={100}
        onChange={handleChange} 
        {...restProps}></textarea>
    
      { showText &&
        <div className={classNames((query.length > 95) ? "nhsuk-error-message" : "nhsuk-hint")} id="exceeding-info">
          You have {100 - query.length} characters remaining
        </div>
      }
    </div>
  );
};

export default Input;
