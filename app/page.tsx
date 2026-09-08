'use client';

import { useMemo, useState, type FormEvent } from 'react';

type Project = {
  category: string;
  client: string;
  title: string;
  description: string;
  image: string;
  accent: string;
};

const filters = ['All', 'Brand', 'Campaign', 'Content'];

const projects: Project[] = [
  {
    category: 'Campaign',
    client: 'Visual storytelling',
    title: 'Make the moment impossible to scroll past.',
    description: 'A launch system built around a clear narrative, a sharp visual world, and content that travels.',
    image: '/assets/hero-camera.png',
    accent: 'red',
  },
  {
    category: 'Brand',
    client: 'Digital experience',
    title: 'Turn a first impression into a lasting one.',
    description: 'A digital identity that makes the value obvious before the pitch even begins.',
    image: '/assets/work-laptop.png',
    accent: 'cream',
  },
  {
    category: 'Content',
    client: 'Always-on content',
    title: 'Build a content engine with a point of view.',
    description: 'From the first frame to the final cut, we make every piece earn its place in the feed.',
    image: '/assets/agency-page.png',
    accent: 'grey',
  },
];

const services = [
  {
    number: '01',
    title: 'Brand & strategy',
    text: 'Positioning, identity, and campaign thinking that give your brand a clear lane to own.',
    tags: ['Brand positioning', 'Visual identity', 'Campaign platforms'],
  },
  {
    number: '02',
    title: 'Creative & content',
    text: 'Big ideas translated into social, film, photography, and design that people remember.',
    tags: ['Creative direction', 'Social content', 'Art direction'],
  },
  {
    number: '03',
    title: 'Media & growth',
    text: 'A performance mindset across paid, organic, and digital so attention turns into momentum.',
    tags: ['Media planning', 'Performance creative', 'Growth systems'],
  },
];

