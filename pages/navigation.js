import Link from 'next/link'


const Navigation = () => (
  <div>
    <Link href='/'><a>主页</a></Link> |
    <Link href='/about' prefetch><a>关于</a></Link> |
    <Link href='/contact' prefetch><a>联系信息</a></Link>
  </div>
)

export default Navigation;