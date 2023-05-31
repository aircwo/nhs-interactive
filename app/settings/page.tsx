"use client";

import { BackLink, InsetText, Tag } from "nhsuk-react-components";
import { Settings } from "../components/Settings";

export default function Page() {
  return (
    <>
      <BackLink href='/'>Go back</BackLink>
      <h1>Settings <Tag className="align-middle" color="white"><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-purple-700">BETA</span></Tag></h1>
      <h2>Here you can update the OpenAI API Key</h2>
      <p>You can obtain your personal API key <a>here</a>.</p>
      <InsetText>
        <p>
          To change back to your default configuration set in your <span className="font-semibold">.env</span> file. Use the API key: <span className="font-semibold">local</span>.
        </p>
      </InsetText>
      <Settings/>
    </>
  );
};