'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function ProgressBarProvider({ children }) {
  return (
    <>
      <ProgressBar
        height="5px"
        color="#0051bc"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  );
}

