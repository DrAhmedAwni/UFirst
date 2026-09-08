'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react';

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
    image: '/assets/hero-camera.jpg',
    accent: 'red',
  },
  {
    category: 'Brand',
    client: 'Digital experience',
    title: 'Turn a first impression into a lasting one.',
    description: 'A digital identity that makes the value obvious before the pitch even begins.',
    image: '/assets/work-laptop.jpg',
    accent: 'cream',
  },
  {
    category: 'Content',
    client: 'Always-on content',
    title: 'Build a content engine with a point of view.',
    description: 'From the first frame to the final cut, we make every piece earn its place in the feed.',
    image: '/assets/agency-page.jpg',
    accent: 'grey',
  },
];

const services = [
  {
    number: '01',
    title: 'Brand & strategy',
    text: 'Positioning, identity, and campaign thinking that give your brand a clear lane to own.',
    tags: ['Marketing strategy', 'Brand positioning', 'Launch strategy'],
  },
  {
    number: '02',
    title: 'Creative & content',
    text: 'Big ideas translated into social, film, photography, and design that people remember.',
    tags: ['Creative direction', 'Copywriting', 'Content planning'],
  },
  {
    number: '03',
    title: 'Media production',
    text: 'Film, photography, editing, motion, and post-production that make the idea feel real.',
    tags: ['Commercial video', 'Product photography', 'Podcast production'],
  },
  {
    number: '04',
    title: 'Social & digital',
    text: 'Platform-native content and digital launches that keep your brand in the conversation.',
    tags: ['Social management', 'Community', 'Performance marketing'],
  },
  {
    number: '05',
    title: 'Growth & performance',
    text: 'A performance mindset across paid, organic, and digital so attention turns into momentum.',
    tags: ['Market research', 'Campaign management', 'Growth planning'],
  },
];

const profilePrinciples = [
  ['Results-driven approach', 'Clear objectives and measurable outcomes in every strategy, campaign, and creative solution.'],
  ['Creative & strategic thinking', 'Creative ideas grounded in planning, business goals, and meaningful audience connections.'],
  ['In-house production', 'Integrated production capabilities that keep quality, consistency, and execution moving together.'],
  ['Dedicated partnership', 'Clear communication, tailored solutions, and long-term thinking from the first brief onward.'],
];

const industries = [
  'Real estate', 'Interior design', 'Healthcare', 'Fashion & retail', 'Restaurants & cafés',
  'Automotive', 'Events & entertainment', 'Technology & software', 'Beauty & cosmetics',
  'Fitness & wellness', 'Startups', 'Education',
];

const processSteps = [
  ['01', 'Discover', 'Business, audience, opportunity.'],
  ['02', 'Define', 'Strategy, message, creative route.'],
  ['03', 'Create', 'Concept, design, production.'],
  ['04', 'Launch', 'Publish, distribute, activate.'],
  ['05', 'Optimize', 'Measure, learn, improve.'],
];

const stats = [
  { target: 360, suffix: '°', label: 'Integrated thinking' },
  { target: 5, suffix: '+', label: 'Core capabilities' },
  { target: 1, suffix: '', label: 'Team from brief to launch' },
  { target: 24, suffix: '/7', label: 'Ideas in motion' },
];

