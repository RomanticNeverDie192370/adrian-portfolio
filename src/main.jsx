import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, Download, Menu, Pause, Play, X } from 'lucide-react'
import './style.css'

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
const source = asset('background.mp4')

function App() {
  const videoRef = useRef(null)
  const [page, setPage] = useState(() => location.hash.slice(1) || 'home')
  const [isPlaying, setIsPlaying] = useState(true)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [copiedContact, setCopiedContact] = useState('')
  const navigate = (target) => { location.hash = target; setPage(target) }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined
    video.src = source
    video.play().catch(() => setIsPlaying(false))
    return () => video.pause()
  }, [page])

  useEffect(() => {
    if (!isContactOpen) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && setIsContactOpen(false)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isContactOpen])

  useEffect(() => {
    const elements = [...document.querySelectorAll('.work-card, .project-summary, .project-artwork, .resume-intro, .resume-block, .resume-closing')]
    elements.forEach((element, index) => {
      element.classList.add('reveal-item')
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`)
    })
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: .12, rootMargin: '0px 0px -5% 0px' })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [page])

  const toggleVideo = () => { const video = videoRef.current; if (video.paused) { video.play(); setIsPlaying(true) } else { video.pause(); setIsPlaying(false) } }
  const copyContact = async (label, value) => {
    await navigator.clipboard.writeText(value)
    setCopiedContact(label)
    window.setTimeout(() => setCopiedContact(''), 1600)
  }
  const nav = [['home', '首页'], ['experience', '作品展示'], ['about', '关于我']]

  return <main className="landing-page">
    {page === 'home' && <video ref={videoRef} className="background-video" autoPlay muted loop playsInline />}
    <div className="video-overlay" /><div className="grain" />
    <header className="glass-header">
      <button className="logo-button" onClick={() => navigate('home')} aria-label="Adrian 首页"><svg viewBox="450 450 1030 220" role="img" aria-label="Adrian logo"><image href={asset('adrian-logo.svg')} width="1920" height="1080" /></svg></button>
      <nav aria-label="主导航">{nav.map(([id, label]) => <button className={page === id ? 'active' : ''} onClick={() => navigate(id)} key={id}>{label}</button>)}</nav>
      <button className="header-cta" type="button" onClick={() => setIsContactOpen(true)}>联系我 <ArrowUpRight size={15} /></button><button className="menu-button" aria-label="打开导航"><Menu size={20} /></button>
    </header>
    {isContactOpen && <div className="contact-modal" role="presentation" onMouseDown={() => setIsContactOpen(false)}>
      <section className="contact-card" role="dialog" aria-modal="true" aria-labelledby="contact-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="contact-close" type="button" aria-label="关闭联系方式" onClick={() => setIsContactOpen(false)}><X size={19}/></button>
        <p>CONTACT / ADRIAN</p>
        <h2 id="contact-title">和我聊聊<br/>你的项目。</h2>
        <dl>
          <div><dt>电话</dt><dd><button type="button" onClick={() => copyContact('电话', '178 3605 9298')}>178 3605 9298 <span>{copiedContact === '电话' ? '已复制' : '点击复制'}</span></button></dd></div>
          <div><dt>邮箱</dt><dd><button type="button" onClick={() => copyContact('邮箱', 'Yzy.192370@gmail.com')}>Yzy.192370@gmail.com <span>{copiedContact === '邮箱' ? '已复制' : '点击复制'}</span></button></dd></div>
          <div><dt>站酷</dt><dd>adrian_a</dd></div>
        </dl>
      </section>
    </div>}
    {page === 'home' && <section className="hero"><div className="hero-meta"><span>Visual designer · Brand designer</span><span>Shanghai / Worldwide</span></div><div className="hero-copy"><p className="kicker">Independent visual practice</p><h1>Hello, I’m<br/><em>Adrian.</em></h1><div className="hero-footer"><p>一名视觉设计师，专注品牌视觉、数字体验与 AI 创意。用理性构建系统，以直觉创造值得被记住的画面。</p><button className="discover-link" onClick={() => navigate('experience')}>看看他的作品 <span><ArrowUpRight size={17}/></span></button></div></div><button className="right-rail" onClick={() => navigate('experience')} aria-label="进入作品展示"><span>View projects</span><span className="rail-line"/><span>01 / 03</span></button></section>}
    {page === 'experience' && <section className="work-page"><header className="work-hero"><p>01 — SELECTED WORK</p><h1>作品<br/><em>展示</em></h1><span>品牌视觉 / 电商设计 / AI 创意</span></header><div className="work-grid"><a className="work-card work-featured work-link" href="https://adrian-car-light-store.yzy-192370.chatgpt.site" target="_blank" rel="noreferrer"><img src={asset('projects/car-light-store-cover.png')} alt="Performance automotive lighting independent store"/><div className="work-shade"/><div className="work-number">01 ↗</div><div className="work-info"><p>INDEPENDENT E-COMMERCE / 2026</p><h2>Performance<br/>Lighting Store</h2><span>独立站视觉、商品系统与完整购物体验 · 点击进入网站</span></div></a><a className="work-card work-link taihang-card" href="https://taihang-xu.yzy-192370.chatgpt.site" target="_blank" rel="noreferrer"><img src={asset('projects/taihang-xu-cover.jpg')} alt="太行序东方草本茶品牌视觉项目"/><div className="work-shade"/><div className="work-number">02 ↗</div><div className="work-info"><p>TAIHANG XU / 2026</p><svg className="taihang-project-logo" viewBox="160 365 1080 315" role="img" aria-label="太行序品牌标志"><image href={asset('projects/taihang-xu-logo.svg')} width="1400" height="1050" /></svg><span>点击进入品牌网站</span></div></a><article className="work-card work-link" onClick={() => navigate('hakii')} role="button" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && navigate('hakii')}><img src={asset('projects/hakii-arctic-air-tech.jpg')} alt="HAKII Arctic Air Tech earbud visual project"/><div className="work-shade"/><div className="work-number">03</div><div className="work-info"><p>HAKII / 2024</p><h2>Arctic<br/>Air Tech</h2><span>耳机品牌视觉与电商详情页设计</span></div></article></div></section>}
    {page === 'hakii' && <section className="project-detail"><button className="back-link" onClick={() => navigate('experience')}>← 返回作品展示</button><header><p>03 — HAKII / 2024</p><h1>Arctic Air<br/><em>Tech.</em></h1><span>耳机品牌视觉 / 电商详情页设计</span></header><div className="project-summary"><p>为 HAKII Arctic Air Tech 打造电商视觉系统，围绕开放式聆听体验、舒适佩戴与科技感，完成主视觉、卖点内容与详情页叙事。</p><dl><div><dt>Scope</dt><dd>品牌视觉 · A+ 页面 · 电商内容</dd></div><div><dt>Role</dt><dd>Visual Design · Art Direction</dd></div></dl></div><figure className="project-artwork"><img src={asset('projects/hakii-arctic-air-tech.jpg')} alt="HAKII Arctic Air Tech full visual design"/></figure></section>}
    {page === 'about' && <section className="resume-page"><header className="resume-hero"><p>02 — ABOUT ME / RESUME</p><h1>Adrian<br/><em>Visual Designer</em></h1><div><span>6年电商视觉经验</span><span>跨境平台 / 品牌视觉 / AI 创意</span></div><button className="resume-download" type="button" disabled>下载完整简历 <Download size={16}/></button></header><section className="resume-intro"><p className="resume-label">PROFILE</p><p className="resume-lead">具备 6 年电商视觉设计经验，熟悉亚马逊、eBay 及国内电商平台的视觉规范与内容逻辑。将生成式 AI 应用于创意发散、场景素材生成、画面延展与风格统一，在保证视觉品质的同时提升设计效率。</p><dl><div><dt>手机</dt><dd>178 3605 9298</dd></div><div><dt>邮箱</dt><dd>Yzy.192370@gmail.com</dd></div><div><dt>站酷</dt><dd>adrian_a</dd></div></dl></section><section className="resume-block"><p className="resume-label">EXPERIENCE</p><h2>工作经历</h2><article className="resume-row"><span>2023.07 — 至今</span><div><h3>南京知玄电子商务有限公司 <small>电商设计师</small></h3><p>负责 Amazon、eBay 等跨境电商平台的主图、卖点图、详情页及 A+ 页面；覆盖汽车大灯、中网、尾灯与踏板等品类。独立完成拍摄、精修、场景合成与信息排版，并参与品牌独立站视觉建设。</p></div></article><article className="resume-row"><span>2020.07 — 2023.07</span><div><h3>弛纳科技有限公司 <small>电商设计师</small></h3><p>负责店铺日常视觉与新品上架，完成产品拍摄、图片精修、详情页、活动页面及短视频素材。通过竞品调研与视觉动线优化，提升商品信息的传达效率。</p></div></article></section><section className="resume-block resume-projects"><p className="resume-label">SELECTED PROJECTS</p><h2>代表项目</h2><div className="project-list"><article><b>01</b><h3>AI 驱动的大灯 / 尾灯双店铺视觉重设计</h3><p>将生成式 AI 应用于创意探索、场景图生成与素材延展；单套完整视觉制作周期由 3 天缩短至 1 天，交付效率提升 3 倍。</p></article><article><b>02</b><h3>多店铺品牌标识与主视觉系统重构</h3><p>为 5–6 个电商店铺完成 Logo、主视觉及店铺页面系统升级，提升多触点中的品牌识别与一致性。</p></article><article><b>03</b><h3>亚马逊汽车配件 A+ 页面升级</h3><p>围绕功能卖点、适配信息与使用场景，完成主图、卖点图和 A+ 页面的一体化设计。</p></article></div></section><section className="resume-closing"><p>EDUCATION / Shanxi Institute of Energy · 2017 — 2020</p><h2>寻找下一段<br/><em>视觉叙事。</em></h2><button type="button" onClick={() => setIsContactOpen(true)}>联系我 <ArrowUpRight size={18}/></button></section></section>}
    <button className="play-control" onClick={toggleVideo}>{isPlaying ? <Pause size={16}/> : <Play size={16}/>}<span>{isPlaying ? 'Pause' : 'Play'}</span></button>
    <footer className="hero-footer-bar"><span>Based in Shanghai — Working worldwide</span><span>© ADRIAN 2025</span><span>31°13′N 121°28′E</span></footer>
  </main>
}
createRoot(document.getElementById('root')).render(<App />)
