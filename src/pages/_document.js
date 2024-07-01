import {
  Html, Head, Main, NextScript,
} from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="h-full">
      <Head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="true"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined&family=Material+Icons&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Material+Symbols+Outlined&family=Material+Symbols+Rounded&display=swap"
          rel="stylesheet"
          crossOrigin="true"
        />
      </Head>
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
