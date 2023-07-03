
import { IconBrandGithub } from "@tabler/icons-react";
import { OpenAIModel } from "../lib/utils/constants";

/**
 * `export const GitHubIcon = () => {` is defining a React functional component that returns an anchor tag with the GitHub
 * icon from the `@tabler/icons-react` library. The anchor tag has a link to the GitHub profile of the user `worti3`. This
 * component can be imported and used in other parts of the codebase.
 * 
 * @function
 * @name GitHubIcon
 * @kind variable
 * @returns {JSX.Element}
 * @exports
 */
export const GitHubIcon = () => {
  return (
    <a
      className="absolute top-2 right-2 p-4 cursor-pointer text-white hover:text-yellow-400 visited:text-white"
      href="https://github.com/worti3"
      target="_blank"
      rel="noreferrer"
      aria-label="Github Profile"
    >
      <IconBrandGithub />
    </a>
  );
};

/**
 * `export const ModelInfo` is defining a React functional component that returns a paragraph element displaying
 * information about a specific OpenAI model. The model information is accessed through the `OpenAIModel` constant defined
 * in the `constants.ts` file. This component can be imported and used in other parts of the codebase.
 * 
 * @function
 * @name ModelInfo
 * @kind variable
 * @returns {JSX.Element}
 * @exports
 */
export const ModelInfo = () => {
  return (
    <p className="nhsuk-body-s nhsuk-u-secondary-text-color nhsuk-u-margin-top-7 nhsuk-u-margin-bottom-0">
      Model: { OpenAIModel.DAVINCI_TURBO }
    </p>
  );
}

/**
 * This code exports a function named `makeSourcesLinks` that takes in two parameters: `answer` and `sourceLinks`. The
 * function splits the `answer` string using a regular expression and maps over the resulting array. If a part of the
 * string matches the regular expression `/\[[0-9]+\]/`, it extracts the number within the square brackets, uses it to
 * retrieve a link from the `sourceLinks` array, and returns an anchor tag with the link and the original part of the
 * string. If the part of the string does not match the regular expression, it returns the original part of the string. The
 * function then returns an array of elements that can be rendered in the UI.
 * 
 * @function
 * @name makeSourcesLinks
 * @kind variable
 * @exports
 */
export const makeSourcesLinks = (answer: string, sourceLinks: string[]) => {
  const elements = answer.split(/(\[[0-9]+\])/).map((part, index) => {
    if (/\[[0-9]+\]/.test(part)) {
      const link = sourceLinks[parseInt(part.replace(/[\[\]]/g, "")) - 1];

      return (
        <a
          key={index}
          className="hover:cursor-pointer text-nhs-blue text-base"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    } else {
      return part;
    }
  });

  return elements;
};