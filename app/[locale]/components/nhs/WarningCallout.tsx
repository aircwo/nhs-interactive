import React, { ReactNode, ChangeEvent } from 'react';

interface WarningCalloutProps {
  className?: string;
  children: ReactNode;
}

/**
 * Represents a warning callout component.
 *
 * @component
 * @param {object} props - The properties of the component.
 * @param {string} [props.className] - Additional class names to be applied to the warning callout.
 * @param {ReactNode} props.children - The content of the warning callout.
 * @returns {ReactNode} The rendered warning callout component.
 */
export const WarningCallout: React.FC<WarningCalloutProps> = ({ className, children }) => {
  const containerClasses = `${className || ''} nhsuk-warning-callout`;

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

interface WarningCalloutLabelProps {
  children: ReactNode;
}

/**
 * Represents a label within a warning callout.
 *
 * @component
 * @param {object} props - The properties of the component.
 * @param {ReactNode} props.children - The content of the label.
 * @returns {ReactNode} The rendered label component.
 */
export const WarningCalloutLabel: React.FC<WarningCalloutLabelProps> = ({ children }) => (
  <h2 className="nhsuk-warning-callout__label">
    <span role="text">
      <span className="nhsuk-u-visually-hidden">Important: </span>
      {children}
    </span>
  </h2>
);

interface WarningCalloutTextProps {
  children: ReactNode;
}

/**
 * Can be removed in future.. relays children given in a p tag.
 * 
 * @component
 * @param {object} props - The properties of the component.
 * @returns {ReactNode} The rendered text component.
 */
export const WarningCalloutText: React.FC<WarningCalloutTextProps> = ({ children }) => {
  return <p>{children}</p>;
};
