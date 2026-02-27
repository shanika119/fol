import { useState, useEffect, useRef, useCallback } from "react";

const BASE = import.meta.env.BASE_URL;

/* ════════════════════════════════════════════
   GLOBAL CSS
════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body,#root{width:100%;min-height:100vh;overflow-x:hidden;}
:root{
  --bg:#000a14;--bg2:#000d1a;--bg3:#001220;
  --accent:#00ffff;--accent2:#00ff88;--accent3:#0088ff;
  --warm:#ff6b35;--purple:#a78bfa;
  --text:#ffffff;--text2:#b0d4e8;--text3:#4a7a8a;
  --border:rgba(0,255,255,0.18);--glow:rgba(0,255,255,0.4);--glow2:rgba(0,255,136,0.3);
}

/* ── CUSTOM CURSOR ── */
*{cursor:none!important;}
#sn-cursor{
  position:fixed;width:12px;height:12px;
  background:var(--accent);
  border-radius:50%;
  pointer-events:none;z-index:99999;
  transform:translate(-50%,-50%);
  box-shadow:0 0 10px var(--accent),0 0 20px var(--accent),0 0 40px rgba(0,255,255,.4);
  transition:width .15s,height .15s,background .15s,box-shadow .15s;
  mix-blend-mode:screen;
}
#sn-cursor-ring{
  position:fixed;width:38px;height:38px;
  border:1px solid rgba(0,255,255,.5);
  border-radius:50%;
  pointer-events:none;z-index:99998;
  transform:translate(-50%,-50%);
  transition:transform .08s linear,width .2s,height .2s,border-color .2s,opacity .2s,border-width .2s;
  background:transparent;
}
#sn-cursor-ring::before{
  content:'';position:absolute;top:50%;left:50%;
  width:4px;height:4px;
  border-radius:50%;
  background:var(--accent2);
  transform:translate(-50%,-50%);
  box-shadow:0 0 6px var(--accent2);
}
#sn-cursor-ring::after{
  content:'';position:absolute;inset:-8px;
  border:none;
  background:
    linear-gradient(var(--accent),var(--accent)) center top/1px 6px no-repeat,
    linear-gradient(var(--accent),var(--accent)) center bottom/1px 6px no-repeat,
    linear-gradient(var(--accent),var(--accent)) left center/6px 1px no-repeat,
    linear-gradient(var(--accent),var(--accent)) right center/6px 1px no-repeat;
  opacity:.5;
}
#sn-cursor.clicking{width:6px;height:6px;background:var(--accent2);box-shadow:0 0 16px var(--accent2),0 0 32px rgba(0,255,136,.6);}
#sn-cursor-ring.clicking{width:54px;height:54px;border-color:var(--accent2);opacity:.7;}
#sn-cursor.view-more{width:18px;height:18px;background:var(--accent2);box-shadow:0 0 20px var(--accent2),0 0 40px rgba(0,255,136,.5);}
#sn-cursor-ring.view-more{width:60px;height:60px;border-color:var(--accent2);border-width:2px;opacity:.9;}

