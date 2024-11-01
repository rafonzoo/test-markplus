import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body className='min-w-[320px]'>
        <div className='w-[87.5%] max-w-[440px] mx-auto md:w-full md:max-w-2xl lg:max-w-[980px]'>
          <Main />
        </div>
        <NextScript />
      </body>
    </Html>
  )
}
