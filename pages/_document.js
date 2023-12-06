// pages/_document.js

import Document from 'next/document'
import { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <script dangerouslySetInnerHTML={{
            __html: `if (document.body.classList.contains('dark')) {
              document.body.classList.remove('dark')
              document.body.classList.add('dark')
            }`
          }} />
        </body>
      </Html>
    )
  }
}

export default MyDocument