@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.12);opacity:1}}
@keyframes glitch1{0%,100%{clip-path:inset(0 0 97% 0);transform:translate(-3px,0)}33%{clip-path:inset(35% 0 45% 0);transform:translate(3px,0)}66%{clip-path:inset(70% 0 15% 0);transform:translate(-2px,0)}}
@keyframes glitch2{0%,100%{clip-path:inset(0 0 97% 0);transform:translate(3px,0)}33%{clip-path:inset(55% 0 25% 0);transform:translate(-3px,0)}66%{clip-path:inset(20% 0 65% 0);transform:translate(2px,0)}}
@keyframes scanDown{0%{top:-4px}100%{top:100vh}}
@keyframes dataFlow{0%{transform:translateY(-100%);opacity:0}5%{opacity:.6}95%{opacity:.6}100%{transform:translateY(100vh);opacity:0}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes kenBurns{0%{transform:scale(1) translate(0,0)}100%{transform:scale(1.1) translate(-2%,-1%)}}
@keyframes slideInR{from{opacity:0;transform:translateX(80px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideInL{from{opacity:0;transform:translateX(-80px)}to{opacity:1;transform:translateX(0)}}
@keyframes countUp{from{opacity:0;transform:scale(.4) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes hexFloat{0%,100%{transform:translateY(0) rotate(0deg);opacity:.08}50%{transform:translateY(-20px) rotate(30deg);opacity:.18}}
@keyframes textGlow{0%,100%{text-shadow:0 0 7px var(--accent),0 0 14px var(--accent)}50%{text-shadow:0 0 14px var(--accent),0 0 30px var(--accent),0 0 50px rgba(0,255,255,.5)}}
@keyframes circuitDraw{from{stroke-dashoffset:2000}to{stroke-dashoffset:0}}
@keyframes particleDrift{0%{transform:translate(0,0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translate(var(--dx),var(--dy));opacity:0}}
@keyframes heroSlideUp{from{opacity:0;transform:translateY(70px)}to{opacity:1;transform:translateY(0)}}
@keyframes profileReveal{from{opacity:0;transform:scale(.88) translateY(40px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes orbRing1{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes orbRing2{0%{transform:rotate(0deg)}100%{transform:rotate(-360deg)}}
@keyframes orbRing3{0%{transform:rotate(45deg)}100%{transform:rotate(405deg)}}
@keyframes scanLine{0%{top:0%}100%{top:100%}}
@keyframes photoGlow{0%,100%{box-shadow:0 0 30px rgba(0,255,255,.2),0 0 60px rgba(0,255,255,.06)}50%{box-shadow:0 0 55px rgba(0,255,255,.38),0 0 110px rgba(0,255,136,.14)}}
@keyframes borderRotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes cvPulse{0%,100%{box-shadow:0 0 18px rgba(245,200,66,.35),0 0 35px rgba(245,200,66,.15)}50%{box-shadow:0 0 35px rgba(245,200,66,.6),0 0 65px rgba(245,200,66,.25)}}

@keyframes cornerPulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
@keyframes energyBeam{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes laserScan{0%{top:-2px;opacity:0}5%{opacity:1}45%{opacity:.8}50%{top:100%;opacity:0}51%{top:-2px;opacity:0}100%{top:-2px;opacity:0}}
@keyframes laserScanH{0%{left:-2px;opacity:0}5%{opacity:.6}45%{opacity:.4}50%{left:100%;opacity:0}51%{left:-2px;opacity:0}100%{left:-2px;opacity:0}}
@keyframes gridPulse{0%,100%{opacity:.04}50%{opacity:.09}}
@keyframes floatDataTag{0%,100%{transform:translateY(0px);opacity:.8}50%{transform:translateY(-6px);opacity:1}}
@keyframes cornerBracketGlow{0%,100%{box-shadow:0 0 6px rgba(0,255,255,.5),0 0 12px rgba(0,255,255,.2)}50%{box-shadow:0 0 14px rgba(0,255,255,1),0 0 28px rgba(0,255,255,.5),0 0 50px rgba(0,255,255,.2)}}
@keyframes outerRingRotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes outerRingCCW{0%{transform:rotate(0deg)}100%{transform:rotate(-360deg)}}
@keyframes squareGlow{0%,100%{box-shadow:0 0 20px rgba(0,255,255,.15),0 0 40px rgba(0,255,255,.05),inset 0 0 20px rgba(0,255,255,.02)}50%{box-shadow:0 0 40px rgba(0,255,255,.3),0 0 80px rgba(0,255,136,.12),inset 0 0 30px rgba(0,255,255,.05)}}
@keyframes nodeOrbit{0%{transform:rotate(0deg) translateX(52px) rotate(0deg)}100%{transform:rotate(360deg) translateX(52px) rotate(-360deg)}}
@keyframes nodeOrbitCCW{0%{transform:rotate(0deg) translateX(66px) rotate(0deg)}100%{transform:rotate(-360deg) translateX(66px) rotate(360deg)}}
@keyframes pixelGlitch{0%,94%,100%{clip-path:none;transform:none;opacity:1}95%{clip-path:inset(20% 0 60% 0);transform:translateX(-4px);opacity:.85}97%{clip-path:inset(60% 0 10% 0);transform:translateX(4px);opacity:.9}}
@keyframes statusBlink{0%,100%{background:rgba(0,255,136,.15);border-color:rgba(0,255,136,.4)}50%{background:rgba(0,255,136,.28);border-color:rgba(0,255,136,.8)}}
@keyframes diagScan{0%{transform:translate(-120%,-120%) rotate(45deg);opacity:0}10%{opacity:.7}90%{opacity:.5}100%{transform:translate(220%,220%) rotate(45deg);opacity:0}}
@keyframes haloExpand{0%,100%{transform:scale(1);opacity:.12}50%{transform:scale(1.06);opacity:.22}}
@keyframes videoProgress{from{width:0%}to{width:100%}}

.nav-link{font-family:'Orbitron',monospace;font-size:15px;letter-spacing:3px;font-weight:600;background:none;border:none;cursor:none!important;color:var(--text3);border-bottom:1px solid transparent;padding-bottom:5px;transition:all .3s;text-transform:uppercase;}
.nav-link:hover,.nav-link.active{color:var(--accent);border-bottom-color:var(--accent);text-shadow:0 0 14px var(--accent);}
.btn-primary{font-family:'Orbitron',monospace;font-size:15px;letter-spacing:3px;font-weight:700;padding:16px 40px;background:transparent;color:var(--accent);border:1px solid var(--accent);cursor:none!important;transition:all .3s;text-transform:uppercase;display:inline-block;text-decoration:none;position:relative;overflow:hidden;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);}
.btn-primary::before{content:'';position:absolute;inset:0;background:var(--accent);transform:translateX(-100%);transition:transform .3s ease;z-index:0;}
.btn-primary:hover::before{transform:translateX(0);}
.btn-primary:hover{color:#000;box-shadow:0 0 40px var(--glow);}
.btn-primary span{position:relative;z-index:1;}
.btn-outline{font-family:'Orbitron',monospace;font-size:15px;letter-spacing:3px;font-weight:700;padding:16px 40px;background:transparent;color:var(--accent2);border:1px solid var(--accent2);cursor:none!important;transition:all .3s;text-transform:uppercase;display:inline-block;text-decoration:none;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);}
.btn-outline:hover{background:rgba(0,255,136,.12);box-shadow:0 0 20px var(--glow2);transform:translateY(-3px);}
.btn-cv{font-family:'Orbitron',monospace;font-size:15px;letter-spacing:3px;font-weight:700;padding:16px 40px;background:transparent;color:#f5c842;border:1px solid #f5c842;cursor:none!important;transition:all .3s;text-transform:uppercase;display:inline-flex;align-items:center;gap:10px;text-decoration:none;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);position:relative;overflow:hidden;animation:cvPulse 3s ease-in-out infinite;}
.btn-cv::before{content:'';position:absolute;inset:0;background:#f5c842;transform:translateX(-100%);transition:transform .3s ease;z-index:0;}
.btn-cv:hover::before{transform:translateX(0);}
.btn-cv:hover{color:#000;box-shadow:0 0 40px rgba(245,200,66,.5);}
.btn-cv span{position:relative;z-index:1;}
.card{background:rgba(0,18,32,.7);border:1px solid var(--border);border-radius:3px;transition:all .35s;backdrop-filter:blur(10px);}
.card:hover{border-color:var(--accent);box-shadow:0 0 30px rgba(0,255,255,.12),inset 0 0 30px rgba(0,255,255,.03);}
.card-lift:hover{transform:translateY(-5px);}
.tag-chip{font-family:'Share Tech Mono',monospace;font-size:16px;color:var(--accent);border:1px solid rgba(0,255,255,.3);padding:6px 14px;border-radius:2px;background:rgba(0,255,255,.06);letter-spacing:1px;}
.section-tag{font-family:'Share Tech Mono',monospace;font-size:18px;color:var(--accent2);letter-spacing:4px;margin-bottom:14px;}
.section-title{font-family:'Orbitron',monospace;font-weight:900;color:var(--text);letter-spacing:5px;border-bottom:1px solid var(--border);padding-bottom:20px;margin-bottom:56px;}
.neon-line{height:1px;background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent);margin:8px 0;opacity:.6;}

@media(max-width:1024px){
  #sn-cursor,#sn-cursor-ring{display:none!important;}
  *{cursor:auto!important;}
  .nav-link{font-size:12px;letter-spacing:1.5px;}
  .hero-grid{grid-template-columns:1fr!important;gap:40px!important;padding:80px 30px 60px!important;}
  .hero-profile-col{height:340px!important;width:340px!important;margin:0 auto;}
  .stats-grid{grid-template-columns:repeat(3,1fr)!important;padding:40px 30px!important;}
  .about-grid{grid-template-columns:1fr!important;gap:40px!important;}
  .skills-grid{grid-template-columns:1fr!important;gap:0!important;}
  .skills-tags{grid-template-columns:repeat(3,1fr)!important;}
  .project-body-grid{grid-template-columns:1fr!important;gap:24px!important;}
  .leadership-section{padding:60px 30px!important;}
  .vol-body-grid{grid-template-columns:1fr!important;gap:20px!important;}
  .contact-cards{grid-template-columns:1fr!important;gap:12px!important;}
  .contact-buttons{flex-direction:column!important;align-items:center!important;}
  .section-pad{padding:60px 30px!important;}
}

@media(max-width:768px){
  .navbar-inner{padding:0 16px!important;height:56px!important;}
  .navbar-links{display:none!important;}
  .navbar-logo{font-size:18px!important;letter-spacing:2px!important;}
  .navbar-version{font-size:11px!important;}
  .mobile-menu-btn{display:flex!important;flex-direction:column;gap:5px;background:none;border:none;padding:8px;cursor:pointer!important;}
  .mobile-menu-btn span{width:22px;height:1px;background:var(--accent);box-shadow:0 0 6px var(--accent);display:block;transition:all .3s;}
  .mobile-nav{display:flex!important;flex-direction:column;gap:0;position:fixed;top:56px;left:0;right:0;background:rgba(0,8,16,.97);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);z-index:999;padding:0;}
  .mobile-nav button{font-family:'Orbitron',monospace;font-size:12px;letter-spacing:3px;background:none;border:none;border-bottom:1px solid rgba(0,255,255,.08);color:var(--text3);padding:16px 20px;text-align:left;text-transform:uppercase;transition:all .25s;cursor:pointer!important;}
  .mobile-nav button:hover,.mobile-nav button.active{color:var(--accent);background:rgba(0,255,255,.05);padding-left:28px;}
  .hero-slideshow-caption{font-size:14px!important;padding:0 16px!important;}
  .hero-grid{grid-template-columns:1fr!important;padding:70px 18px 50px!important;gap:32px!important;}
  .hero-profile-col{height:260px!important;width:260px!important;margin:0 auto;}
  .hero-cta-row{flex-direction:column!important;align-items:flex-start!important;gap:24px!important;}
  .hero-cta-row > *:first-child{width:90px!important;height:90px!important;}
  .hero-btns{flex-direction:row!important;flex-wrap:wrap!important;gap:10px!important;}
  .btn-primary,.btn-outline,.btn-cv{font-size:11px!important;letter-spacing:2px!important;padding:12px 20px!important;}
  .hero-links{flex-direction:column!important;gap:12px!important;}
  .hero-links a{font-size:12px!important;}
  .stats-grid{grid-template-columns:repeat(2,1fr)!important;padding:30px 16px!important;gap:10px!important;}
  .stats-grid > *:last-child{grid-column:1/-1;}
  .about-grid{grid-template-columns:1fr!important;gap:32px!important;}
  .about-info-grid{grid-template-columns:1fr!important;}
  .section-pad{padding:50px 18px!important;}
  .skills-tags{grid-template-columns:repeat(2,1fr)!important;}
  .assoc-card{flex-direction:column!important;gap:12px!important;}
  .vol-header-row{flex-direction:column!important;gap:12px!important;align-items:flex-start!important;}
  .contact-wrap{padding:50px 18px!important;}
  .section-title{font-size:22px!important;letter-spacing:3px!important;margin-bottom:32px!important;}
  .section-tag{font-size:12px!important;letter-spacing:2px!important;}
  .footer-inner{flex-direction:column!important;gap:10px!important;text-align:center!important;padding:20px 18px!important;}
  .footer-inner *{font-size:11px!important;}
}

@media(max-width:480px){
  .stats-grid{grid-template-columns:1fr 1fr!important;gap:8px!important;}
  .hero-profile-col{height:220px!important;width:220px!important;}
  .glitch-text{font-size:clamp(36px,11vw,56px)!important;}
  .skills-tags{grid-template-columns:repeat(2,1fr)!important;}
  .project-header{padding:16px!important;}
  .vol-header{padding:14px 16px!important;}
}
`;

const FuturisticCursor = () => {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const labelRef = useRef(null);
  const pos      = useRef({ x: 0, y: 0 });
  const ringPos  = useRef({ x: 0, y: 0 });
  const raf      = useRef(null);

  useEffect(() => {
    const dot   = dotRef.current;
    const ring  = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isViewMore = el?.closest('[data-cursor="view-more"]');
      if (isViewMore) {
        dot.classList.add('view-more');
        ring.classList.add('view-more');
        label.style.opacity = '1';
        label.style.transform = 'translate(-50%, -160%) scale(1)';
      } else {
        dot.classList.remove('view-more');
        ring.classList.remove('view-more');
        label.style.opacity = '0';
        label.style.transform = 'translate(-50%, -130%) scale(0.8)';
      }
    };
    const onDown = () => { dot.classList.add('clicking'); ring.classList.add('clicking'); };
    const onUp   = () => { dot.classList.remove('clicking'); ring.classList.remove('clicking'); };

    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.1);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.1);
      ring.style.left  = ringPos.current.x + 'px';
      ring.style.top   = ringPos.current.y + 'px';
      label.style.left = ringPos.current.x + 'px';
      label.style.top  = ringPos.current.y + 'px';
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div id="sn-cursor"      ref={dotRef}  />
      <div id="sn-cursor-ring" ref={ringRef} />
      <div ref={labelRef} style={{
        position:'fixed',
        pointerEvents:'none',
        zIndex:99997,
        left:0,
        top:0,
        transform:'translate(-50%, -130%) scale(0.8)',
        opacity:0,
        transition:'opacity 0.2s ease, transform 0.2s ease',
        fontFamily:'Share Tech Mono',
        fontSize:'11px',
        letterSpacing:'3px',
        color:'#000',
        background:'var(--accent2)',
        padding:'5px 12px',
        whiteSpace:'nowrap',
        clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)',
        boxShadow:'0 0 16px var(--glow2), 0 0 30px rgba(0,255,136,.3)',
        userSelect:'none',
      }}>VIEW MORE</div>
    </>
  );
};

const TitleInjector = () => {
  useEffect(() => {
    document.title = 'SN - Portfolio';
  }, []);
  return null;
};

const Particles = () => {
  const p = useRef([...Array(30)].map((_,i)=>({
    id:i, x:Math.random()*100, y:Math.random()*100,
    dx:(Math.random()-.5)*200, dy:(Math.random()-.5)*300,
    size:Math.random()*2+1, dur:5+Math.random()*10, delay:Math.random()*8,
    color:i%3===0?'#00ffff':i%3===1?'#00ff88':'#0088ff'
  }))).current;
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
      {p.map(q=>(
        <div key={q.id} style={{
          position:'absolute',left:`${q.x}%`,top:`${q.y}%`,
          width:q.size,height:q.size,borderRadius:'50%',
          background:q.color,boxShadow:`0 0 ${q.size*3}px ${q.color}`,
          '--dx':`${q.dx}px`,'--dy':`${q.dy}px`,
          animation:`particleDrift ${q.dur}s ease-in-out infinite`,
          animationDelay:`${q.delay}s`
        }}/>
      ))}
    </div>
  );
};

const CircuitBg = () => (
  <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.055}} viewBox="0 0 1440 900" preserveAspectRatio="none">
      <defs><filter id="cglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      {[...Array(26)].map((_,i)=><line key={`v${i}`} x1={i*58} y1="0" x2={i*58} y2="900" stroke="#00ffff" strokeWidth=".4" strokeDasharray="4,20" filter="url(#cglow)"/>)}
      {[...Array(17)].map((_,i)=><line key={`h${i}`} x1="0" y1={i*56} x2="1440" y2={i*56} stroke="#00ff88" strokeWidth=".3" strokeDasharray="6,30"/>)}
      {[[120,80],[360,220],[600,120],[900,180],[1100,80],[240,420],[540,380],[780,300],[1050,440],[160,600],[460,560],[740,510],[1020,580],[1260,480],[300,740],[620,700],[950,660],[1180,720]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="3.5" fill="#00ffff" filter="url(#cglow)" style={{animation:`blink ${1.5+i*.2}s infinite`,animationDelay:`${i*.18}s`}}/>
      ))}
      <path d="M120,80 L360,80 L360,220" fill="none" stroke="#00ffff" strokeWidth=".6" strokeDasharray="1000" style={{animation:'circuitDraw 8s linear infinite'}}/>
      <path d="M900,180 L1100,180 L1100,80" fill="none" stroke="#00ff88" strokeWidth=".6" strokeDasharray="1000" style={{animation:'circuitDraw 10s linear infinite',animationDelay:'2s'}}/>
      <path d="M460,560 L740,560 L740,510" fill="none" stroke="#0088ff" strokeWidth=".6" strokeDasharray="1000" style={{animation:'circuitDraw 9s linear infinite',animationDelay:'4s'}}/>
    </svg>
    {[{s:700,t:'-250px',r:'-250px',d:'0s',dur:'13s'},{s:450,b:'-150px',l:'-180px',d:'4s',dur:'16s'},{s:280,t:'35%',r:'6%',d:'2s',dur:'10s'},{s:160,t:'60%',l:'8%',d:'6s',dur:'8s'}].map((h,i)=>(
      <div key={i} style={{position:'absolute',width:h.s,height:h.s,top:h.t,bottom:h.b,left:h.l,right:h.r,clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',border:'1px solid rgba(0,255,255,.06)',background:'rgba(0,255,255,.015)',animation:`hexFloat ${h.dur} ease-in-out infinite`,animationDelay:h.d}}/>
    ))}
    {[...Array(10)].map((_,i)=>(
      <div key={i} style={{position:'absolute',left:`${i*10+2}%`,top:0,fontFamily:'Share Tech Mono',fontSize:'24px',color:`rgba(${i%2===0?'0,255,255':'0,255,136'},.13)`,writingMode:'vertical-rl',letterSpacing:'6px',userSelect:'none',animation:`dataFlow ${9+i*1.3}s linear infinite`,animationDelay:`${i*1.6}s`}}>
        {'01アイウエ00FFFF000A14'.split('').map((c,j)=>j%3===0?c:String.fromCharCode(65+(i*j)%26)).join('')}
      </div>
    ))}
    <div style={{position:'absolute',left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(0,255,255,.18),rgba(0,255,136,.12),transparent)',animation:'scanDown 8s linear infinite'}}/>
    <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 4px)'}}/>
  </div>
);

const PhotoPlaceholder = ({ label, src, style={} }) => (
  src
    ? <img src={src} alt={label} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',display:'block',...style}}/>
    : <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#000d1a 0%,#001525 50%,#000d1a 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',...style}}>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(0,255,255,.07),transparent)',backgroundSize:'200%',animation:'shimmer 3s infinite'}}/>
        <div style={{fontSize:'36px',marginBottom:'12px',opacity:.3,zIndex:1}}>📷</div>
        <div style={{fontFamily:'Share Tech Mono',fontSize:'24px',color:'rgba(0,255,255,.5)',letterSpacing:'2px',textAlign:'center',padding:'0 20px',zIndex:1,lineHeight:1.8}}>{label}</div>
      </div>
);

const ProfilePhoto = () => {
  const bracketLen = 28;
  const bracketThick = 3;
  const cornerColor = '#00ffff';
  const cornerColor2 = '#00ff88';
  const corners = [
    { top:0, left:0, borderTop:`${bracketThick}px solid ${cornerColor}`, borderLeft:`${bracketThick}px solid ${cornerColor}`, width:bracketLen, height:bracketLen },
    { top:0, right:0, borderTop:`${bracketThick}px solid ${cornerColor}`, borderRight:`${bracketThick}px solid ${cornerColor}`, width:bracketLen, height:bracketLen },
    { bottom:0, left:0, borderBottom:`${bracketThick}px solid ${cornerColor2}`, borderLeft:`${bracketThick}px solid ${cornerColor2}`, width:bracketLen, height:bracketLen },
    { bottom:0, right:0, borderBottom:`${bracketThick}px solid ${cornerColor2}`, borderRight:`${bracketThick}px solid ${cornerColor2}`, width:bracketLen, height:bracketLen },
  ];
  return (
    <div style={{position:'relative',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',width:'108%',height:'108%',border:'1px dashed rgba(0,255,255,.14)',animation:'outerRingRotate 22s linear infinite',pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'absolute',width:'115%',height:'115%',border:'1px solid rgba(0,255,136,.08)',animation:'outerRingCCW 30s linear infinite',pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'absolute',width:'108%',height:'108%',animation:'outerRingRotate 22s linear infinite',pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'-6px',left:'50%',transform:'translateX(-50%)',width:'12px',height:'12px',borderRadius:'50%',background:'var(--accent)',boxShadow:'0 0 14px var(--accent),0 0 30px rgba(0,255,255,.5)'}}/>
      </div>
      <div style={{position:'absolute',width:'115%',height:'115%',animation:'outerRingCCW 30s linear infinite',pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',bottom:'-5px',right:'12%',width:'8px',height:'8px',borderRadius:'50%',background:'var(--accent2)',boxShadow:'0 0 10px var(--accent2),0 0 22px rgba(0,255,136,.4)'}}/>
        <div style={{position:'absolute',top:'20%',left:'-5px',width:'6px',height:'6px',borderRadius:'50%',background:'#0088ff',boxShadow:'0 0 8px #0088ff'}}/>
      </div>
      <div style={{position:'relative',width:'76%',height:'76%',zIndex:2,animation:'squareGlow 4s ease-in-out infinite'}}>
        <div style={{position:'absolute',inset:'-12px',background:'radial-gradient(circle at 50% 50%, rgba(0,255,255,.08) 0%, rgba(0,255,136,.04) 50%, transparent 75%)',animation:'haloExpand 4s ease-in-out infinite',pointerEvents:'none',zIndex:0}}/>
        <div style={{position:'absolute',inset:'-2px',background:'linear-gradient(90deg,#00ffff,#00ff88,#0088ff,#00ffff)',backgroundSize:'300% 100%',animation:'energyBeam 3s linear infinite',zIndex:1,pointerEvents:'none'}}/>
        <div style={{position:'absolute',inset:'2px',background:'var(--bg)',zIndex:2,pointerEvents:'none'}}/>
        <div style={{position:'absolute',inset:'2px',overflow:'hidden',zIndex:3}}>
          <img src={`${BASE}profile.jpg`} alt="Shanika Nadun" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',display:'block',animation:'pixelGlitch 8s infinite'}}/>
          <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(0,255,255,.055) 1px, transparent 1px),linear-gradient(90deg, rgba(0,255,255,.055) 1px, transparent 1px)`,backgroundSize:'22px 22px',animation:'gridPulse 5s ease-in-out infinite',zIndex:4,pointerEvents:'none'}}/>
          <div style={{position:'absolute',inset:'-50%',width:'200%',height:'4px',background:'linear-gradient(90deg,transparent,rgba(0,255,255,.7),rgba(0,255,136,.4),transparent)',transformOrigin:'center',animation:'diagScan 5s ease-in-out infinite',zIndex:5,pointerEvents:'none'}}/>
          <div style={{position:'absolute',left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(0,255,255,.8),rgba(255,255,255,.4),rgba(0,255,255,.8),transparent)',animation:'laserScan 4s ease-in-out infinite',zIndex:6,pointerEvents:'none'}}/>
          <div style={{position:'absolute',top:0,bottom:0,width:'2px',background:'linear-gradient(180deg,transparent,rgba(0,255,136,.5),rgba(0,255,136,.8),transparent)',animation:'laserScanH 6s ease-in-out infinite 1.5s',zIndex:6,pointerEvents:'none'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(0,255,255,.07) 0%,transparent 40%,rgba(0,255,136,.05) 100%)',zIndex:4,pointerEvents:'none'}}/>
        </div>
        {corners.map((c,i)=>(
          <div key={i} style={{position:'absolute',...c,zIndex:8,animation:`cornerPulse ${1.6+i*0.3}s ease-in-out infinite`,animationDelay:`${i*0.25}s`}}>
            <div style={{position:'absolute',top:c.top!==undefined?'-3px':undefined,bottom:c.bottom!==undefined?'-3px':undefined,left:c.left!==undefined?'-3px':undefined,right:c.right!==undefined?'-3px':undefined,width:'6px',height:'6px',borderRadius:'50%',background:i<2?cornerColor:cornerColor2,boxShadow:`0 0 8px ${i<2?cornerColor:cornerColor2},0 0 16px ${i<2?cornerColor:cornerColor2}`,animation:'cornerBracketGlow 1.8s ease-in-out infinite',animationDelay:`${i*0.2}s`}}/>
          </div>
        ))}
        {[
          {top:'50%',left:'-6px',transform:'translateY(-50%)',width:'5px',height:'1px',bg:'rgba(0,255,255,.6)'},
          {top:'50%',right:'-6px',transform:'translateY(-50%)',width:'5px',height:'1px',bg:'rgba(0,255,255,.6)'},
          {left:'50%',top:'-6px',transform:'translateX(-50%)',width:'1px',height:'5px',bg:'rgba(0,255,136,.6)'},
          {left:'50%',bottom:'-6px',transform:'translateX(-50%)',width:'1px',height:'5px',bg:'rgba(0,255,136,.6)'},
        ].map((t,i)=>(
          <div key={i} style={{position:'absolute',...t,background:t.bg,zIndex:8,animation:`blink ${1.4+i*0.3}s infinite`,animationDelay:`${i*0.4}s`}}/>
        ))}
      </div>
      <div style={{position:'absolute',top:'3%',left:'2%',fontFamily:'Share Tech Mono',fontSize:'11px',color:'var(--accent)',background:'rgba(0,10,20,.82)',border:'1px solid rgba(0,255,255,.28)',padding:'4px 9px',letterSpacing:'1.5px',zIndex:9,backdropFilter:'blur(8px)',animation:'floatDataTag 3s ease-in-out infinite'}}>
        <span style={{color:'rgba(0,255,255,.5)',marginRight:'5px'}}>▸</span>IoT.ENG_v2.6
      </div>
      <div style={{position:'absolute',bottom:'3%',right:'2%',fontFamily:'Share Tech Mono',fontSize:'11px',color:'var(--accent2)',background:'rgba(0,10,20,.82)',border:'1px solid rgba(0,255,136,.3)',padding:'4px 10px',letterSpacing:'2px',zIndex:9,backdropFilter:'blur(8px)',animation:'statusBlink 2s ease-in-out infinite'}}>
        <span style={{marginRight:'5px',animation:'blink 0.9s infinite'}}>●</span>AVAILABLE
      </div>
      <div style={{position:'absolute',bottom:'3%',left:'2%',fontFamily:'Share Tech Mono',fontSize:'10px',color:'rgba(0,255,255,.38)',letterSpacing:'1px',zIndex:9,lineHeight:1.5,animation:'floatDataTag 4s ease-in-out infinite 1s'}}>X:0342<br/>Y:0618</div>
      <div style={{position:'absolute',top:'3%',right:'2%',fontFamily:'Share Tech Mono',fontSize:'10px',color:'rgba(0,255,136,.35)',letterSpacing:'1px',zIndex:9,textAlign:'right',animation:'floatDataTag 3.5s ease-in-out infinite 0.5s'}}>ID:SN<br/>26.02</div>
    </div>
  );
};

const HeroSlideshow = ({ photos }) => {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState('right');
  const timerRef = useRef();
  const goTo = useCallback((idx, d) => {
    const direction = d || (idx > cur ? 'right' : 'left');
    setDir(direction); setPrev(cur); setCur(idx);
    setTimeout(() => setPrev(null), 700);
  }, [cur]);
  useEffect(() => {
    timerRef.current = setInterval(() => goTo((cur+1)%photos.length, 'right'), 4500);
    return () => clearInterval(timerRef.current);
  }, [cur, goTo, photos.length]);
  return (
    <div style={{position:'relative',width:'100%',height:'100%',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,zIndex:10,pointerEvents:'none'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent)',animation:'shimmer 3s linear infinite'}}/>
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,var(--accent2),var(--accent),transparent)',animation:'shimmer 3s linear infinite reverse'}}/>
        <div style={{position:'absolute',top:0,bottom:0,left:0,width:'2px',background:'linear-gradient(180deg,transparent,var(--accent),transparent)'}}/>
        <div style={{position:'absolute',top:0,bottom:0,right:0,width:'2px',background:'linear-gradient(180deg,transparent,var(--accent2),transparent)'}}/>
      </div>
      {prev!==null&&<div style={{position:'absolute',inset:0,zIndex:1}}><PhotoPlaceholder label={photos[prev].label} src={photos[prev].src}/></div>}
      <div key={cur} style={{position:'absolute',inset:0,zIndex:2,animation:`${dir==='right'?'slideInR':'slideInL'} .65s cubic-bezier(.4,0,.2,1) both`}}>
        <div style={{position:'absolute',inset:0,animation:'kenBurns 4.5s ease-out both'}}><PhotoPlaceholder label={photos[cur].label} src={photos[cur].src}/></div>
      </div>
      <div style={{position:'absolute',inset:0,zIndex:3,background:'linear-gradient(to bottom,rgba(0,10,20,.3) 0%,transparent 30%,transparent 55%,rgba(0,10,20,.97) 100%)'}}/>
      <div style={{position:'absolute',inset:0,zIndex:3,background:'linear-gradient(to right,rgba(0,10,20,.4) 0%,transparent 40%)'}}/>
      <div className="hero-slideshow-caption" style={{position:'absolute',bottom:'64px',left:0,right:0,padding:'0 28px',zIndex:4}}>
        <div style={{fontFamily:'Share Tech Mono',fontSize:'24px',color:'var(--accent2)',letterSpacing:'3px',marginBottom:'6px',textShadow:'0 0 10px var(--accent2)'}}>{photos[cur].tag}</div>
        {photos[cur].caption&&<div style={{fontFamily:'Rajdhani',fontSize:'24px',color:'rgba(255,255,255,.9)',fontWeight:600}}>{photos[cur].caption}</div>}
      </div>
      <div style={{position:'absolute',bottom:'22px',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'7px',zIndex:5}}>
        {photos.map((_,i)=>(
          <button key={i} onClick={()=>{clearInterval(timerRef.current);goTo(i);}} style={{width:i===cur?'28px':'8px',height:'8px',borderRadius:'4px',background:i===cur?'var(--accent)':'rgba(0,255,255,.25)',border:'none',cursor:'pointer',transition:'all .35s',padding:0,boxShadow:i===cur?'0 0 8px var(--accent)':'none'}}/>
        ))}
      </div>
    </div>
  );
};

const PhotoSlideshow = ({ photos, height='220px' }) => {
  const [cur, setCur] = useState(0);
  useEffect(()=>{const t=setInterval(()=>setCur(p=>(p+1)%photos.length),3500);return()=>clearInterval(t);},[photos.length]);
  return (
    <div style={{position:'relative',borderRadius:'4px',overflow:'hidden',border:'1px solid var(--border)'}}>
      <div style={{height,position:'relative',overflow:'hidden'}}>
        <div key={cur} style={{position:'absolute',inset:0,animation:'fadeIn .5s ease both'}}>
          <PhotoPlaceholder label={photos[cur].label} src={photos[cur].src}/>
        </div>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(transparent,rgba(0,10,20,.9))',zIndex:2,pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'10px 14px',zIndex:3}}>
          <div style={{fontFamily:'Share Tech Mono',fontSize:'23px',color:'var(--accent)',letterSpacing:'2px'}}>{photos[cur].tag}</div>
          {photos[cur].caption&&<div style={{fontFamily:'Rajdhani',fontSize:'23px',color:'var(--text2)',marginTop:'2px'}}>{photos[cur].caption}</div>}
        </div>
      </div>
    </div>
  );
};

const ProjectPhotoSlideshow = ({ photos }) => {
  const [cur, setCur] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setInterval(() => setCur(p => (p + 1) % photos.length), 3500);
    return () => clearInterval(timerRef.current);
  }, [photos.length]);

  return (
    <div>
      <div style={{position:'relative',borderRadius:'4px',overflow:'hidden',border:'1px solid var(--border)',background:'#000814'}}>
        <div style={{position:'relative',paddingBottom:'56.25%',height:0,overflow:'hidden'}}>
          {photos.map((ph, i) => (
            <div key={i} style={{
              position:'absolute',top:0,left:0,width:'100%',height:'100%',
              opacity: i === cur ? 1 : 0,
              transition:'opacity 0.6s ease',
              zIndex: i === cur ? 2 : 1,
            }}>
              <PhotoPlaceholder label={ph.label} src={ph.src}/>
            </div>
          ))}
          <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:5,background:'linear-gradient(transparent,rgba(0,10,20,.92))',padding:'20px 16px 12px',pointerEvents:'none'}}>
            <div style={{fontFamily:'Share Tech Mono',fontSize:'13px',color:'var(--accent)',letterSpacing:'2px'}}>{photos[cur].tag}</div>
            {photos[cur].caption && <div style={{fontFamily:'Rajdhani',fontWeight:600,fontSize:'15px',color:'var(--text2)',marginTop:'3px'}}>{photos[cur].caption}</div>}
          </div>
          <div style={{position:'absolute',top:'12px',left:'12px',fontFamily:'Share Tech Mono',fontSize:'13px',color:'var(--accent2)',background:'rgba(0,10,20,.85)',padding:'5px 12px',border:'1px solid rgba(0,255,136,.35)',borderRadius:'3px',zIndex:6,letterSpacing:'2px',pointerEvents:'none'}}>
            {String(cur+1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')} — PHOTO
          </div>
        </div>
        <div style={{height:'2px',background:'rgba(0,255,255,.1)'}}>
          <div key={cur} style={{height:'100%',background:'linear-gradient(90deg,#0088ff,#00ffff,#00ff88)',animation:'videoProgress 3.5s linear forwards'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'8px',padding:'10px',background:'rgba(0,8,16,.6)'}}>
          {photos.map((_,i) => (
            <button key={i} onClick={()=>{ clearInterval(timerRef.current); setCur(i); timerRef.current=setInterval(()=>setCur(p=>(p+1)%photos.length),3500); }}
              style={{width:i===cur?'28px':'8px',height:'8px',borderRadius:'4px',background:i===cur?'var(--accent)':'rgba(0,255,255,.2)',border:'none',cursor:'pointer',transition:'all .3s',padding:0,boxShadow:i===cur?'0 0 8px var(--accent)':'none'}}/>
          ))}
        </div>
      </div>
    </div>
  );
};

const RailwayVideoPlaylist = ({ clips }) => {
  const [cur, setCur]           = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef  = useRef(null);
  const wrapRef   = useRef(null);
  const [started, setStarted]   = useState(false);

  useEffect(() => {
    if (!wrapRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.35 }
    );
    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    setVideoError(false);
    if (started && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [cur, started]);

  useEffect(() => {
    if (started && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [started]);

  const goNext = useCallback(() => {
    setVideoError(false);
    setCur(p => (p + 1) % clips.length);
  }, [clips.length]);

  const goTo = useCallback((idx) => {
    setVideoError(false);
    setCur(idx);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      try {
        const d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (d?.event === 'onStateChange' && d?.info === 0) goNext();
      } catch {}
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [goNext]);

  const current   = clips[cur];
  const hasLocal  = current.localSrc && current.localSrc.trim() !== '';
  const hasYT     = current.youtubeId && current.youtubeId.trim() !== '';
  const showPH    = (!hasLocal && !hasYT) || videoError;

  return (
    <div ref={wrapRef}>
      <div style={{position:'relative',paddingBottom:'56.25%',height:0,overflow:'hidden',borderRadius:'4px',border:'1px solid var(--border)',background:'#000814'}}>
        {hasLocal && !videoError && (
          <video key={`rv-${cur}`} ref={videoRef} src={current.localSrc}
            onEnded={goNext} onError={() => setVideoError(true)}
            autoPlay muted playsInline
            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'contain',background:'#000'}}/>
        )}
        {!hasLocal && hasYT && !videoError && (
          <iframe key={`ryt-${cur}`}
            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'}}
            src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&rel=0&enablejsapi=1&modestbranding=1&mute=1`}
            title={current.title} allow="autoplay; encrypted-media" allowFullScreen/>
        )}
        {showPH && (
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'16px'}}>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#000d1a,#001525)',zIndex:0}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(0,255,255,.04),transparent)',backgroundSize:'200%',animation:'shimmer 4s infinite',zIndex:1}}/>
            <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'rgba(0,255,255,.08)',border:'2px solid rgba(0,255,255,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px',color:'var(--accent)',animation:'pulse 2.5s infinite',zIndex:2,boxShadow:'0 0 30px var(--glow)'}}>▶</div>
            <div style={{fontFamily:'Share Tech Mono',fontSize:'13px',color:'var(--accent)',letterSpacing:'3px',zIndex:2,textAlign:'center',padding:'0 20px'}}>
              {videoError ? 'FILE NOT FOUND' : 'VIDEO PENDING'}
            </div>
            <div style={{fontFamily:'Rajdhani',fontWeight:600,fontSize:'18px',color:'var(--text2)',zIndex:2,textAlign:'center',padding:'0 24px',lineHeight:1.5}}>{current.title}</div>
            {videoError && <div style={{fontFamily:'Share Tech Mono',fontSize:'11px',color:'var(--text3)',zIndex:2,letterSpacing:'2px'}}>Place file at: {current.localSrc}</div>}
          </div>
        )}
        <div style={{position:'absolute',top:'12px',left:'12px',fontFamily:'Share Tech Mono',fontSize:'13px',color:'var(--accent2)',background:'rgba(0,10,20,.85)',padding:'5px 12px',border:'1px solid rgba(0,255,136,.35)',borderRadius:'3px',zIndex:10,letterSpacing:'2px',pointerEvents:'none',backdropFilter:'blur(6px)'}}>
          <span style={{animation:'blink 1.2s infinite',marginRight:'6px'}}>●</span>
          {String(cur+1).padStart(2,'0')} / {String(clips.length).padStart(2,'0')} — {current.tag}
        </div>
        {clips.length > 1 && (
          <>
            <button onClick={()=>goTo((cur-1+clips.length)%clips.length)}
              style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',background:'rgba(0,10,20,.75)',border:'1px solid rgba(0,255,255,.25)',color:'var(--accent)',width:'36px',height:'36px',borderRadius:'3px',cursor:'pointer',fontSize:'16px',zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(6px)',transition:'all .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,255,255,.15)';e.currentTarget.style.borderColor='var(--accent)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,10,20,.75)';e.currentTarget.style.borderColor='rgba(0,255,255,.25)';}}>‹</button>
            <button onClick={()=>goTo((cur+1)%clips.length)}
              style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'rgba(0,10,20,.75)',border:'1px solid rgba(0,255,255,.25)',color:'var(--accent)',width:'36px',height:'36px',borderRadius:'3px',cursor:'pointer',fontSize:'16px',zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(6px)',transition:'all .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,255,255,.15)';e.currentTarget.style.borderColor='var(--accent)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,10,20,.75)';e.currentTarget.style.borderColor='rgba(0,255,255,.25)';}}>›</button>
          </>
        )}
      </div>
      <div style={{display:'grid',gridTemplateColumns:`repeat(${clips.length},1fr)`,gap:'8px',marginTop:'12px'}}>
        {clips.map((c, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            background: i===cur ? 'rgba(0,255,255,.1)' : 'rgba(0,10,20,.6)',
            border: `1px solid ${i===cur ? 'var(--accent)' : 'rgba(0,255,255,.15)'}`,
            borderRadius:'3px', padding:'8px 6px', cursor:'pointer',
            transition:'all .25s',
            boxShadow: i===cur ? '0 0 12px rgba(0,255,255,.25)' : 'none',
          }}>
            <div style={{fontFamily:'Share Tech Mono',fontSize:'10px',color: i===cur ? 'var(--accent)' : 'var(--text3)',letterSpacing:'1.5px',marginBottom:'3px',textAlign:'center'}}>
              {i===cur && <span style={{animation:'blink 1s infinite',marginRight:'3px'}}>●</span>}
              {String(i+1).padStart(2,'0')}
            </div>
            <div style={{fontFamily:'Rajdhani',fontWeight:600,fontSize:'11px',color: i===cur ? 'var(--text)' : 'var(--text3)',textAlign:'center',lineHeight:1.3,letterSpacing:'.5px'}}>{c.tag}</div>
          </button>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'8px',marginTop:'10px'}}>
        {clips.map((_,i) => (
          <button key={i} onClick={()=>goTo(i)}
            style={{width:i===cur?'28px':'8px',height:'8px',borderRadius:'4px',background:i===cur?'var(--accent)':'rgba(0,255,255,.2)',border:'none',cursor:'pointer',transition:'all .3s',padding:0,boxShadow:i===cur?'0 0 8px var(--accent)':'none'}}/>
        ))}
      </div>
    </div>
  );
};

const VideoPlaylist = ({ clips }) => {
  const [cur, setCur] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const goNext = useCallback(() => { setVideoError(false); setCur(p => (p + 1) % clips.length); }, [clips.length]);
  const goPrev = useCallback(() => { setVideoError(false); setCur(p => (p - 1 + clips.length) % clips.length); }, [clips.length]);
  const goTo   = useCallback((idx) => { setVideoError(false); setCur(idx); }, []);

  useEffect(() => { setVideoError(false); }, [cur]);
  useEffect(() => {
    const handler = (e) => {
      try { const d = typeof e.data==='string'?JSON.parse(e.data):e.data; if(d?.event==='onStateChange'&&d?.info===0)goNext(); } catch {}
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [goNext]);

  const current   = clips[cur];
  const hasLocal  = current.localSrc  && current.localSrc.trim() !== '';
  const hasYoutube= current.youtubeId && current.youtubeId.trim() !== '';
  const showPH    = (!hasLocal && !hasYoutube) || videoError;

  return (
    <div>
      <div style={{position:'relative',paddingBottom:'56.25%',height:0,overflow:'hidden',borderRadius:'4px',border:'1px solid var(--border)',background:'#000814'}}>
        {hasLocal && !videoError && (
          <video key={`v-${cur}`} ref={videoRef} src={current.localSrc}
            onEnded={goNext} onError={() => setVideoError(true)}
            autoPlay muted playsInline
            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'contain',background:'#000'}}/>
        )}
        {!hasLocal && hasYoutube && !videoError && (
          <iframe key={`yt-${cur}`}
            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'}}
            src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&rel=0&enablejsapi=1&modestbranding=1&mute=1`}
            title={current.title} allow="autoplay; encrypted-media" allowFullScreen/>
        )}
        {showPH && (
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'16px'}}>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#000d1a,#001525)',zIndex:0}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(0,255,255,.04),transparent)',backgroundSize:'200%',animation:'shimmer 4s infinite',zIndex:1}}/>
            <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'rgba(0,255,255,.08)',border:'2px solid rgba(0,255,255,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px',color:'var(--accent)',animation:'pulse 2.5s infinite',zIndex:2,boxShadow:'0 0 30px var(--glow)'}}>▶</div>
            <div style={{fontFamily:'Share Tech Mono',fontSize:'13px',color:'var(--accent)',letterSpacing:'3px',zIndex:2,textAlign:'center',padding:'0 20px'}}>{videoError?'FILE NOT FOUND':'VIDEO PENDING'}</div>
            <div style={{fontFamily:'Rajdhani',fontWeight:600,fontSize:'18px',color:'var(--text2)',zIndex:2,textAlign:'center',padding:'0 24px',lineHeight:1.5}}>{current.title}</div>
          </div>
        )}
        <div style={{position:'absolute',top:'12px',left:'12px',fontFamily:'Share Tech Mono',fontSize:'13px',color:'var(--accent2)',background:'rgba(0,10,20,.85)',padding:'5px 12px',border:'1px solid rgba(0,255,136,.35)',borderRadius:'3px',zIndex:10,letterSpacing:'2px',pointerEvents:'none',backdropFilter:'blur(6px)'}}>
          <span style={{animation:'blink 1.2s infinite',marginRight:'6px'}}>●</span>
          {String(cur+1).padStart(2,'0')} / {String(clips.length).padStart(2,'0')} — {current.tag}
        </div>
        {clips.length>1&&(
          <>
            <button onClick={goPrev} style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',background:'rgba(0,10,20,.75)',border:'1px solid rgba(0,255,255,.25)',color:'var(--accent)',width:'36px',height:'36px',borderRadius:'3px',cursor:'pointer',fontSize:'16px',zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(6px)',transition:'all .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,255,255,.15)';e.currentTarget.style.borderColor='var(--accent)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,10,20,.75)';e.currentTarget.style.borderColor='rgba(0,255,255,.25)';}}>‹</button>
            <button onClick={goNext} style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'rgba(0,10,20,.75)',border:'1px solid rgba(0,255,255,.25)',color:'var(--accent)',width:'36px',height:'36px',borderRadius:'3px',cursor:'pointer',fontSize:'16px',zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(6px)',transition:'all .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,255,255,.15)';e.currentTarget.style.borderColor='var(--accent)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,10,20,.75)';e.currentTarget.style.borderColor='rgba(0,255,255,.25)';}}>›</button>
          </>
        )}
      </div>
      {clips.length>1&&(
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'8px',marginTop:'12px'}}>
          {clips.map((c,i)=>(
            <button key={i} onClick={()=>goTo(i)} title={c.title}
              style={{width:i===cur?'28px':'8px',height:'8px',borderRadius:'4px',background:i===cur?'var(--accent)':'rgba(0,255,255,.2)',border:'none',cursor:'pointer',transition:'all .3s',padding:0,boxShadow:i===cur?'0 0 8px var(--accent)':'none'}}/>
          ))}
        </div>
      )}
    </div>
  );
};

