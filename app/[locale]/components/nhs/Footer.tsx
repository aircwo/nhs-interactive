"use client";

import { Footer as NHSFooter } from "nhsuk-react-components";

export const Footer = () => {
  return (
    <NHSFooter>
      <NHSFooter.List>
        <NHSFooter.ListItem href="https://github.com/worti3" target="_blank" rel="noreferrer" aria-label="Github Profile">Github</NHSFooter.ListItem>
      </NHSFooter.List>
      {/* <NHSFooter.Copyright>&copy; </NHSFooter.Copyright> */}
    </NHSFooter>
  );
}
