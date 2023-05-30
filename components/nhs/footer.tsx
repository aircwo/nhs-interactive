"use client";

import { Footer as NHSFooter } from "nhsuk-react-components";

export const Footer = () => {
  return (
    <NHSFooter>
      <NHSFooter.List>
        <NHSFooter.ListItem href="/">back to top</NHSFooter.ListItem>
      </NHSFooter.List>
      <NHSFooter.Copyright>&copy; </NHSFooter.Copyright>
    </NHSFooter>
  );
}