const processSteps = [
  ['01', 'Find the signal', 'We get close to the business, the audience, and the opportunity before the first idea lands.'],
  ['02', 'Shape the story', 'We turn the sharpest insight into a creative direction that can stretch across every touchpoint.'],
  ['03', 'Make it move', 'We produce, launch, learn, and keep the work moving until it is doing its job in the real world.'],
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const visibleProjects = useMemo(
    () => (activeFilter === 'All' ? projects : projects.filter((project) => project.category === activeFilter)),
    [activeFilter],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main className="site-shell">
      <header className="site-nav">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="UFirst home">
          <span className="brand-glyph">U</span>
          <span>FIRST</span>
        </a>

        <nav className={menuOpen ? 'nav-links nav-links-open' : 'nav-links'} aria-label="Primary navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#process" onClick={closeMenu}>Process</a>
        </nav>

        <a className="nav-cta" href="#contact">Start a project <span>↗</span></a>
        <button className="nav-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span />
          <span />
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-backdrop" aria-hidden="true" />
        <div className="hero-noise" aria-hidden="true" />
        <div className="section-shell hero-content">
          <div className="eyebrow"><span className="eyebrow-dot" /> Cairo / MENA · Full-service agency</div>
          <div className="hero-copy-wrap">
            <div>
              <h1>Make your next <span>bold move.</span></h1>
              <p className="hero-copy">UFirst is the creative partner for brands that want more than attention. We make strategy, story, and production move as one.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#contact">Start a project <span>↗</span></a>
                <a className="text-link" href="#work"><span className="play-disc">▶</span> See the work</a>
              </div>
            </div>
            <div className="hero-note">
              <span className="hero-note-index">01 / 04</span>
              <p>Strategy first.<br />Impact always.</p>
            </div>
          </div>
          <div className="hero-footer">
            <span>Scroll to explore</span>
            <span className="scroll-line" />
            <span className="hero-footer-right">Creative / Production / Growth</span>
          </div>
        </div>
      </section>

      <div className="marquee" aria-label="UFirst capabilities">
        <div className="marquee-track">
          {['Brand strategy', 'Creative direction', 'Film & content', 'Digital experiences', 'Media & growth', 'Brand strategy', 'Creative direction', 'Film & content', 'Digital experiences', 'Media & growth'].map((item, index) => (
            <span key={`${item}-${index}`}>{item} <b>✦</b></span>
          ))}
        </div>
      </div>

      <section className="section section-dark pattern-section" id="about">
        <div className="section-shell">
          <div className="section-kicker"><span>01</span> About UFirst</div>
          <div className="about-grid">
            <div>
              <h2>Make the work <em>matter.</em></h2>
              <p className="lead-copy">We are a full-service marketing and media production agency based in Cairo, Egypt. We help ambitious brands find their voice, tell better stories, and create growth that can be felt.</p>
              <a className="arrow-link" href="#services">See what we do <span>↗</span></a>
            </div>
            <div className="about-frame">
              <img src="/assets/agency-page.png" alt="UFirst agency landing page concept" />
              <div className="frame-caption"><span>UFirst / 2026</span><span>Built to perform</span></div>
            </div>
          </div>
          <div className="stat-row">
            <div><strong>01</strong><span>Strategic point of view</span></div>
            <div><strong>02</strong><span>Creative that travels</span></div>
            <div><strong>03</strong><span>Production without friction</span></div>
            <div><strong>∞</strong><span>Room to grow</span></div>
          </div>
        </div>
      </section>

      <section className="section section-light" id="services">
        <div className="section-shell">
          <div className="section-kicker section-kicker-light"><span>02</span> What we do</div>
          <div className="services-heading">
            <h2>One sharp team.<br /><em>Every angle covered.</em></h2>
            <p>When the strategy, creative, and execution live under one roof, the work moves faster — and lands harder.</p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <div className="service-topline"><span>{service.number}</span><span className="service-arrow">↗</span></div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <ul>
                  {service.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark work-section" id="work">
        <div className="section-shell">
          <div className="work-heading">
            <div>
              <div className="section-kicker"><span>03</span> Selected work</div>
              <h2>Built for the <em>real world.</em></h2>
            </div>
            <p>Not just work that looks good in a deck. Work that earns attention, changes perception, and gives people a reason to choose you.</p>
          </div>
          <div className="filter-row" role="tablist" aria-label="Filter selected work">
            {filters.map((filter) => (
              <button className={activeFilter === filter ? 'filter-button filter-active' : 'filter-button'} key={filter} type="button" onClick={() => setActiveFilter(filter)} role="tab" aria-selected={activeFilter === filter}>{filter}</button>
            ))}
          </div>
          <div className="project-grid">
            {visibleProjects.map((project, index) => (
              <article className={`project-card project-${index + 1}`} key={project.title}>
                <div className={`project-image project-image-${project.accent}`}>
                  <img src={project.image} alt="" />
                  <span className="project-open">↗</span>
                </div>
                <div className="project-meta"><span>{project.category}</span><span>{project.client}</span></div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cream" id="process">
        <div className="section-shell">
          <div className="section-kicker section-kicker-light"><span>04</span> How we move</div>
          <div className="process-heading"><h2>Less theatre.<br /><em>More traction.</em></h2><p>Our process is simple enough to keep momentum, rigorous enough to protect the idea, and flexible enough for the real world.</p></div>
          <div className="process-list">
            {processSteps.map(([number, title, text]) => (
              <div className="process-step" key={number}>
                <span className="process-number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="process-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="statement-band">
        <div className="section-shell statement-inner"><span className="statement-mark">✦</span><p>Good work gets noticed.<br /><strong>Great work gets remembered.</strong></p><span className="statement-mark">✦</span></div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="section-shell contact-grid">
          <div>
            <div className="section-kicker"><span>05</span> Start a conversation</div>
            <h2>Got a good one?<br /><em>Let&apos;s make it real.</em></h2>
            <p className="contact-copy">Tell us what you are building, where it needs to go, and what is getting in the way. We will take it from there.</p>
            <div className="contact-details"><a href="mailto:hello@ufirst.agency">hello@ufirst.agency ↗</a><span>Cairo, Egypt · Working globally</span></div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted ? (
              <div className="form-success"><span>✦</span><h3>Message received.</h3><p>We&apos;ll be in touch shortly to set up the right first conversation.</p><button className="button button-outline" type="button" onClick={() => setSubmitted(false)}>Send another</button></div>
            ) : (
              <>
                <label>Name<input name="name" placeholder="Your name" required /></label>
                <label>Work email<input name="email" type="email" placeholder="you@company.com" required /></label>
                <label>What are you building?<textarea name="message" placeholder="A launch, a new identity, a content engine..." rows={4} required /></label>
                <button className="button button-primary button-submit" type="submit">Send the brief <span>↗</span></button>
              </>
            )}
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-shell footer-top"><a className="brand footer-brand" href="#top"><span className="brand-glyph">U</span><span>FIRST</span></a><p>Designed to perform.</p><a className="back-top" href="#top">Back to top ↑</a></div>
        <div className="section-shell footer-bottom"><span>© 2026 UFirst Agency</span><span>Strategy / Story / Scale</span><span>Cairo · Egypt</span></div>
      </footer>
    </main>
  );
}