const GlitchText = ({ text, size, color='var(--text)' }) => (
  <div className="glitch-text" style={{position:'relative',display:'inline-block',fontFamily:'Orbitron',fontSize:size,fontWeight:900,color,letterSpacing:'6px',lineHeight:1.05}}>
    <span style={{position:'relative',zIndex:2}}>{text}</span>
    <span style={{position:'absolute',inset:0,color:'rgba(0,255,255,.7)',animation:'glitch1 5s infinite',zIndex:1,pointerEvents:'none'}}>{text}</span>
    <span style={{position:'absolute',inset:0,color:'rgba(0,255,136,.5)',animation:'glitch2 5s infinite',zIndex:1,pointerEvents:'none'}}>{text}</span>
  </div>
);

const IoTOrb = () => (
  <div style={{width:'100%',height:'100%',animation:'float 5s ease-in-out infinite'}}>
    <svg viewBox="0 0 300 300" style={{width:'100%',height:'100%'}}>
      <defs>
        <radialGradient id="og" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#00ffff" stopOpacity=".25"/><stop offset="60%" stopColor="#00ff88" stopOpacity=".06"/><stop offset="100%" stopColor="#00ffff" stopOpacity="0"/></radialGradient>
        <radialGradient id="cg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#00ffff"/></radialGradient>
        <filter id="gf"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="150" cy="150" r="148" fill="url(#og)"/>
      <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(0,255,255,.15)" strokeWidth="1" strokeDasharray="6,14" style={{animation:'rotateSlow 20s linear infinite',transformOrigin:'150px 150px'}}/>
      <circle cx="150" cy="150" r="104" fill="none" stroke="rgba(0,255,136,.25)" strokeWidth="1" strokeDasharray="3,9" style={{animation:'orbRing2 14s linear infinite',transformOrigin:'150px 150px'}}/>
      <circle cx="150" cy="150" r="76" fill="none" stroke="rgba(0,136,255,.4)" strokeWidth="1.5" strokeDasharray="2,6" style={{animation:'rotateSlow 8s linear infinite',transformOrigin:'150px 150px'}}/>
      <circle cx="150" cy="150" r="30" fill="url(#cg)" filter="url(#gf)" opacity=".9"/>
      <circle cx="150" cy="150" r="12" fill="#fff"/>
      {[0,40,80,120,160,200,240,280,320].map((a,i)=>{
        const r2=[130,104,76][i%3],rad=a*Math.PI/180;
        const colors=['#00ffff','#00ff88','#0088ff'];
        return <circle key={i} cx={150+Math.cos(rad)*r2} cy={150+Math.sin(rad)*r2} r={[5,4,3][i%3]} fill={colors[i%3]} filter="url(#gf)" style={{animation:`blink ${1.1+i*.28}s infinite`,animationDelay:`${i*.13}s`}}/>;
      })}
      {[0,90,180,270].map((a,i)=>{const rad=a*Math.PI/180;return <line key={i} x1="150" y1="150" x2={150+Math.cos(rad)*104} y2={150+Math.sin(rad)*104} stroke="rgba(0,255,255,.3)" strokeWidth=".8" strokeDasharray="4,7"/>;} )}
      <text x="150" y="222" textAnchor="middle" fill="rgba(0,255,255,.5)" fontSize="9" fontFamily="Share Tech Mono" letterSpacing="3">IoT.NODE.ACTIVE</text>
    </svg>
  </div>
);

