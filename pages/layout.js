import Navigation from './navigation'
import Footer from './footer'
import Head from 'next/head'

export default ({ children , title ='数据建模工具'}) => (
  <div>
    <Head>
        <title>{title}</title>
    </Head>
    <header>
      <Navigation />
    </header>
    <div>
      { children }
    </div>
    <Footer>
      这是页脚
    </Footer>
  </div>
)