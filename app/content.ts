export type ManagedImage = {
  src: string;
  alt: string;
};

export type Service = {
  number: string;
  title: string;
  text: string;
  tags: string[];
  image: ManagedImage;
};

export type Project = {
  category: string;
  client: string;
  title: string;
  description: string;
  image: ManagedImage;
};

export type ExperienceMoment = {
  number: string;
  scene: string;
  title: string;
  body: string;
  component: string;
};

export type SiteContent = {
  brand: {
    name: string;
    tagline: string;
    email: string;
    location: string;
  };
  backgrounds: {
    pattern: ManagedImage;
  };
  hero: {
    eyebrow: string;
    headline: string;
    emphasis: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    background: ManagedImage;
  };
  about: {
    eyebrow: string;
    headline: string;
    emphasis: string;
    body: string;
    image: ManagedImage;
  };
  system: {
    eyebrow: string;
    headline: string;
    emphasis: string;
    body: string;
    dashboard: ManagedImage;
    mobile: ManagedImage;
    browser: ManagedImage;
  };
  services: Service[];
  industries: string[];
  process: Array<{ number: string; title: string; text: string }>;
  projects: Project[];
  contact: {
    eyebrow: string;
    headline: string;
    emphasis: string;
    body: string;
  };
  experience: {
    scrollLabel: string;
    locationLabel: string;
    moments: ExperienceMoment[];
  };
};

const image = (src: string, alt: string): ManagedImage => ({ src, alt });

