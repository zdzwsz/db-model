import Document, { Head, Main, NextScript } from 'next/document'
// 控制全局样式

export default class SiteDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <body>
          <div>
          <Main />
          </div>
          <NextScript />
        </body>
      </html>
    )
  }
}