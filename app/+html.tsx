import type { PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Arrow cursor everywhere by default */
              * { cursor: default; }

              /* Pointer on interactive elements (Pressable = tabIndex 0 in RNW) and their children */
              [tabindex="0"],
              [tabindex="0"] * { cursor: pointer; }

              /* Text cursor on text inputs */
              input, textarea { cursor: text !important; }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