export const defaultContent: SiteContent = {
  brand: {
    name: 'UFirst',
    tagline: 'Designed to perform.',
    email: 'hello@ufirst.agency',
    location: 'Cairo, Egypt · Working globally',
  },
  backgrounds: {
    pattern: image('/assets/pattern.png', 'UFirst repeating background pattern'),
  },
  hero: {
    eyebrow: 'Cairo / MENA · Full-service agency',
    headline: 'Make your next',
    emphasis: 'bold move.',
    body: 'UFirst is the creative partner for brands that want more than attention. We make strategy, story, and production move as one.',
    primaryCta: 'Start a project',
    secondaryCta: 'Explore the system',
    background: image('/assets/camera/ufirst-camera-exterior-v2.png', 'A realistic UFirst cinema camera in a dark studio'),
  },
  about: {
    eyebrow: '01 / About UFirst',
    headline: 'Make the work',
    emphasis: 'matter.',
    body: 'UFirst is a full-service marketing and media production agency based in Cairo, Egypt. Since 2019, we have helped brands build stronger connections through strategy, creative storytelling, and high-quality production.',
    image: image('/assets/journey/photographer.png', 'A UFirst photographer working behind a cinema camera'),
  },
  system: {
    eyebrow: '02 / The UFirst system',
    headline: 'One sharp idea.',
    emphasis: 'Every angle connected.',
    body: 'Scroll through the way we work: signal becomes story, story becomes output, and output keeps moving until it creates momentum.',
    dashboard: image('/assets/journey/studio-crew.png', 'A real UFirst studio production with lights and a camera crew'),
    mobile: image('/assets/journey/camera-set.png', 'A real camera setup ready for production'),
    browser: image('/assets/journey/production-kit.png', 'UFirst production equipment on a studio set'),
  },
  services: [
    {
      number: '01',
      title: 'Brand & strategy',
      text: 'Positioning, identity, and campaign thinking that give your brand a clear lane to own.',
      tags: ['Marketing strategy', 'Brand positioning', 'Launch strategy'],
      image: image('/assets/journey/camera-rig.png', 'A cinema camera rig being prepared for a production'),
    },
    {
      number: '02',
      title: 'Creative & content',
      text: 'Big ideas translated into social, film, photography, and design that people remember.',
      tags: ['Creative direction', 'Copywriting', 'Content planning'],
      image: image('/assets/journey/studio-crew.png', 'A real studio shoot with lighting and a production team'),
    },
    {
      number: '03',
      title: 'Media production',
      text: 'Film, photography, editing, motion, and post-production that make the idea feel real.',
      tags: ['Commercial video', 'Product photography', 'Podcast production'],
      image: image('/assets/journey/camera-set.png', 'A cinema camera on a real production set'),
    },
    {
      number: '04',
      title: 'Social & digital',
      text: 'Platform-native content and digital launches that keep your brand in the conversation.',
      tags: ['Social management', 'Community', 'Performance marketing'],
      image: image('/assets/journey/production-kit.png', 'Production equipment ready for content creation'),
    },
    {
      number: '05',
      title: 'Growth & performance',
      text: 'A performance mindset across paid, organic, and digital so attention turns into momentum.',
      tags: ['Market research', 'Campaign management', 'Growth planning'],
      image: image('/assets/journey/drone-camera.png', 'A real UFirst camera system ready to capture the next frame'),
    },
  ],
  industries: [
    'Real estate', 'Interior design', 'Healthcare', 'Fashion & retail',
    'Restaurants & cafés', 'Automotive', 'Events & entertainment',
    'Technology & software', 'Beauty & cosmetics', 'Fitness & wellness',
    'Startups', 'Education',
  ],
  process: [
    { number: '01', title: 'Discover', text: 'Business, audience, opportunity.' },
    { number: '02', title: 'Define', text: 'Strategy, message, creative route.' },
    { number: '03', title: 'Create', text: 'Concept, design, production.' },
    { number: '04', title: 'Launch', text: 'Publish, distribute, activate.' },
    { number: '05', title: 'Optimize', text: 'Measure, learn, improve.' },
  ],
  projects: [
    {
      category: 'Campaign',
      client: 'Visual storytelling',
      title: 'Make the moment impossible to scroll past.',
      description: 'A launch system built around a clear narrative, a sharp visual world, and content that travels.',
      image: image('/assets/journey/brand-card.png', 'A UFirst brand card photographed in a real production scene'),
    },
    {
      category: 'Brand',
      client: 'Digital experience',
      title: 'Turn a first impression into a lasting one.',
      description: 'A digital identity that makes the value obvious before the pitch even begins.',
      image: image('/assets/journey/brand-brochure.png', 'A UFirst brand brochure photographed in a real environment'),
    },
    {
      category: 'Content',
      client: 'Always-on content',
      title: 'Build a content engine with a point of view.',
      description: 'From the first frame to the final cut, we make every piece earn its place in the feed.',
      image: image('/assets/journey/drone-camera.png', 'A real camera system ready to capture the final frame'),
    },
  ],
  contact: {
    eyebrow: '06 / Start a conversation',
    headline: 'Got a good one?',
    emphasis: "Let's make it real.",
    body: 'Tell us what you are building, where it needs to go, and what is getting in the way. We will take it from there.',
  },
  experience: {
    scrollLabel: 'Scroll to direct the film',
    locationLabel: 'Cairo / Egypt · Working globally',
    moments: [
      { number: '01', scene: 'reveal', title: 'Make the first frame count.', body: 'UFirst brings strategy, story, and production into one clear point of view.', component: 'The exterior / A point of view' },
      { number: '02', scene: 'system', title: 'Earn attention.', body: 'Move closer. The lens is where a signal becomes something people can feel.', component: 'The lens / Find the focus' },
      { number: '03', scene: 'about', title: 'Focus the story.', body: 'A sharper point of view gives ambitious brands a clearer lane to own.', component: 'The aperture / Shape the story' },
      { number: '04', scene: 'services', title: 'Make the move.', body: 'Brand, creative, production, digital, and growth work as one connected system.', component: 'The shutter / Make it move' },
      { number: '05', scene: 'work', title: 'Turn insight into work.', body: 'Ideas become real output: built for attention, remembered for a reason.', component: 'The sensor / See the signal' },
      { number: '06', scene: 'process', title: 'Carry it forward.', body: 'A disciplined process keeps the idea moving from first signal to measured momentum.', component: 'The processor / Build what lasts' },
      { number: '07', scene: 'contact', title: 'See what is possible.', body: 'Bring the brief, the ambition, or the problem. We will find the frame worth making.', component: 'The viewfinder / Start the conversation' },
      { number: '08', scene: 'exit', title: 'Make your next bold move.', body: 'The camera returns complete. Now the next frame belongs to your brand.', component: 'The final frame / UFirst' },
    ],
  },
};
