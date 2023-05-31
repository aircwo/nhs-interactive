"use client";

import { Header as NHSHeader } from "nhsuk-react-components";
import { GitHubIcon } from "../defaults";

export const Header = () => {
  return (
    <>
      <NHSHeader transactional>
        <NHSHeader.Container>
          <NHSHeader.Logo href="/" />
          <NHSHeader.ServiceName href="/">Interactive</NHSHeader.ServiceName>
        </NHSHeader.Container>
      </NHSHeader>
      <GitHubIcon />
    </>
  );
}
