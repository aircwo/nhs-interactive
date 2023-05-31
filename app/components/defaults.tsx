
import { IconBrandGithub } from "@tabler/icons-react";
import { OpenAIModel } from "../lib/utils/constants";

export const GitHubIcon = () => {
  return (
    <a
      className="absolute top-2 right-2 p-4 cursor-pointer text-white hover:text-yellow-400 visited:text-white"
      href="https://github.com/worti3"
      target="_blank"
      rel="noreferrer"
    >
      <IconBrandGithub />
    </a>
  );
};

export const ModelInfo = () => {
  return (
    <p className="nhsuk-body-s nhsuk-u-secondary-text-color nhsuk-u-margin-top-7 nhsuk-u-margin-bottom-0">
      Model: { OpenAIModel.DAVINCI_TURBO }
    </p>
  );
}

export const makeSourcesLinks = (answer: string, sourceLinks: string[]) => {
  const elements = answer.split(/(\[[0-9]+\])/).map((part, index) => {
    if (/\[[0-9]+\]/.test(part)) {
      const link = sourceLinks[parseInt(part.replace(/[\[\]]/g, "")) - 1];

      return (
        <a
          key={index}
          className="hover:cursor-pointer text-blue-500"
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