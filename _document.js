import { Html, Head, Main, NextScript } from "next/document";

// This file wraps every page. We use it to load our two fonts:
// "Fraunces" (a characterful serif) for headlines, and
// "Karla" (a clean sans-serif) for body text and UI.
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Karla:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="description"
          content="Pick what's in your kitchen, get recipes that actually use it."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
