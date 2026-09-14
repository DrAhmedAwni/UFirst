'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import dynamic from 'next/dynamic';
import type { SiteContent } from '@/app/content';

const CinematicExperience = dynamic(() => import('./cinematic/CinematicExperience'), {
  ssr: false,
  loading: () => null,
});

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const counterRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 900, 1);
        setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.45 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [target]);

  return <strong ref={counterRef}>{value}{suffix}</strong>;
}

export default function HomeExperience({ content }: { content: SiteContent }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [careerSubmitted, setCareerSubmitted] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const filters = ['All', ...Array.from(new Set(content.projects.map((project) => project.category)))];
  const visibleProjects = useMemo(
    () => activeFilter === 'All' ? content.projects : content.projects.filter((project) => project.category === activeFilter),
    [activeFilter, content.projects],
  );

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0);
      document.documentElement.classList.toggle('is-scrolled', window.scrollY > 24);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.documentElement.classList.remove('is-scrolled');
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const onMove = (event: PointerEvent) => {
      root.style.setProperty('--cursor-x', `${event.clientX}px`);
      root.style.setProperty('--cursor-y', `${event.clientY}px`);
      root.classList.add('has-pointer');
    };
    const onLeave = () => root.classList.remove('has-pointer');
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      root.classList.remove('has-pointer');
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function handleCareerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCareerSubmitted(true);
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="site-shell" data-experience="ufirst-photo-journey-v1" style={{ '--pattern-image': `url('${content.backgrounds.pattern.src}')` } as CSSProperties}>
      <div className="cursor-glow" aria-hidden="true" />
      <header className="site-nav">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="UFirst home"><span className="brand-glyph">U</span><span>FIRST</span></a>
        <nav id="primary-navigation" className={menuOpen ? 'nav-links nav-links-open' : 'nav-links'} aria-label="Primary navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#system" onClick={closeMenu}>The system</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#process" onClick={closeMenu}>Process</a>
          <a href="#careers" onClick={closeMenu}>Careers</a>
        </nav>
        <a className="nav-cta" href="#contact">Start a project <span>↗</span></a>
        <button className="nav-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label="Toggle menu" onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
      </header>

      <CinematicExperience content={content} paused={motionPaused} onPausedChange={setMotionPaused} />

      <div className="marquee" aria-label="UFirst capabilities"><div className="marquee-track">{['Brand strategy', 'Creative direction', 'Film & content', 'Digital experiences', 'Media & growth', 'Brand strategy', 'Creative direction', 'Film & content', 'Digital experiences', 'Media & growth'].map((item, index) => <span key={`${item}-${index}`}>{item} <b>✦</b></span>)}</div></div>

      <section className="section section-dark system-overview" id="system">
        <div className="section-shell system-overview-grid"><div className="system-story-copy" data-reveal="up"><div className="section-kicker"><span>02</span> The UFirst system</div><h2>{content.system.headline}<br /><em>{content.system.emphasis}</em></h2><p className="lead-copy">{content.system.body}</p><div className="system-story-legend"><span><i className="legend-dot legend-red" /> Signal</span><span><i className="legend-dot legend-teal" /> Connection</span><span><i className="legend-dot legend-cream" /> Momentum</span></div></div><div className="system-overview-panel system-photo-panel" data-reveal="zoom"><span className="system-panel-label">One connected production world</span><img src={content.system.dashboard.src} alt={content.system.dashboard.alt} /><p>Strategy, creative, production, digital, and growth working as one physical system.</p></div></div>
      </section>

      <section className="section section-dark pattern-section" id="about"><div className="section-shell"><div className="section-kicker" data-reveal="up"><span>03</span> {content.about.eyebrow.replace(/^\d+\s*\/\s*/, '')}</div><div className="about-grid" data-reveal="left"><div><h2>{content.about.headline} <em>{content.about.emphasis}</em></h2><p className="lead-copy">{content.about.body}</p><a className="arrow-link" href="#services">See what we do <span>↗</span></a></div><div className="about-frame"><img src={content.about.image.src} alt={content.about.image.alt} /><div className="frame-caption"><span>UFirst / 2026</span><span>Built to perform</span></div></div></div><div className="stat-row" data-reveal="stagger">{[{ target: 360, suffix: '°', label: 'Integrated thinking' }, { target: content.services.length, suffix: '+', label: 'Core capabilities' }, { target: 1, suffix: '', label: 'Team from brief to launch' }, { target: 24, suffix: '/7', label: 'Ideas in motion' }].map((stat) => <div key={stat.label}><CountUp target={stat.target} suffix={stat.suffix} /><span>{stat.label}</span></div>)}</div><div className="industry-strip" data-reveal="stagger"><span className="profile-card-label">Built for different sectors</span><div className="industry-pills">{content.industries.map((industry) => <span key={industry}>{industry}</span>)}</div></div></div></section>

      <section className="section section-light" id="services"><div className="section-shell"><div className="section-kicker section-kicker-light" data-reveal="up"><span>04</span> What we do</div><div className="services-heading" data-reveal="up"><div><h2>One sharp team.<br /><em>Every angle covered.</em></h2></div><p>When strategy, creative, and execution live under one roof, the work moves faster — and lands harder.</p></div><div className="service-journey-note" data-reveal="zoom"><span>Seen inside the UFirst world</span><strong>{content.services[activeService].number} / {content.services[activeService].title}</strong><p>Select a capability below to explore the work behind the journey.</p></div><div className="service-chapters" data-reveal="stagger"><div className="service-selector">{content.services.map((service, index) => <button key={service.number} type="button" className={activeService === index ? 'service-selector-item service-selector-active' : 'service-selector-item'} onClick={() => setActiveService(index)}><span>{service.number}</span>{service.title}<i>↗</i></button>)}</div><div className="service-feature"><div className="service-feature-image"><img src={content.services[activeService].image.src} alt={content.services[activeService].image.alt} /><div className="service-feature-overlay">SERVICE / {content.services[activeService].number}</div></div><div className="service-feature-copy"><span className="service-number">{content.services[activeService].number}</span><h3>{content.services[activeService].title}</h3><p>{content.services[activeService].text}</p><ul>{content.services[activeService].tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div></div></div></div></section>

      <section className="section section-dark work-section" id="work"><div className="section-shell"><div className="work-heading" data-reveal="up"><div><div className="section-kicker"><span>05</span> Selected work</div><h2>Built for the <em>real world.</em></h2></div><p>Not just work that looks good in a deck. Work that earns attention, changes perception, and gives people a reason to choose you.</p></div><div className="filter-row" data-reveal="up" role="tablist" aria-label="Filter selected work">{filters.map((filter) => <button className={activeFilter === filter ? 'filter-button filter-active' : 'filter-button'} key={filter} type="button" onClick={() => setActiveFilter(filter)} role="tab" aria-selected={activeFilter === filter}>{filter}</button>)}</div><div className="project-grid" data-reveal="stagger">{visibleProjects.map((project, index) => <article className={`project-card project-${index + 1}`} key={project.title}><div className="project-image"><img src={project.image.src} alt={project.image.alt} /><span className="project-open">↗</span></div><div className="project-meta"><span>{project.category}</span><span>{project.client}</span></div><h3>{project.title}</h3><p>{project.description}</p></article>)}</div></div></section>

      <section className="section section-cream" id="process"><div className="section-shell"><div className="section-kicker section-kicker-light" data-reveal="up"><span>06</span> How we move</div><div className="process-heading" data-reveal="up"><h2>Less theatre.<br /><em>More traction.</em></h2><p>Simple enough to keep momentum, rigorous enough to protect the idea, and flexible enough for the real world.</p></div><div className="process-manifesto" data-reveal="zoom"><span>Discover → Define → Create → Launch → Optimize</span><strong>From first signal to measured momentum.</strong></div><div className="process-list" data-reveal="stagger">{content.process.map((step) => <div className="process-step" key={step.number}><span className="process-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p><span className="process-line" /></div>)}</div></div></section>

      <section className="section section-dark why-section" id="why"><div className="section-shell"><div className="section-kicker" data-reveal="up"><span>07</span> Why UFirst</div><div className="why-heading" data-reveal="up"><h2>Built to be your <em>unfair advantage.</em></h2><p>One connected team, one clear direction, and the production capability to carry the idea all the way through.</p></div><div className="why-grid" data-reveal="stagger">{[['Results-driven approach', 'Clear objectives and measurable outcomes in every strategy, campaign, and creative solution.'], ['Creative & strategic thinking', 'Creative ideas grounded in planning, business goals, and meaningful audience connections.'], ['In-house production', 'Integrated production capabilities that keep quality, consistency, and execution moving together.'], ['Dedicated partnership', 'Clear communication, tailored solutions, and long-term thinking from the first brief onward.']].map(([title, text], index) => <article className="why-card" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="statement-band"><div className="section-shell statement-inner" data-reveal="zoom"><span className="statement-mark">✦</span><p>Good work gets noticed.<br /><strong>Great work gets remembered.</strong></p><span className="statement-mark">✦</span></div></section>

      <section className="section section-dark finale-section" aria-label="UFirst creative system finale"><div className="section-shell finale-grid"><div><p className="section-kicker">One team. Every dimension.</p><h2>All the pieces.<br /><em>One bold move.</em></h2><a className="button button-primary" href="#contact">Let’s build yours <span>↗</span></a></div><div className="finale-photo" aria-hidden="true"><img src={content.services.at(-1)?.image.src ?? content.hero.background.src} alt="" /></div></div></section>

      <section className="section contact-section" id="contact"><div className="section-shell contact-grid" data-reveal="up"><div><div className="section-kicker"><span>08</span> {content.contact.eyebrow.replace(/^\d+\s*\/\s*/, '')}</div><h2>{content.contact.headline}<br /><em>{content.contact.emphasis}</em></h2><p className="contact-copy">{content.contact.body}</p><div className="contact-details"><a href={`mailto:${content.brand.email}`}>{content.brand.email} ↗</a><span>{content.brand.location}</span></div></div><form className="contact-form" onSubmit={handleSubmit}>{submitted ? <div className="form-success"><span>✦</span><h3>Message received.</h3><p>We&apos;ll be in touch shortly to set up the right first conversation.</p><button className="button button-outline" type="button" onClick={() => setSubmitted(false)}>Send another</button></div> : <><label>Name<input name="name" placeholder="Your name" required /></label><label>Work email<input name="email" type="email" placeholder="you@company.com" required /></label><label>What are you building?<textarea name="message" placeholder="A launch, a new identity, a content engine..." rows={4} required /></label><button className="button button-primary button-submit" type="submit">Send the brief <span>↗</span></button></>}</form></div></section>

      <section className="section careers-section" id="careers"><div className="section-shell careers-grid" data-reveal="up"><div className="careers-copy"><div className="section-kicker"><span>09</span> Join the team</div><h2>Bring your <em>point of view.</em></h2><p>We are always looking for thoughtful strategists, creative minds, makers, and people who care about getting the details right.</p><a className="button button-primary career-cta" href="#career-form">Join the team <span>↗</span></a><div className="career-meta"><span>UFirst / People</span><span>Designed to perform.</span></div></div><div className="career-form-wrap" id="career-form">{careerSubmitted ? <div className="form-success career-success"><span>✦</span><h3>Application captured.</h3><p>Your details are ready for the UFirst team. The company inbox and CV upload endpoint will be connected in the next step.</p><button className="button button-outline" type="button" onClick={() => setCareerSubmitted(false)}>Submit another</button></div> : <form className="contact-form career-form" onSubmit={handleCareerSubmit}><div className="form-field-grid"><label>Full name<input name="fullName" placeholder="Your name" required /></label><label>Age<input name="age" type="number" inputMode="numeric" placeholder="Your age" required /></label><label>Email<input name="careerEmail" type="email" placeholder="you@email.com" required /></label><label>Phone number<input name="phone" type="tel" placeholder="+20 ..." required /></label><label>WhatsApp number<input name="whatsapp" type="tel" placeholder="+20 ..." required /></label><label>Expected salary<input name="salary" placeholder="Monthly expectation" required /></label></div><label>Upload your CV<input name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required /></label><p className="form-note">Your application will be routed to the company email once the backend connection is added.</p><button className="button button-primary button-submit" type="submit">Send application <span>↗</span></button></form>}</div></div></section>

      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
      <footer className="site-footer"><div className="section-shell footer-top"><a className="brand footer-brand" href="#top"><span className="brand-glyph">U</span><span>FIRST</span></a><p>{content.brand.tagline}</p><a className="back-top" href="#top">Back to top ↑</a></div><div className="section-shell footer-bottom"><span>© 2026 UFirst Agency</span><span>Strategy / Story / Scale</span><span>Cairo · Egypt</span></div></footer>
    </main>
  );
}