const StatBox = ({ value, label, icon, color='var(--accent)', delay=0 }) => (
  <div className="card card-lift" style={{padding:'24px 16px',textAlign:'center',animation:'countUp .7s ease both',animationDelay:`${delay}ms`,position:'relative',overflow:'hidden'}}>
    <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:`linear-gradient(90deg,transparent,${color},transparent)`}}/>
    <div style={{fontSize:'24px',marginBottom:'8px'}}>{icon}</div>
    <div style={{fontFamily:'Orbitron',fontSize:'clamp(18px,3vw,34px)',fontWeight:900,color,textShadow:`0 0 20px ${color}`,marginBottom:'6px',animation:'textGlow 3s ease-in-out infinite'}}>{value}</div>
    <div style={{fontFamily:'Rajdhani',fontSize:'clamp(12px,1.8vw,25px)',color:'var(--text3)',letterSpacing:'3px',fontWeight:600,textTransform:'uppercase'}}>{label}</div>
  </div>
);

const AssocLogo = ({ initials, color='var(--accent)', size=72, imgSrc }) => (
  <div style={{
    width:size, height:size, flexShrink:0, borderRadius:'6px',
    background:'rgba(0,255,255,.06)', border:`1px solid ${color}44`,
    display:'flex', alignItems:'center', justifyContent:'center',
    boxShadow:`0 0 14px ${color}33`, overflow:'hidden',
  }}>
    {imgSrc
      ? <img src={imgSrc} alt={initials} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'5px'}}/>
      : <div style={{fontFamily:'Orbitron',fontSize:size*0.22,fontWeight:900,color,letterSpacing:'1px',textAlign:'center',lineHeight:1.1}}>{initials}</div>
    }
  </div>
);

