import React, { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  hint?: string;
  error?: string | null;
}

/**
 * Represents a customizable input component.
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
  const inputContainerClasses = `nhsuk-form-group ${error ? 'nhsuk-form-group--error' : ''}`;
  const inputClasses = `nhsuk-input ${error ? 'nhsuk-input--error' : ''}`;
  
  return (
    <div className={inputContainerClasses}>
      {label && <label className="nhsuk-label" htmlFor={id}>{label}</label>}
      {hint && <span className="nhsuk-hint">{hint}</span>}
      {error && <span className="nhsuk-error-message">{error}</span>}
      <input
        id={id}
        className={inputClasses}
        aria-describedby={hint && id ? `${id}-hint` : undefined}
        aria-invalid={!!error}
        {...restProps}
      />
    </div>
  );
};

// Example usage:
// <Input
//   id="search-input"
//   label={translate('query')}
//   hint={translate('hint')}
//   placeholder={translate('placeholder')}
//   value={query}
//   type="text"
//   onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
//   onKeyDown={handleKeyDown}
//   error={error}
// />

export default Input;
