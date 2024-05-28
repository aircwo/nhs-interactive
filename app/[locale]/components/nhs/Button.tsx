import React, { ReactNode } from 'react';

interface ButtonProps {
  id?: string;
  className?: string;
  type?: "submit" | "button" | "reset";
  secondary?: boolean;
  reverse?: boolean;
  preventDoubleClick?: boolean;
  as?: 'button' | 'a';
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement> | React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  disabled?: boolean;
  children: ReactNode;
}

/**
 * Represents a customizable button component.
 *
 * @component
 * @param {object} props - The properties of the component.
 * @param {string} [props.id] - The unique identifier for the button.
 * @param {string} [props.className] - Additional class names to be applied to the button.
 * @param {"submit" | "button" | "reset"} [props.type="button"] - The type of the button (submit, button, reset).
 * @param {boolean} [props.secondary=false] - Determines if the button is of secondary style.
 * @param {boolean} [props.reverse=false] - Determines if the button is of reverse style.
 * @param {boolean} [props.preventDoubleClick=false] - Determines if double-click prevention should be applied.
 * @param {'button' | 'a'} [props.as='button'] - The type of element to render (button or anchor).
 * @param {string} [props.href] - The URL to navigate to if the button is rendered as an anchor.
 * @param {(event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement> | React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => void} [props.onClick] - The callback function for the click event.
 * @param {boolean} [props.disabled] - Determines if the button is disabled.
 * @param {ReactNode} props.children - The content of the button.
 * @returns {ReactNode} The rendered button component.
 */
const Button: React.FC<ButtonProps> = ({
  id,
  className,
  type = "button",
  secondary = false,
  reverse = false,
  preventDoubleClick = false,
  as = 'button',
  href,
  onClick,
  disabled,
  children
}) => {
  const buttonClasses = `nhsuk-button ${secondary ? 'nhsuk-button--secondary' : ''} ${reverse ? 'nhsuk-button--reverse' : ''} ${className || ''} ${disabled ? 'disabled' : ''}`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement> | React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (preventDoubleClick && event.type === 'click') {
      (event.currentTarget as HTMLButtonElement).disabled = true;
    }
    if (onClick) {
      onClick(event);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  };

  if (as === 'a') {
    return (
      <a
        id={id}
        className={buttonClasses}
        href={disabled ? undefined : href}
        onClick={disabled ? undefined : handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      id={id}
      className={buttonClasses}
      type={type}
      data-module="nhsuk-button"
      data-prevent-double-click={preventDoubleClick}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
