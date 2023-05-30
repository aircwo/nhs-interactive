"use client";

import { WarningCallout } from "nhsuk-react-components";

export default function Page() {
  return (
    <>
      <h1>
        NHS
        <span className='ml-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-purple-700'>
          Interactive
        </span>
      </h1>
      <WarningCallout>
        <WarningCallout.Label>Disclaimer</WarningCallout.Label>
        <p>
          This is a mock service made to look like an NHS website using their
          frontend toolkit and react components. Information given may also
          differ from truth. Do not use this for real medical advice or as a source of truth.
        </p>
      </WarningCallout>
    </>
  );
}