const directorScenes = [
  {
    index: '01',
    label: 'Strategy',
    eyebrow: 'Find the signal',
    title: 'Before the first frame, we find the reason to care.',
    description: 'The sharpest insight gives every decision a job to do — from the first headline to the last impression.',
    image: '/assets/hero-camera.jpg',
    tag: 'THE WHY',
  },
  {
    index: '02',
    label: 'Story',
    eyebrow: 'Shape the narrative',
    title: 'Then we turn the idea into a world people want to enter.',
    description: 'One strong creative direction, translated into the content, identity, and experiences your audience actually remembers.',
    image: '/assets/work-laptop.jpg',
    tag: 'THE WHAT',
  },
  {
    index: '03',
    label: 'Scale',
    eyebrow: 'Make it move',
    title: 'Finally, we make the work earn its place in the real world.',
    description: 'Production, media, and iteration working together so attention becomes momentum — and momentum becomes growth.',
    image: '/assets/agency-page.jpg',
    tag: 'THE IMPACT',
  },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const counterRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const duration = 1200;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
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

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [careerSubmitted, setCareerSubmitted] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const visibleProjects = useMemo(
    () => (activeFilter === 'All' ? projects : projects.filter((project) => project.category === activeFilter)),
    [activeFilter],
  );
  const activeScene = directorScenes[sceneIndex];

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollY(window.scrollY);
      setScrollProgress(scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0);
      document.documentElement.classList.toggle('is-scrolled', window.scrollY > 24);
    };

    let frame = 0;
    const requestScrollUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        handleScroll();
      });
    };

    const revealElements = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    revealElements.forEach((element) => observer.observe(element));
    handleScroll();
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    return () => {
      window.removeEventListener('scroll', requestScrollUpdate);
      observer.disconnect();
      document.documentElement.classList.remove('is-scrolled');
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const finePointer = window.matchMedia('(pointer:fine)').matches;
    if (!finePointer) return;

    const handleGlobalPointerMove = (event: PointerEvent) => {
      root.style.setProperty('--cursor-x', event.clientX + 'px');
      root.style.setProperty('--cursor-y', event.clientY + 'px');
      root.classList.add('has-pointer');
    };
    const handlePointerLeave = () => root.classList.remove('has-pointer');

    document.addEventListener('pointermove', handleGlobalPointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      document.removeEventListener('pointermove', handleGlobalPointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      root.classList.remove('has-pointer');
    };
  }, []);

  function handleHeroPointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  }

  function handleHeroPointerLeave() {
    setPointer({ x: 50, y: 50 });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function handleCareerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCareerSubmitted(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main className="site-shell">
      <div className="cursor-glow" aria-hidden="true" />
      <header className="site-nav">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="UFirst home">
          <span className="brand-glyph">U</span>
          <span>FIRST</span>
        </a>

        <nav id="primary-navigation" className={menuOpen ? 'nav-links nav-links-open' : 'nav-links'} aria-label="Primary navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#process" onClick={closeMenu}>Process</a>
          <a href="#careers" onClick={closeMenu}>Careers</a>
        </nav>

        <a className="nav-cta" href="#contact">Start a project <span>↗</span></a>
        <button className="nav-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span />
          <span />
        </button>
      </header>

      <section
        className="hero"
        id="top"
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={handleHeroPointerLeave}
        style={{ '--pointer-x': pointer.x + '%', '--pointer-y': pointer.y + '%' } as CSSProperties}
      >
        <div
          className="hero-backdrop"
          aria-hidden="true"
          style={{
            backgroundImage: "linear-gradient(90deg, rgba(11,11,11,.92) 0%, rgba(11,11,11,.66) 44%, rgba(11,11,11,.25) 100%), url('" + activeScene.image + "')",
            transform: "scale(1.06) translate(" + ((pointer.x - 50) / 40) + "%, " + ((pointer.y - 50) / 40) + "%) translateY(" + scrollY * 0.06 + "px)",
          }}
        />
        <div className="hero-noise" aria-hidden="true" />
        <div className="section-shell hero-content" style={{ opacity: Math.max(0.22, 1 - scrollY / 560), transform: "translateY(" + scrollY * 0.08 + "px)" }}>
          <div className="eyebrow"><span className="eyebrow-dot" /> Cairo / MENA · Full-service agency <span className="hero-live"><span /> Live direction</span></div>
          <div className="hero-copy-wrap">
            <div>
              <div className="hero-scene-label"><span>Scene {activeScene.index}</span><span>{activeScene.label} / {activeScene.tag}</span></div>
              <h1>Make your next <span>bold move.</span></h1>
              <p className="hero-copy">UFirst is the creative partner for brands that want more than attention. We make strategy, story, and production move as one.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#contact">Start a project <span>↗</span></a>
                <a className="text-link" href="#reel"><span className="play-disc">▶</span> Direct the reel</a>
              </div>
            </div>
            <div className="hero-note">
              <span className="hero-note-index">{activeScene.index} / 03</span>
              <p>{activeScene.eyebrow}.<br />Impact always.</p>
            </div>
          </div>
          <div className="director-console" aria-label="Director's cut controls">
            <div className="director-console-head"><span>Director&apos;s cut</span><span className="console-live"><i /> Live frame</span></div>
            <div className="director-scene-buttons" role="tablist" aria-label="Change the UFirst scene">
              {directorScenes.map((scene, index) => (
                <button
                  className={sceneIndex === index ? 'director-scene-button director-scene-active' : 'director-scene-button'}
                  key={scene.index}
                  type="button"
                  role="tab"
                  aria-selected={sceneIndex === index}
                  onClick={() => setSceneIndex(index)}
                >
                  <span>{scene.index}</span>{scene.label}
                </button>
              ))}
            </div>
            <div className="director-progress"><span style={{ width: (((sceneIndex + 1) / directorScenes.length) * 100) + '%' }} /></div>
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

      <section className="reel-section section-dark" id="reel">
        <div className="section-shell">
          <div className="section-kicker" data-reveal="up"><span>LIVE / 06</span> The UFirst engine</div>
          <div className="reel-heading" data-reveal="up">
            <h2>Change the <em>frame.</em></h2>
            <p>Use the controls to see how one sharp insight becomes a connected brand system.</p>
          </div>
          <div className="reel-interface" data-reveal="up">
            <div className="reel-screen">
              <div
                className="reel-screen-image"
                style={{ backgroundImage: "url('" + activeScene.image + "')" }}
                aria-label={activeScene.label + ' scene'}
              />
              <div className="reel-screen-overlay" />
              <div className="reel-scanline" />
              <div className="reel-screen-top"><span>UF / MOTION STUDY</span><span>REC <i /></span></div>
              <div className="reel-screen-bottom"><span>00:{String((sceneIndex + 1) * 12).padStart(2, '0')}</span><span>{activeScene.tag}</span></div>
              <div className="reel-crosshair" aria-hidden="true"><span /><span /></div>
            </div>
            <div className="reel-copy">
              <span className="reel-copy-index">Frame {activeScene.index} — {activeScene.label}</span>
              <h3>{activeScene.title}</h3>
              <p>{activeScene.description}</p>
              <div className="reel-actions">
                <button className="button button-primary" type="button" onClick={() => setSceneIndex((sceneIndex + 1) % directorScenes.length)}>Run next frame <span>↗</span></button>
                <span className="reel-hint">Tap the frame to direct the story</span>
              </div>
              <div className="reel-timeline">
                {directorScenes.map((scene, index) => (
                  <button className={sceneIndex === index ? 'reel-timeline-step reel-timeline-active' : 'reel-timeline-step'} type="button" key={scene.index} onClick={() => setSceneIndex(index)}>
                    <span>{scene.index}</span><b>{scene.label}</b><i />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark pattern-section" id="about">
        <div className="section-shell">
          <div className="section-kicker" data-reveal="up"><span>01</span> About UFirst</div>
          <div className="about-grid" data-reveal="left">
            <div>
              <h2>Make the work <em>matter.</em></h2>
              <p className="lead-copy">UFirst is a full-service marketing and media production agency based in Cairo, Egypt. Since 2019, we have helped brands build stronger connections through strategy, creative storytelling, and high-quality production.</p>
              <a className="arrow-link" href="#services">See what we do <span>↗</span></a>
            </div>
            <div className="about-frame">
              <img src="/assets/agency-page.jpg" alt="UFirst agency landing page concept" />
              <div className="frame-caption"><span>UFirst / 2026</span><span>Built to perform</span></div>
            </div>
          </div>
          <div className="stat-row" data-reveal="stagger">
            {stats.map((stat) => (
              <div key={stat.label}><CountUp target={stat.target} suffix={stat.suffix} /><span>{stat.label}</span></div>
            ))}
          </div>
          <div className="profile-grid" data-reveal="stagger">
            <article className="profile-card profile-card-featured">
              <span className="profile-card-label">Our mission</span>
              <h3>Strengthen brands through strategy, story, and production.</h3>
              <p>We empower businesses with creative work that builds trust, creates visibility, and drives sustainable growth.</p>
            </article>
            <article className="profile-card">
              <span className="profile-card-label">Our vision</span>
              <h3>Creativity with measurable impact.</h3>
              <p>To be a leading marketing and media production partner in the Middle East, recognized for innovation and results.</p>
            </article>
            <article className="profile-card profile-card-wide">
              <span className="profile-card-label">Built for different sectors</span>
              <div className="industry-pills">
                {industries.map((industry) => <span key={industry}>{industry}</span>)}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-light" id="services">
        <div className="section-shell">
          <div className="section-kicker section-kicker-light" data-reveal="up"><span>02</span> What we do</div>
          <div className="services-heading" data-reveal="up">
            <h2>One sharp team.<br /><em>Every angle covered.</em></h2>
            <p>When the strategy, creative, and execution live under one roof, the work moves faster — and lands harder.</p>
          </div>
          <div className="service-grid" data-reveal="stagger">
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
          <div className="work-heading" data-reveal="up">
            <div>
              <div className="section-kicker" data-reveal="up"><span>03</span> Selected work</div>
              <h2>Built for the <em>real world.</em></h2>
            </div>
            <p>Not just work that looks good in a deck. Work that earns attention, changes perception, and gives people a reason to choose you.</p>
          </div>
          <div className="filter-row" data-reveal="up" role="tablist" aria-label="Filter selected work">
            {filters.map((filter) => (
              <button className={activeFilter === filter ? 'filter-button filter-active' : 'filter-button'} key={filter} type="button" onClick={() => setActiveFilter(filter)} role="tab" aria-selected={activeFilter === filter}>{filter}</button>
            ))}
          </div>
          <div className="project-grid" data-reveal="stagger">
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
          <div className="section-kicker section-kicker-light" data-reveal="up"><span>04</span> How we move</div>
          <div className="process-heading" data-reveal="up"><h2>Less theatre.<br /><em>More traction.</em></h2><p>Our process is simple enough to keep momentum, rigorous enough to protect the idea, and flexible enough for the real world.</p></div>
          <div className="process-list" data-reveal="stagger">
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

      <section className="section section-dark why-section" id="why">
        <div className="section-shell">
          <div className="section-kicker" data-reveal="up"><span>05</span> Why UFirst</div>
          <div className="why-heading" data-reveal="up">
            <h2>Built to be your <em>unfair advantage.</em></h2>
            <p>One connected team, one clear direction, and the production capability to carry the idea all the way through.</p>
          </div>
          <div className="why-grid" data-reveal="stagger">
            {profilePrinciples.map(([title, text], index) => (
              <article className="why-card" key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="statement-band">
        <div className="section-shell statement-inner" data-reveal="zoom"><span className="statement-mark">✦</span><p>Good work gets noticed.<br /><strong>Great work gets remembered.</strong></p><span className="statement-mark">✦</span></div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="section-shell contact-grid" data-reveal="up">
          <div>
            <div className="section-kicker" data-reveal="up"><span>06</span> Start a conversation</div>
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

      <section className="section careers-section" id="careers">
        <div className="section-shell careers-grid" data-reveal="up">
          <div className="careers-copy">
            <div className="section-kicker"><span>07</span> Join the team</div>
            <h2>Bring your <em>point of view.</em></h2>
            <p>We are always looking for thoughtful strategists, creative minds, makers, and people who care about getting the details right.</p>
            <div className="career-meta"><span>UFirst / People</span><span>Designed to perform.</span></div>
          </div>
          <div className="career-form-wrap" id="career-form">
            {careerSubmitted ? (
              <div className="form-success career-success"><span>✦</span><h3>Application captured.</h3><p>Your details are ready for the UFirst team. The company inbox and CV upload endpoint will be connected in the next step.</p><button className="button button-outline" type="button" onClick={() => setCareerSubmitted(false)}>Submit another</button></div>
            ) : (
              <form className="contact-form career-form" onSubmit={handleCareerSubmit}>
                <div className="form-field-grid">
                  <label>Full name<input name="fullName" placeholder="Your name" required /></label>
                  <label>Age<input name="age" type="number" inputMode="numeric" placeholder="Your age" required /></label>
                  <label>Email<input name="careerEmail" type="email" placeholder="you@email.com" required /></label>
                  <label>Phone number<input name="phone" type="tel" placeholder="+20 ..." required /></label>
                  <label>WhatsApp number<input name="whatsapp" type="tel" placeholder="+20 ..." required /></label>
                  <label>Expected salary<input name="salary" placeholder="Monthly expectation" required /></label>
                </div>
                <label>Upload your CV<input name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required /></label>
                <p className="form-note">Your application will be routed to the company email once the backend connection is added.</p>
                <button className="button button-primary button-submit" type="submit">Send application <span>↗</span></button>
              </form>
            )}
          </div>
        </div>
      </section>

      <div className="scroll-progress" style={{ width: scrollProgress + '%' }} aria-hidden="true" />

      <footer className="site-footer">
        <div className="section-shell footer-top"><a className="brand footer-brand" href="#top"><span className="brand-glyph">U</span><span>FIRST</span></a><p>Designed to perform.</p><a className="back-top" href="#top">Back to top ↑</a></div>
        <div className="section-shell footer-bottom"><span>© 2026 UFirst Agency</span><span>Strategy / Story / Scale</span><span>Cairo · Egypt</span></div>
      </footer>
    </main>
  );
}