const SkillBar = ({ name, level, delay=0 }) => {
  const [go,setGo] = useState(false);
  const ref = useRef();
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{if(e.isIntersecting)setGo(true);},{threshold:.4});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  return (
    <div ref={ref} style={{marginBottom:'24px'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
        <span style={{fontFamily:'Rajdhani',fontWeight:600,fontSize:'clamp(14px,2vw,25px)',color:'var(--text)',letterSpacing:'1px'}}>{name}</span>
        <span style={{fontFamily:'Share Tech Mono',fontSize:'clamp(12px,1.8vw,23px)',color:'var(--accent)'}}>{level}%</span>
      </div>
      <div style={{height:'3px',background:'rgba(0,255,255,.1)',borderRadius:'2px',overflow:'hidden'}}>
        <div style={{height:'100%',background:'linear-gradient(90deg,#0088ff,#00ffff,#00ff88)',borderRadius:'2px',width:go?`${level}%`:'0%',transition:`width 1.5s cubic-bezier(.4,0,.2,1) ${delay}ms`,boxShadow:go?'0 0 10px var(--accent)':'none'}}/>
      </div>
    </div>
  );
};

const Navbar = ({ active, setActive, onHomeClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const links = ['HOME','ABOUT','SKILLS','PROJECTS','VOLUNTEER','CONTACT'];

  const go = (id) => {
    setActive(id);
    setMobileOpen(false);
    if (id === 'HOME') onHomeClick();
    else document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className="navbar-inner" style={{
        position:'fixed',top:0,left:0,right:0,zIndex:1000,
        background:scrolled?'rgba(0,10,20,.96)':'transparent',
        backdropFilter:scrolled?'blur(20px)':'none',
        borderBottom:scrolled?'1px solid var(--border)':'none',
        padding:'0 60px',height:'68px',
        display:'flex',justifyContent:'space-between',alignItems:'center',
        transition:'all .4s'
      }}>
        <div className="navbar-logo" style={{fontFamily:'Orbitron',fontSize:'24px',fontWeight:900,color:'var(--accent)',letterSpacing:'4px',textShadow:'0 0 20px var(--accent)',animation:'textGlow 3s infinite'}}>
          SN<span style={{color:'var(--accent2)'}}>/</span>DEV
        </div>

        {!isMobile && (
          <div className="navbar-links" style={{display:'flex',gap:'30px'}}>
            {links.map(l=>(
              <button key={l} className={`nav-link${active===l?' active':''}`} onClick={()=>go(l)}>{l}</button>
            ))}
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setMobileOpen(p => !p)}
            style={{background:'none',border:'1px solid rgba(0,255,255,.3)',padding:'8px 10px',display:'flex',flexDirection:'column',gap:'5px',cursor:'pointer',borderRadius:'3px'}}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                width:'22px',height:'1px',background:'var(--accent)',
                boxShadow:'0 0 6px var(--accent)',display:'block',transition:'all .3s',
                transform: mobileOpen ? (i===0?'rotate(45deg) translate(4px,6px)':i===2?'rotate(-45deg) translate(4px,-6px)':'none') : 'none',
                opacity: mobileOpen && i===1 ? 0 : 1,
              }}/>
            ))}
          </button>
        )}

        <div className="navbar-version" style={{fontFamily:'Share Tech Mono',fontSize:'24px',color:'var(--accent)',opacity:.7,letterSpacing:'2px'}}>
          v2.6<span style={{animation:'blink 1s infinite',display:'inline-block'}}>_</span>
        </div>
      </nav>

      {isMobile && mobileOpen && (
        <div style={{
          position:'fixed',top:'68px',left:0,right:0,zIndex:999,
          background:'rgba(0,8,16,.97)',backdropFilter:'blur(20px)',
          borderBottom:'1px solid var(--border)',
        }}>
          {links.map(l => (
            <button key={l} onClick={() => go(l)} style={{
              display:'block',width:'100%',
              fontFamily:'Orbitron',fontSize:'12px',letterSpacing:'3px',
              border:'none',borderBottom:'1px solid rgba(0,255,255,.08)',
              color:active===l?'var(--accent)':'var(--text3)',
              padding:'16px 24px',textAlign:'left',
              textTransform:'uppercase',transition:'all .25s',cursor:'pointer',
              background:active===l?'rgba(0,255,255,.05)':'none',
            }}>
              {active===l && <span style={{color:'var(--accent)',marginRight:'8px'}}>▶</span>}
              {l}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default function Portfolio() {
  const [active,setActive]   = useState('HOME');
  const [typed,setTyped]     = useState('');
  const titles = ['IoT Engineer','Embedded Systems Dev','Project Lead','Robotics Association President'];
  const [ti,setTi]           = useState(0);
  const heroContentRef       = useRef(null);

  useEffect(()=>{
    let i=0, curr=titles[ti], iv;
    setTyped('');
    iv = setInterval(()=>{
      if(i<=curr.length){ setTyped(curr.slice(0,i)); i++; }
      else { clearInterval(iv); setTimeout(()=>setTi(p=>(p+1)%titles.length),1800); }
    },65);
    return()=>clearInterval(iv);
  },[ti]);

  const handleHomeClick  = () => heroContentRef.current?.scrollIntoView({behavior:'smooth'});
  const handleScrollDown = () => heroContentRef.current?.scrollIntoView({behavior:'smooth'});

  const heroPhotos = [
    {label:'Slideshow 1', src:`${BASE}slideshow/hero1.jpg`, tag:'◈ PROFILE',    caption:'Shanika Nadun — IoT Engineer & Embedded Systems Developer'},
    {label:'Slideshow 2', src:`${BASE}slideshow/hero2.jpg`, tag:'◈ SPORT',   caption:'400m Swimmer'},
    {label:'Slideshow 3', src:`${BASE}slideshow/hero3.jpg`, tag:'◈ PROJECT',    caption:'IoT Project Architecture & Deployment'},
    {label:'Slideshow 4', src:`${BASE}slideshow/hero4.jpg`, tag:'◈ LEADERSHIP', caption:'President — Robotic Society of Technology'},
    {label:'Slideshow 5', src:`${BASE}slideshow/hero5.jpg`, tag:'◈ ACHIEVEMENT',caption:'Current GPA Class - First Class Honours — Faculty of Technology'},
    {label:'Slideshow 6', src:`${BASE}slideshow/hero6.jpg`, tag:'◈ EXHIBITION', caption:'EXTRU 2025 — Faculty of Technology Exhibition'},
  ];

  const aboutVideos = [
    {localSrc:`${BASE}videos/landslide-demo.mp4`,  youtubeId:'', title:'IoT Landslide Risk Assessment Demo', tag:'PROJECT'},
    {localSrc:`${BASE}videos/railway-demo.mp4`,    youtubeId:'', title:'Railway Platform Safety System',    tag:'PROJECT'},
    {localSrc:`${BASE}videos/greenhouse-demo.mp4`, youtubeId:'', title:'Smart Greenhouse Automation Demo',  tag:'PROJECT'},
    {localSrc:`${BASE}videos/dustbin-demo.mp4`,    youtubeId:'', title:'Automated Dustbin Robotics Demo',   tag:'PROJECT'},
    {localSrc:`${BASE}videos/extru2025.mp4`,       youtubeId:'', title:'EXTRU 2025 Exhibition Highlight',   tag:'EVENT'},
  ];

  const skills = [
    {name:'C / C++ — Arduino & Embedded',   level:93},
    {name:'ESP32 / ESP8266 Development',     level:91},
    {name:'IoT System Architecture',         level:89},
    {name:'Firebase Integration',            level:87},
    {name:'Python — Flask & Embedded',       level:85},
    {name:'Embedded Prototyping & Testing',  level:90},
    {name:'JavaScript',                      level:74},
    {name:'Git & Version Control',           level:80},
  ];

  const projects = [
    {
      id:'landslide', year:'2026 — PRESENT', status:'ONGOING RESEARCH', isResearch:true,
      mediaType:'none',
      title:'IoT & ML-Based Landslide Risk Assessment System',
      role:'Project Lead & Principal Researcher',
      desc:'A cutting-edge IoT and Machine Learning system for real-time landslide risk prediction. Integrating distributed sensor networks with advanced ML algorithms for disaster prevention early warning.',
      details:['End-to-end IoT architecture with multi-node sensor deployment','Machine learning model integration for predictive risk analysis','Real-time data streaming via Firebase with cloud dashboard','ESP32-based sensor modules with power-efficient firmware','Technical documentation and research paper authoring'],
      tags:['IoT','Machine Learning','ESP32','Firebase','Python','Research'],
    },
    {
      id:'railway', year:'2025', status:'COMPLETED', isResearch:false,
      mediaType:'multi-video',
      title:'Automated Railway Platform Safety & Real-Time Tracking System',
      role:'Project Leader & IoT Developer',
      desc:'Comprehensive IoT solution ensuring railway platform safety through automated monitoring, GPS-based real-time tracking, and biometric secure access control with Flask backend and Firebase.',
      details:['Complete system architecture with distributed IoT sensor nodes','GPS-based real-time train tracking with sub-second latency','Firebase real-time database for live platform status','Flask REST API backend with secure authentication','Automated barrier and alarm systems via relay modules'],
      tags:['IoT','GPS','Firebase','Flask','Security','ESP32'],
      videos:[
        {localSrc:`${BASE}videos/railway/part1.mp4`, youtubeId:'', title:'System Overview',          tag:'OVERVIEW'},
        {localSrc:`${BASE}videos/railway/part2.mp4`, youtubeId:'', title:'GPS Tracking Demo',        tag:'GPS DEMO'},
        {localSrc:`${BASE}videos/railway/part3.mp4`, youtubeId:'', title:'Safety Barrier System',    tag:'SAFETY'},
        {localSrc:`${BASE}videos/railway/part4.mp4`, youtubeId:'', title:'Firebase Dashboard Live',  tag:'DASHBOARD'},
      ],
    },
    {
      id:'greenhouse', year:'2024', status:'COMPLETED', isResearch:false,
      mediaType:'photos',
      title:'Smart Greenhouse — Anytime Anywhere Mobile Control',
      role:'Project Leader & IoT Developer',
      desc:'Intelligent IoT-enabled greenhouse automation with sensor-driven climate monitoring and remote mobile control for precision agriculture with automated actuator management.',
      details:['Multi-parameter sensor fusion: temperature, humidity, soil moisture, light','Automated actuator control for irrigation, ventilation, LED grow lights','Mobile app interface for remote anywhere-anytime monitoring','Threshold-based alert system with push notifications','ESP8266 WiFi modules with low-power sleep cycles'],
      tags:['Arduino','Sensors','IoT','Automation','Mobile','ESP8266'],
      photos:[
        {src:`${BASE}images/greenhouse/gh1.jpg`, label:'Greenhouse 1', tag:'◈ SYSTEM',    caption:'Full Greenhouse Setup'},
        {src:`${BASE}images/greenhouse/gh2.jpg`, label:'Greenhouse 2', tag:'◈ SENSORS',   caption:'Sensor Array & Wiring'},
        {src:`${BASE}images/greenhouse/gh3.jpg`, label:'Greenhouse 3', tag:'◈ DASHBOARD', caption:'Mobile App Dashboard'},
      ],
    },
    {
      id:'dustbin', year:'2023', status:'COMPLETED', isResearch:false,
      mediaType:'photos',
      title:'Automated Dustbin with Human Following Capability',
      role:'Project Leader & IoT Developer',
      desc:'Autonomous smart dustbin featuring ultrasonic human detection, servo-driven lid automation, and mobile robot platform with follow-me navigation using advanced sensor fusion.',
      details:['Ultrasonic sensor array for 180° human detection coverage','Sensor fusion algorithm for reliable tracking accuracy','Servo-controlled automatic lid with proximity activation','DC motor drive system with obstacle avoidance','Arduino Mega controller with custom embedded firmware'],
      tags:['C++','Sensor Fusion','Arduino','Robotics','Embedded','Servo'],
      photos:[
        {src:`${BASE}images/dustbin/db1.jpg`, label:'Dustbin 1', tag:'◈ ROBOT',    caption:'Completed Robot Assembly'},
        {src:`${BASE}images/dustbin/db2.jpg`, label:'Dustbin 2', tag:'◈ SENSORS',  caption:'Ultrasonic Sensor Array'},
        {src:`${BASE}images/dustbin/db3.jpg`, label:'Dustbin 3', tag:'◈ IN ACTION',caption:'Human-Following Demo'},
      ],
    },
  ];

  const [activeProject,setActiveProject] = useState(null);
  const [openVol,setOpenVol]             = useState(null);

  const appointments = [
    {
      role:'President — Robotic Society of Technology', period:'2026 – Present',
      org:'Robotic Society of Technology',
      logo:{initials:'RST', color:'#00ffff', imgSrc:`${BASE}logos/rst-logo.png`},
      items:['Organized IoT & ESP32 hands-on workshop (Feb 2026)','Leading EXTRU 2026 exhibition projects','Conducted orientation program (Jan 2026)'],
    },
    {
      role:'Vice President — Robotic Society of Technology', period:'2025 – 2026',
      org:'Robotic Society of Technology',
      logo:{initials:'RST', color:'#00ffff', imgSrc:`${BASE}logos/rst-logo.png`},
      items:['Project manager for EXTRU 2025 exhibition'],
    },
    {
      role:'Project Leader — Career Guidance Unit Web Portal', period:'2025 – Present',
      org:'Career Guidance Unit',
      logo:{initials:'CGU', color:'#00ff88', imgSrc:`${BASE}logos/cgu-logo.png`},
      items:['Project planning, task allocation, team collaboration'],
    },
    {
      role:'Project Leader — Cinnamon Blockchain Project', period:'2025 – 2026',
      org:'Cinnamon Blockchain',
      logo:{initials:'CBC', color:'#f5c842', imgSrc:`${BASE}logos/cbc-logo.png`},
      items:['Team coordination and full project documentation'],
    },
    {
      role:'Project Mentor — EXTRU 2025 (ATIT Association)', period:'2025',
      org:'ATIT Association',
      logo:{initials:'ATIT', color:'#a78bfa', imgSrc:`${BASE}logos/atit-logo.png`},
      items:['Guided team in technical development and problem solving'],
    },
    {
      role:'English Announcer — Faculty Opening Ceremony', period:'2025',
      org:'Faculty of Technology',
      logo:{initials:'FOT', color:'#60d8f5', imgSrc:`${BASE}logos/fot-logo.png`},
      items:['Professional English-medium compering for official opening'],
    },
  ];

  const edu = [
    {title:'Bachelor of ICT (Hons.) — CGPA : First Class', sub:'Rajarata University of Sri Lanka', period:'2022 – Present', note:''},
    {title:'Introduction to DevOps Tools Course',   sub:'SimpliLearn',                      period:'2026',           note:'Certified'},
    {title:'G.C.E Advanced Level',                  sub:'Badulla Central College',           period:'2017 – 2020',    note:''},
  ];

  const volunteerEvents = [
    {
      id:'usbus', year:'2026', title:'USBus American Space Leadership Program',
      org:'Career Guidance Unit, Rajarata University of Sri Lanka',
      role:'Participant — Student Leader',
      desc:'Participated in the prestigious American Space Leadership Program.',
      highlights:['Space science and technology exposure sessions','Leadership development workshops and activities','Networking with inter-university student leaders','Career guidance from industry experts'],
      photos:[
        {src:`${BASE}events/usbus/usbus1.jpg`, label:'USBus 1', tag:'EVENT',      caption:'USBus Space Leadership 2026'},
        {src:`${BASE}events/usbus/usbus2.jpg`, label:'USBus 2', tag:'WORKSHOP',   caption:'Leadership Development Session'},
        {src:`${BASE}events/usbus/usbus3.jpg`, label:'USBus 3', tag:'ACTIVITY',   caption:'Collaborative Workshop'},
        {src:`${BASE}events/usbus/usbus4.jpg`, label:'USBus 4', tag:'ACHIEVEMENT',caption:'Program Completion'},
      ],
    },
    {
      id:'newyear', year:'2025', title:'Compering — New Year Celebration',
      org:'Faculty of Technology, Rajarata University of Sri Lanka',
      role:'Announcer & MC',
      desc:"MC for the Faculty's annual New Year celebration.",
      highlights:['Professional compering throughout','Coordinated 10+ performances and program segments','Bilingual event management (English & Sinhala)','Audience of 300+ faculty members and students'],
      photos:[
        {src:`${BASE}events/newyear/ny1.jpg`, label:'NY 1', tag:'COMPERING',  caption:'Hosting New Year 2025'},
        {src:`${BASE}events/newyear/ny2.jpg`, label:'NY 2', tag:'EVENT',      caption:'Faculty New Year Celebration'},
        {src:`${BASE}events/newyear/ny3.jpg`, label:'NY 3', tag:'PERFORMANCE',caption:'Cultural Event'},
        {src:`${BASE}events/newyear/ny4.jpg`, label:'NY 4', tag:'CEREMONY',   caption:'Closing Ceremony'},
      ],
    },
    {
      id:'techno', year:'2025', title:'Project Showcase — KEY of TECHNO EXHIBITION',
      org:'Diwlankadawala President College',
      role:'Project Presenter & IoT Demonstrator',
      desc:'Showcased IoT projects to school students at KEY of TECHNO EXHIBITION.',
      highlights:['Live IoT project demos to school students','Interactive Q&A on embedded systems and IoT','Inspired STEM interest among secondary students','Hands-on ESP32 and Arduino demonstrations'],
      photos:[
        {src:`${BASE}events/techno/techno1.jpg`, label:'Techno 1', tag:'SHOWCASE',    caption:'KEY of TECHNO Exhibition'},
        {src:`${BASE}events/techno/techno2.jpg`, label:'Techno 2', tag:'DEMO',        caption:'IoT Demo for Students'},
        {src:`${BASE}events/techno/techno3.jpg`, label:'Techno 3', tag:'INTERACTIVE', caption:'Q&A Session'},
        {src:`${BASE}events/techno/techno4.jpg`, label:'Techno 4', tag:'EVENT',       caption:'Exhibition Overview'},
      ],
    },
    {
      id:'socialsci', year:'2025', title:'Project Showcase — Faculty of Social Sciences & Humanities',
      org:'Faculty of Social Sciences & Humanities, Rajarata University of Sri Lanka',
      role:'Project Presenter',
      desc:'Presented IoT and embedded systems projects at a cross-faculty showcase.',
      highlights:['Cross-faculty technology showcase presentation','Demonstrated social impact of IoT applications','Engaged non-technical audience on embedded systems','Bridged technology and humanities perspectives'],
      photos:[
        {src:`${BASE}events/socialsci/ss1.jpg`, label:'SS 1', tag:'SHOWCASE',     caption:'Social Sciences Showcase 2025'},
        {src:`${BASE}events/socialsci/ss2.jpg`, label:'SS 2', tag:'PRESENTATION', caption:'Project Demonstration'},
        {src:`${BASE}events/socialsci/ss3.jpg`, label:'SS 3', tag:'AUDIENCE',     caption:'Cross-Faculty Engagement'},
        {src:`${BASE}events/socialsci/ss4.jpg`, label:'SS 4', tag:'DISPLAY',      caption:'Project Display Board'},
      ],
    },
    {
      id:'degree', year:'2023 – 2025', title:'Degree Program Introduction Sessions',
      org:'Student Union & ATIT Association, Faculty of Technology, Rajarata University',
      role:'Student Guide & Program Ambassador',
      desc:'Participated in degree program introduction sessions across three consecutive years.',
      highlights:['Orientation sessions 3 consecutive years (2023–2025)','Guided 200+ new students on academic pathways','Promoted ATIT Association membership','Shared IoT and embedded systems career insights'],
      photos:[
        {src:`${BASE}events/degree/deg1.jpg`, label:'Deg 1', tag:'ORIENTATION', caption:'Degree Program Intro 2025'},
        {src:`${BASE}events/degree/deg2.jpg`, label:'Deg 2', tag:'GUIDANCE',    caption:'Guiding New Students'},
        {src:`${BASE}events/degree/deg3.jpg`, label:'Deg 3', tag:'PANEL',       caption:'Academic Discussion Panel'},
        {src:`${BASE}events/degree/deg4.jpg`, label:'Deg 4', tag:'ATIT',        caption:'ATIT Association'},
      ],
    },
    {
      id:'robotic', year:'2026', title:'Robotic Workshop 2k26',
      org:'Robotic Society of Technology, Faculty of Technology, Rajarata University',
      role:'Workshop Organizer & Lead Instructor',
      desc:'Organized and conducted a comprehensive hands-on IoT and ESP32 robotics workshop as President.',
      highlights:['Designed full workshop curriculum from scratch','Taught ESP32 programming and IoT to 30+ participants','Hands-on sensor interfacing and actuator labs','Firebase real-time database integration exercises'],
      photos:[],
    },
    {
      id:'extru', year:'2024 – 2025', title:'EXTRU Exhibition Projects',
      org:'Faculty of Technology, Rajarata University of Sri Lanka',
      role:'Project Manager (2025) & Volunteer Organizer (2024)',
      desc:'Key roles in two EXTRU exhibitions. 2025: Project Manager. 2024: Volunteer organizer.',
      highlights:['2025: Project manager for 8+ student project teams','Coordinated exhibition logistics and technical setup','Mentored junior students on presentation skills','2024: Volunteer organizer for operations'],
      photos:[
        {src:`${BASE}events/extru/extru1.jpg`, label:'EXTRU 1', tag:'EXTRU 2025', caption:'Exhibition Hall'},
        {src:`${BASE}events/extru/extru2.jpg`, label:'EXTRU 2', tag:'PROJECT',    caption:'Student Demos'},
        {src:`${BASE}events/extru/extru3.jpg`, label:'EXTRU 3', tag:'TEAM',       caption:'Management Team'},
        {src:`${BASE}events/extru/extru4.jpg`, label:'EXTRU 4', tag:'VISITORS',   caption:'Visitor Engagement'},
        {src:`${BASE}events/extru/extru5.jpg`, label:'EXTRU 5', tag:'AWARDS',     caption:'Award Ceremony'},
      ],
    },
    {
      id:'roundtable', year:'2024', title:'Round Table Discussion Project Showcase',
      org:'New Faculty Opening Committee, Faculty of Technology, Rajarata University',
      role:'Project Presenter & Discussion Participant',
      desc:'Presented IoT projects at the Round Table Discussion for the new faculty opening.',
      highlights:['Presented to academics and industry professionals','Round table discussions on IoT future in Sri Lanka','Demonstrated embedded systems to faculty leadership','Networked with industry representatives'],
      photos:[
        {src:`${BASE}events/roundtable/rt1.jpg`, label:'RT 1', tag:'DISCUSSION',  caption:'Round Table Forum'},
        {src:`${BASE}events/roundtable/rt2.jpg`, label:'RT 2', tag:'PRESENTATION',caption:'IoT Presentation'},
        {src:`${BASE}events/roundtable/rt3.jpg`, label:'RT 3', tag:'PANEL',       caption:'Expert Panel'},
        {src:`${BASE}events/roundtable/rt4.jpg`, label:'RT 4', tag:'NETWORKING',  caption:'Post-Discussion'},
      ],
    },
    {
      id:'school', year:'2024', title:'Project Showcase for School Students',
      org:'Faculty of Technology, Rajarata University of Sri Lanka',
      role:'Project Demonstrator & STEM Promoter',
      desc:'Dedicated project showcase for secondary school students introducing IoT concepts.',
      highlights:['Hands-on IoT and robotics demos for school students','Introduced Arduino and sensor concepts','Encouraged STEM and university technology programs','Interactive sessions fostering engineering curiosity'],
      photos:[],
    },
    {
      id:'sipmansala', year:'2021 – 2025', title:'"Sipmansala" Program',
      org:'Student Union, Faculty of Technology, Rajarata University of Sri Lanka',
      role:'Volunteer — Community Service Member',
      desc:'Four-year volunteer commitment to community service repairing infrastructure at under-resourced schools.',
      highlights:['4-year commitment to school infrastructure improvement','Repairing facilities at difficult rural schools','Combined technical skills with community values','Collaborative work with student union volunteers'],
      photos:[],
    },
  ];

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const sectionPad = isMobile ? '50px 18px' : isTablet ? '60px 30px' : '90px 60px';
  const maxW = '1400px';

  return (
    <div style={{minHeight:'100vh',width:'100%',background:'var(--bg)',color:'var(--text)',overflowX:'hidden',position:'relative'}}>
      <style>{CSS}</style>
      <TitleInjector/>
      <FuturisticCursor/>
      <CircuitBg/>
      <Particles/>
      <Navbar active={active} setActive={setActive} onHomeClick={handleHomeClick}/>

      <div style={{width:'100%',height:'100vh',position:'relative',zIndex:2,overflow:'hidden'}}>
        <HeroSlideshow photos={heroPhotos}/>
        <div onClick={handleScrollDown} style={{position:'absolute',bottom:'38px',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',cursor:'pointer',zIndex:20}}>
          <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(11px,2vw,23px)',color:'var(--accent)',letterSpacing:'5px',textShadow:'0 0 12px var(--accent)',animation:'textGlow 3s ease-in-out infinite'}}>SCROLL DOWN</div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',animation:'float 2.2s ease-in-out infinite'}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{width:'22px',height:'11px',borderLeft:`2px solid rgba(0,255,255,${.28+i*.24})`,borderBottom:`2px solid rgba(0,255,255,${.28+i*.24})`,transform:'rotate(-45deg)',marginTop:i===0?'0':'-5px',animation:'blink 1.5s ease-in-out infinite',animationDelay:`${i*0.2}s`}}/>
            ))}
          </div>
        </div>
      </div>

      <section id="home" ref={heroContentRef} style={{width:'100%',minHeight:'100vh',display:'flex',alignItems:'center',padding: isMobile?'80px 18px 60px': isTablet?'90px 30px 70px':'100px 80px 80px',position:'relative',zIndex:2}}>
        <div className="hero-grid" style={{
          display:'grid',
          gridTemplateColumns: isMobile||isTablet ? '1fr' : '1fr 400px',
          gap: isMobile?'32px':isTablet?'40px':'80px',
          alignItems:'center',width:'100%',maxWidth:'1300px',margin:'0 auto'
        }}>
          <div>
            <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(11px,1.5vw,23px)',color:'var(--accent2)',letterSpacing:'4px',marginBottom:'24px',animation:'heroSlideUp .7s ease both',animationDelay:'100ms'}}>
              &gt; ENGINEER_PROFILE.INIT <span style={{animation:'blink 1s infinite'}}>_</span>
            </div>
            <div style={{animation:'heroSlideUp .7s ease both',animationDelay:'200ms',marginBottom:'6px'}}>
              <GlitchText text="SHANIKA" size="clamp(36px,6.8vw,100px)"/>
            </div>
            <div style={{animation:'heroSlideUp .7s ease both',animationDelay:'320ms',marginBottom:'30px'}}>
              <GlitchText text="NADUN" size="clamp(36px,6.8vw,100px)" color="var(--accent)"/>
            </div>
            <div className="neon-line" style={{marginBottom:'24px',animation:'fadeIn .7s ease both',animationDelay:'400ms'}}/>
            <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(13px,2vw,24px)',color:'var(--text)',letterSpacing:'2px',minHeight:'34px',marginBottom:'14px',animation:'heroSlideUp .7s ease both',animationDelay:'480ms'}}>
              <span style={{color:'var(--accent)'}}>&gt;</span> {typed}<span style={{animation:'blink .7s infinite',color:'var(--accent)'}}>|</span>
            </div>
            <div style={{fontFamily:'Rajdhani',fontSize:'clamp(11px,1.6vw,25px)',color:'var(--text3)',letterSpacing:'4px',marginBottom:'46px',fontWeight:600,animation:'heroSlideUp .7s ease both',animationDelay:'560ms'}}>
              BICT (hons.) · FACULTY OF TECHNOLOGY · RAJARATA UNIVERSITY OF SRI LANKA
            </div>
            <div className="hero-cta-row" style={{display:'flex',alignItems:'center',gap:'36px',marginBottom:'38px',animation:'heroSlideUp .7s ease both',animationDelay:'640ms',flexWrap:'wrap'}}>
              <div style={{width:isMobile?'90px':'140px',height:isMobile?'90px':'140px',flexShrink:0}}><IoTOrb/></div>
              <div className="hero-btns" style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                <button className="btn-primary" onClick={()=>{setActive('PROJECTS');document.getElementById('projects')?.scrollIntoView({behavior:'smooth'});}}>
                  <span>VIEW PROJECTS</span>
                </button>
                <button className="btn-outline" onClick={()=>{setActive('CONTACT');document.getElementById('contact')?.scrollIntoView({behavior:'smooth'});}}>
                  CONNECT NOW
                </button>
              </div>
            </div>
            <div className="hero-links" style={{display:'flex',gap:'28px',animation:'heroSlideUp .7s ease both',animationDelay:'720ms',flexWrap:'wrap'}}>
              {[{label:'LinkedIn',icon:'◈',href:'https://www.linkedin.com/in/shanika-nadun-62386231a'},{label:'GitHub',icon:'◉',href:'https://github.com/shanika119'},{label:'075 855 2179',icon:'◆',href:'tel:0758552179'}].map(({label,icon,href})=>(
                <a key={label} href={href} style={{fontFamily:'Share Tech Mono',fontSize:'clamp(11px,1.5vw,25px)',color:'var(--text3)',textDecoration:'none',letterSpacing:'1px',display:'flex',alignItems:'center',gap:'7px',transition:'color .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>
                  <span style={{color:'var(--accent)'}}>{icon}</span>{label}
                </a>
              ))}
            </div>
          </div>

          {!isMobile && (
            <div className="hero-profile-col" style={{height: isTablet?'340px':'480px', width: isTablet?'340px':'auto', margin: isTablet?'0 auto':'0', animation:'profileReveal .9s cubic-bezier(.22,1,.36,1) both',animationDelay:'300ms'}}>
              <ProfilePhoto/>
            </div>
          )}
          {isMobile && (
            <div style={{height:'260px',width:'260px',margin:'0 auto',animation:'profileReveal .9s cubic-bezier(.22,1,.36,1) both',animationDelay:'300ms'}}>
              <ProfilePhoto/>
            </div>
          )}
        </div>
      </section>

      <section style={{padding: isMobile?'30px 16px':isTablet?'40px 30px':'50px 60px',position:'relative',zIndex:2,background:'rgba(0,0,0,.3)'}}>
        <div className="stats-grid" style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':isTablet?'repeat(3,1fr)':'repeat(5,1fr)',gap:'14px',maxWidth:'1400px',margin:'0 auto'}}>
          <StatBox value="4+"  label="IoT Projects"      icon="⬡"  color="#00ffff" delay={0}/>
          <StatBox value="A+"  label="IoT Course"        icon="◈"  color="#00ff88" delay={80}/>
          <StatBox value="First Class" label="CGPA Class"     icon="◉"  color="#0088ff" delay={160}/>
          <StatBox value="7+"  label="Leader Roles"      icon="◆"  color="#a78bfa" delay={240}/>
          <StatBox value="10+" label="Acknowledgements"  icon="🏆" color="#f5c842" delay={320}/>
        </div>
      </section>

      <section id="about" style={{padding:sectionPad,position:'relative',zIndex:2}}>
        <div style={{maxWidth:maxW,margin:'0 auto'}}>
          <div className="section-tag">&gt; SYS.PROFILE // ABOUT_ME</div>
          <h2 className="section-title" style={{fontSize:'clamp(20px,3vw,40px)'}}>ABOUT <span style={{color:'var(--accent)',textShadow:'0 0 20px var(--accent)'}}>ME</span></h2>
          <div className="about-grid" style={{display:'grid',gridTemplateColumns:isMobile||isTablet?'1fr':'1.1fr 1fr',gap:isMobile?'32px':isTablet?'40px':'60px',alignItems:'start'}}>
            <div>
              <p style={{fontFamily:'Rajdhani',fontSize:'clamp(15px,1.8vw,24px)',color:'var(--text2)',lineHeight:1.9,marginBottom:'18px'}}>
                I'm an undergraduate at the Faculty of Technology, Rajarata University of Sri Lanka, with a deep focus on{' '}
                <span style={{color:'var(--accent)',fontWeight:700,textShadow:'0 0 8px var(--accent)'}}>IoT systems</span> and{' '}
                <span style={{color:'var(--accent2)',fontWeight:700,textShadow:'0 0 8px var(--accent2)'}}>Embedded Engineering</span>.
                I build smart hardware-software solutions from concept to deployment.
              </p>
              <p style={{fontFamily:'Rajdhani',fontSize:'clamp(15px,1.8vw,24px)',color:'var(--text2)',lineHeight:1.9,marginBottom:'18px'}}>
                Leading complex IoT projects — from sensor networks to cloud backends — I bridge hardware intelligence with software elegance. As{' '}
                <span style={{color:'var(--accent)',fontWeight:700}}>President of the Robotic Society of Technology</span>, I lead workshops, organize exhibitions, and mentor engineers.
              </p>
              <p style={{fontFamily:'Rajdhani',fontSize:'clamp(15px,1.8vw,24px)',color:'var(--text2)',lineHeight:1.9,marginBottom:'30px'}}>
                Also an English-medium announcer and association leader, combining deep technical skill with communication and project management excellence. Actively seeking an IT internship.
              </p>
              <div className="about-info-grid" style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'10px',marginBottom:'28px'}}>
                {[
                  {label:'FULL NAME',   value:'Shanika Nadun Samarakkodi', icon:'◉'},
                  {label:'D.O.B',       value:'01 February 2002',          icon:'◈'},
                  {label:'NATIONALITY', value:'Sri Lankan',                 icon:'◆'},
                  {label:'DEGREE',      value:'BICT (Hons) — 1st Class',   icon:'⬡'},
                  {label:'LANGUAGES',   value:'Sinhala · English · German', icon:'▶'},
                  {label:'SPORTS',      value:'Swimming · Chess',           icon:'◇'},
                ].map(({label,value,icon})=>(
                  <div key={label} className="card" style={{padding:'14px'}}>
                    <div style={{fontSize:'25px',color:'var(--accent)',marginBottom:'5px'}}>{icon}</div>
                    <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(10px,1.4vw,24px)',color:'var(--text3)',letterSpacing:'2px',marginBottom:'4px'}}>{label}</div>
                    <div style={{fontFamily:'Rajdhani',fontWeight:600,fontSize:'clamp(13px,1.6vw,24px)',color:'var(--text)'}}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(12px,1.6vw,25px)',color:'var(--accent2)',letterSpacing:'3px',marginBottom:'14px'}}>&gt; EDUCATION.LOG</div>
              {edu.map(({title,sub,period,note})=>(
                <div key={title} style={{marginBottom:'11px',padding:'14px 17px',background:'rgba(0,18,32,.6)',border:'1px solid var(--border)',borderLeft:'3px solid var(--accent)',borderRadius:'3px'}}>
                  <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(10px,1.3vw,24px)',color:'var(--accent)',marginBottom:'4px'}}>{period}</div>
                  <div style={{fontFamily:'Rajdhani',fontWeight:700,fontSize:'clamp(13px,1.5vw,23px)',color:'var(--text)',marginBottom:'2px'}}>{title}</div>
                  <div style={{fontFamily:'Rajdhani',fontSize:'clamp(12px,1.4vw,24px)',color:'var(--text3)'}}>{sub}{note&&<span style={{color:'var(--accent2)',marginLeft:'10px'}}>· {note}</span>}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(12px,1.6vw,25px)',color:'var(--accent)',letterSpacing:'3px',marginBottom:'14px'}}>&gt; MEDIA.SHOWCASE //</div>
              <VideoPlaylist clips={aboutVideos}/>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" style={{padding:sectionPad,background:'rgba(0,0,0,.25)',position:'relative',zIndex:2}}>
        <div style={{maxWidth:maxW,margin:'0 auto'}}>
          <div className="section-tag">&gt; CAPABILITY.MATRIX // TECH_STACK</div>
          <h2 className="section-title" style={{fontSize:'clamp(20px,3vw,40px)'}}>TECHNICAL <span style={{color:'var(--accent)',textShadow:'0 0 20px var(--accent)'}}>SKILLS</span></h2>
          <div className="skills-grid" style={{display:'grid',gridTemplateColumns:isMobile||isTablet?'1fr':'1fr 1fr',gap:isMobile||isTablet?'0':'50px 80px',marginBottom:'48px'}}>
            <div>{skills.slice(0,4).map((s,i)=><SkillBar key={s.name} {...s} delay={i*150}/>)}</div>
            <div>{skills.slice(4).map((s,i)=><SkillBar key={s.name} {...s} delay={i*150+600}/>)}</div>
          </div>
          <div className="skills-tags" style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':isTablet?'repeat(3,1fr)':'repeat(5,1fr)',gap:'10px'}}>
            {['IoT Systems','ESP32 / ESP8266','Arduino IDE','Firebase','Flask / Python','Sensor Fusion','Git & GitHub','JavaScript','DevOps Tools','Project Mgmt'].map((tag,i)=>(
              <div key={tag} className="card card-lift" style={{padding:'16px',textAlign:'center',fontFamily:'Orbitron',fontSize:'clamp(10px,1.2vw,24px)',letterSpacing:'2px',color:['#00ffff','#00ff88','#0088ff','#a78bfa','#f5c842'][i%5],cursor:'default',borderColor:[`rgba(0,255,255,.2)`,`rgba(0,255,136,.2)`,`rgba(0,136,255,.2)`,`rgba(167,139,250,.2)`,`rgba(245,200,66,.2)`][i%5]}}>{tag}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" style={{padding:sectionPad,position:'relative',zIndex:2}}>
        <div style={{maxWidth:maxW,margin:'0 auto'}}>
          <div className="section-tag">&gt; PROJECT.REGISTRY // DEPLOYED_SYSTEMS</div>
          <h2 className="section-title" style={{fontSize:'clamp(20px,3vw,40px)'}}>FEATURED <span style={{color:'var(--accent)',textShadow:'0 0 20px var(--accent)'}}>PROJECTS</span></h2>
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            {projects.map((p,idx)=>{
              const isOpen = activeProject===p.id;
              return (
                <div key={p.id} className="card" style={{overflow:'hidden',animation:'fadeUp .6s ease both',animationDelay:`${idx*100}ms`,borderColor:isOpen?'var(--accent)':'var(--border)',boxShadow:isOpen?'0 0 30px rgba(0,255,255,.1)':'none'}}>
                  <div
                    className="project-header"
                    data-cursor="view-more"
                    onClick={()=>setActiveProject(isOpen?null:p.id)}
                    style={{padding:isMobile?'16px':'26px 30px',cursor:'pointer',display:'flex',gap:'18px',alignItems:'flex-start',userSelect:'none'}}
                  >
                    <div style={{flex:1}}>
                      <div style={{display:'flex',gap:'10px',marginBottom:'10px',alignItems:'center',flexWrap:'wrap'}}>
                        <span style={{fontFamily:'Share Tech Mono',fontSize:'clamp(11px,1.4vw,25px)',color:'var(--accent)',letterSpacing:'2px'}}>{p.year}</span>
                        <span style={{fontFamily:'Orbitron',fontSize:'clamp(10px,1.2vw,24px)',color:p.status==='ONGOING RESEARCH'?'#f5c842':'#4df5a0',border:`1px solid ${p.status==='ONGOING RESEARCH'?'rgba(245,200,66,.4)':'rgba(77,245,160,.4)'}`,padding:'3px 8px',letterSpacing:'2px'}}>{p.status}</span>
                        {p.isResearch&&<span style={{fontFamily:'Orbitron',fontSize:'clamp(10px,1.2vw,24px)',color:'#a78bfa',border:'1px solid rgba(167,139,250,.4)',padding:'3px 8px',letterSpacing:'2px'}}>RESEARCH</span>}
                      </div>
                      <h3 style={{fontFamily:'Orbitron',fontSize:'clamp(13px,1.7vw,20px)',fontWeight:700,color:'var(--text)',letterSpacing:'1.5px',lineHeight:1.6,marginBottom:'8px'}}>{p.title}</h3>
                      <div style={{fontFamily:'Rajdhani',fontSize:'clamp(13px,1.5vw,23px)',color:'var(--accent2)',letterSpacing:'1px',marginBottom:'8px'}}>Role: {p.role}</div>
                      <p style={{fontFamily:'Rajdhani',fontSize:'clamp(13px,1.5vw,23px)',color:'var(--text2)',lineHeight:1.7}}>{p.desc}</p>
                    </div>
                    <div style={{flexShrink:0,width:'36px',height:'36px',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--accent)',fontSize:'25px',transition:'transform .3s',transform:isOpen?'rotate(45deg)':'rotate(0deg)',boxShadow:isOpen?'0 0 12px var(--accent)':'none'}}>+</div>
                  </div>

                  {isOpen&&(
                    <div style={{padding: isMobile?'0 16px 20px':'0 30px 30px',borderTop:'1px solid var(--border)',paddingTop:'26px',animation:'fadeUp .4s ease both'}}>
                      <div className="project-body-grid" style={{display:'grid',gridTemplateColumns: (isMobile||isTablet)||p.mediaType==='none' ? '1fr' : '1fr 1fr',gap:'32px'}}>
                        <div>
                          <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(11px,1.4vw,25px)',color:'var(--accent)',letterSpacing:'3px',marginBottom:'16px'}}>&gt; IMPLEMENTATION.DETAILS</div>
                          {p.details.map((d,i)=>(
                            <div key={i} style={{display:'flex',gap:'10px',marginBottom:'11px',padding:'12px 14px',background:'rgba(0,255,255,.03)',borderRadius:'3px',borderLeft:'2px solid rgba(0,255,255,.3)'}}>
                              <span style={{color:'var(--accent)',fontSize:'25px',flexShrink:0}}>▶</span>
                              <span style={{fontFamily:'Rajdhani',fontSize:'clamp(13px,1.5vw,25px)',color:'var(--text2)',lineHeight:1.6}}>{d}</span>
                            </div>
                          ))}
                          <div style={{display:'flex',flexWrap:'wrap',gap:'7px',marginTop:'18px'}}>
                            {p.tags.map(t=><span key={t} className="tag-chip">{t}</span>)}
                          </div>
                        </div>
                        {p.mediaType !== 'none' && (
                          <div>
                            {p.mediaType==='multi-video' && <RailwayVideoPlaylist clips={p.videos}/>}
                            {p.mediaType==='photos' && <ProjectPhotoSlideshow photos={p.photos}/>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="leadership" className="leadership-section" style={{padding:sectionPad,background:'rgba(0,0,0,.25)',position:'relative',zIndex:2}}>
        <div style={{maxWidth:maxW,margin:'0 auto'}}>
          <div className="section-tag">&gt; LEADERSHIP.LOG // PROFESSIONAL_ROLES</div>
          <h2 className="section-title" style={{fontSize:'clamp(20px,3vw,40px)'}}>LEADERSHIP & <span style={{color:'var(--accent)',textShadow:'0 0 20px var(--accent)'}}>ROLES</span></h2>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:'20px',top:0,bottom:0,width:'1px',background:'linear-gradient(180deg,var(--accent),var(--accent2),rgba(0,255,255,.05))'}}/>
            {appointments.map(({role,period,items,logo,org},i)=>(
              <div key={role} style={{paddingLeft: isMobile?'44px':'60px',marginBottom:'20px',position:'relative',animation:'fadeUp .5s ease both',animationDelay:`${i*80}ms`}}>
                <div style={{width:'14px',height:'14px',borderRadius:'50%',background:'var(--bg)',border:`2px solid ${logo.color}`,position:'absolute',left:'13px',top:'18px',boxShadow:`0 0 12px ${logo.color}`}}/>
                <div className="card assoc-card" style={{padding:'20px 24px',display:'flex',gap:'18px',alignItems:'flex-start',borderColor:`${logo.color}22`,flexWrap:isMobile?'wrap':'nowrap'}}>
                  <AssocLogo initials={logo.initials} color={logo.color} size={isMobile?44:52} imgSrc={logo.imgSrc}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'4px',flexWrap:'wrap',gap:'8px'}}>
                      <div style={{fontFamily:'Rajdhani',fontSize:'clamp(12px,1.5vw,25px)',color:'var(--text3)',letterSpacing:'1px'}}>{org}</div>
                      <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(10px,1.3vw,24px)',color:logo.color,letterSpacing:'2px'}}>{period}</div>
                    </div>
                    <div style={{fontFamily:'Orbitron',fontSize:'clamp(12px,1.5vw,18px)',fontWeight:700,color:'var(--text)',letterSpacing:'1.5px',marginBottom:'10px',lineHeight:1.5}}>{role}</div>
                    {items.map(item=>(
                      <div key={item} style={{fontFamily:'Rajdhani',fontSize:'clamp(12px,1.5vw,25px)',color:'var(--text2)',display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                        <span style={{color:logo.color,fontSize:'24px'}}>▶</span>{item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="volunteer" style={{padding:sectionPad,position:'relative',zIndex:2}}>
        <div style={{maxWidth:maxW,margin:'0 auto'}}>
          <div className="section-tag">&gt; VOLUNTEER.LOG // COMMUNITY_SERVICE</div>
          <h2 className="section-title" style={{fontSize:'clamp(20px,3vw,40px)'}}>VOLUNTEER & <span style={{color:'var(--accent2)',textShadow:'0 0 20px var(--accent2)'}}>EVENTS</span></h2>
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {volunteerEvents.map((ev,idx)=>{
              const isOpen = openVol===ev.id;
              const colors = ['#00ffff','#00ff88','#0088ff','#a78bfa','#f5c842','#60d8f5','#ff6b35','#00ffff','#00ff88','#a78bfa'];
              const col = colors[idx%colors.length];
              return (
                <div key={ev.id} className="card" style={{overflow:'hidden',animation:'fadeUp .5s ease both',animationDelay:`${idx*50}ms`,borderColor:isOpen?col:'var(--border)',boxShadow:isOpen?`0 0 25px ${col}22`:'none'}}>
                  <div
                    className="vol-header"
                    data-cursor="view-more"
                    onClick={()=>setOpenVol(isOpen?null:ev.id)}
                    style={{padding:isMobile?'14px 16px':'22px 26px',cursor:'pointer',display:'flex',gap:'16px',alignItems:'flex-start',userSelect:'none'}}
                  >
                    <div style={{flex:1}}>
                      <div className="vol-header-row" style={{display:'flex',gap:'10px',marginBottom:'7px',alignItems:'center',flexWrap:'wrap'}}>
                        <span style={{fontFamily:'Share Tech Mono',fontSize:'clamp(11px,1.4vw,24px)',color:col,letterSpacing:'2px'}}>{ev.year}</span>
                        <span style={{fontFamily:'Orbitron',fontSize:'clamp(10px,1.2vw,23px)',color:col,border:`1px solid ${col}44`,padding:'3px 8px',letterSpacing:'2px'}}>VOLUNTEER</span>
                      </div>
                      <h3 style={{fontFamily:'Orbitron',fontSize:'clamp(12px,1.5vw,18px)',fontWeight:700,color:'var(--text)',letterSpacing:'1.5px',lineHeight:1.6,marginBottom:'4px'}}>{ev.title}</h3>
                      <div style={{fontFamily:'Rajdhani',fontSize:'clamp(12px,1.5vw,25px)',color:'var(--text3)',marginBottom:'3px'}}>{ev.org}</div>
                      <div style={{fontFamily:'Rajdhani',fontSize:'clamp(12px,1.5vw,25px)',color:col}}>Role: {ev.role}</div>
                    </div>
                    <div style={{flexShrink:0,width:'32px',height:'32px',border:`1px solid ${col}55`,display:'flex',alignItems:'center',justifyContent:'center',color:col,fontSize:'24px',transition:'transform .3s',transform:isOpen?'rotate(45deg)':'rotate(0deg)',boxShadow:isOpen?`0 0 10px ${col}44`:'none'}}>+</div>
                  </div>
                  {isOpen&&(
                    <div style={{padding:isMobile?'0 16px 20px':'0 26px 26px',borderTop:`1px solid ${col}22`,paddingTop:'22px',animation:'fadeUp .4s ease both'}}>
                      <div className="vol-body-grid" style={{display:'grid',gridTemplateColumns: (isMobile||isTablet)||ev.photos.length===0 ? '1fr' : '1fr 1fr',gap:'24px'}}>
                        <div>
                          <p style={{fontFamily:'Rajdhani',fontSize:'clamp(13px,1.5vw,23px)',color:'var(--text2)',lineHeight:1.8,marginBottom:'16px'}}>{ev.desc}</p>
                          <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(11px,1.4vw,24px)',color:col,letterSpacing:'3px',marginBottom:'12px'}}>&gt; KEY HIGHLIGHTS</div>
                          {ev.highlights.map((h,i)=>(
                            <div key={i} style={{display:'flex',gap:'9px',marginBottom:'9px',padding:'10px 13px',background:'rgba(0,255,255,.03)',borderRadius:'3px',borderLeft:`2px solid ${col}44`}}>
                              <span style={{color:col,fontSize:'24px',flexShrink:0}}>◆</span>
                              <span style={{fontFamily:'Rajdhani',fontSize:'clamp(12px,1.4vw,24px)',color:'var(--text2)',lineHeight:1.6}}>{h}</span>
                            </div>
                          ))}
                        </div>
                        {ev.photos.length>0&&(
                          <div>
                            <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(11px,1.4vw,24px)',color:col,letterSpacing:'3px',marginBottom:'12px'}}>&gt; EVENT.GALLERY</div>
                            <PhotoSlideshow photos={ev.photos} height={isMobile?'220px':'360px'}/>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="contact-wrap" style={{padding:sectionPad,background:'rgba(0,0,0,.25)',position:'relative',zIndex:2}}>
        <div style={{maxWidth:'860px',margin:'0 auto',textAlign:'center'}}>
          <div className="section-tag" style={{textAlign:'center'}}>&gt; OPEN.CONNECTION // GET_IN_TOUCH</div>
          <h2 className="section-title" style={{fontSize:'clamp(20px,3vw,40px)',textAlign:'center'}}>CONTACT <span style={{color:'var(--accent)',textShadow:'0 0 20px var(--accent)'}}>ME</span></h2>
          <p style={{fontFamily:'Rajdhani',fontSize:'clamp(14px,1.8vw,25px)',color:'var(--text2)',marginBottom:'44px',lineHeight:1.8}}>
            Open to IT internship opportunities, IoT collaborations, and embedded systems projects.<br/>
            Let's build something intelligent together.
          </p>
          <div className="contact-cards" style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:'14px',marginBottom:'34px'}}>
            {[
              {icon:'📱',label:'PHONE',    value:'075 855 2179',           color:'#00ffff'},
              {icon:'✉', label:'EMAIL',    value:'shanika.nadun@gmail.com', color:'#00ff88'},
              {icon:'📍',label:'LOCATION', value:'Badulla, Sri Lanka',      color:'#0088ff'},
            ].map(({icon,label,value,color})=>(
              <div key={label} className="card card-lift" style={{padding:'28px 16px',textAlign:'center',borderColor:`${color}22`,position:'relative'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:`linear-gradient(90deg,transparent,${color},transparent)`}}/>
                <div style={{fontSize:'28px',marginBottom:'10px'}}>{icon}</div>
                <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(11px,1.4vw,24px)',color,letterSpacing:'3px',marginBottom:'8px'}}>{label}</div>
                <div style={{fontFamily:'Rajdhani',fontWeight:600,fontSize:'clamp(13px,1.6vw,25px)',color:'var(--text)'}}>{value}</div>
              </div>
            ))}
          </div>
          <div className="contact-buttons" style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap',alignItems:'center'}}>
            <a href="https://www.linkedin.com/in/shanika-nadun-62386231a" target="_blank" rel="noopener noreferrer" className="btn-primary"><span>LINKEDIN</span></a>
            <a href="https://github.com/shanika119" target="_blank" rel="noopener noreferrer" className="btn-outline">GITHUB</a>
            <a href="https://drive.google.com/file/d/19QIF-MyfmFYm8eTqvYNXY6F-FfBzroA-/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn-cv">
              <span style={{fontSize:'23px',lineHeight:1}}>⬇</span>
              <span>DOWNLOAD CV</span>
            </a>
          </div>
          <div style={{marginTop:'18px',fontFamily:'Share Tech Mono',fontSize:'clamp(11px,1.4vw,24px)',color:'rgba(245,200,66,.45)',letterSpacing:'2px'}}>
            &gt;
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner" style={{padding: isMobile?'20px 18px':'24px 60px',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',position:'relative',zIndex:2,flexWrap:'wrap',gap:'10px',flexDirection:isMobile?'column':'row',textAlign:isMobile?'center':'left'}}>
          <div style={{fontFamily:'Orbitron',fontSize:'clamp(14px,1.6vw,24px)',fontWeight:900,color:'var(--accent)',textShadow:'0 0 15px var(--accent)'}}>SN/DEV</div>
          <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(10px,1.2vw,25px)',color:'var(--text3)',letterSpacing:'2px'}}>SHANIKA NADUN SAMARAKKODI © 2026</div>
          <div style={{fontFamily:'Share Tech Mono',fontSize:'clamp(10px,1.2vw,25px)',color:'rgba(0,255,255,.35)',letterSpacing:'2px'}}>SYSTEM.ONLINE <span style={{animation:'blink 1.2s infinite'}}>■</span></div>
        </div>
      </footer>
    </div>
  );
}