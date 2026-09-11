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
    background: image('/assets/hero-camera.jpg', 'A camera operator preparing a cinematic production'),
  },
  about: {
    eyebrow: '01 / About UFirst',
    headline: 'Make the work',
    emphasis: 'matter.',
    body: 'UFirst is a full-service marketing and media production agency based in Cairo, Egypt. Since 2019, we have helped brands build stronger connections through strategy, creative storytelling, and high-quality production.',
    image: image('/assets/agency-page.jpg', 'UFirst agency website concept'),
  },
  system: {
    eyebrow: '02 / The UFirst system',
    headline: 'One sharp idea.',
    emphasis: 'Every angle connected.',
    body: 'Scroll through the way we work: signal becomes story, story becomes output, and output keeps moving until it creates momentum.',
  },
  services: [
    {
      number: '01',
      title: 'Brand & strategy',
      text: 'Positioning, identity, and campaign thinking that give your brand a clear lane to own.',
      tags: ['Marketing strategy', 'Brand positioning', 'Launch strategy'],
      image: image('/assets/hero-camera.jpg', 'Camera ready for a brand production'),
    },
    {
      number: '02',
      title: 'Creative & content',
      text: 'Big ideas translated into social, film, photography, and design that people remember.',
      tags: ['Creative direction', 'Copywriting', 'Content planning'],
      image: image('/assets/agency-page.jpg', 'Creative UFirst digital experience'),
    },
    {
      number: '03',
      title: 'Media production',
      text: 'Film, photography, editing, motion, and post-production that make the idea feel real.',
      tags: ['Commercial video', 'Product photography', 'Podcast production'],
      image: image('/assets/work-laptop.jpg', 'UFirst work environment and production setup'),
    },
    {
      number: '04',
      title: 'Social & digital',
      text: 'Platform-native content and digital launches that keep your brand in the conversation.',
      tags: ['Social management', 'Community', 'Performance marketing'],
      image: image('/assets/agency-page.jpg', 'UFirst digital campaign interface'),
    },
    {
      number: '05',
      title: 'Growth & performance',
      text: 'A performance mindset across paid, organic, and digital so attention turns into momentum.',
      tags: ['Market research', 'Campaign management', 'Growth planning'],
      image: image('/assets/work-laptop.jpg', 'Laptop showing a UFirst digital experience'),
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
      image: image('/assets/hero-camera.jpg', 'Cinematic camera production for a campaign'),
    },
    {
      category: 'Brand',
      client: 'Digital experience',
      title: 'Turn a first impression into a lasting one.',
      description: 'A digital identity that makes the value obvious before the pitch even begins.',
      image: image('/assets/work-laptop.jpg', 'Laptop showing a branded digital experience'),
    },
    {
      category: 'Content',
      client: 'Always-on content',
      title: 'Build a content engine with a point of view.',
      description: 'From the first frame to the final cut, we make every piece earn its place in the feed.',
      image: image('/assets/agency-page.jpg', 'UFirst landing page visual concept'),
    },
  ],
  contact: {
    eyebrow: '06 / Start a conversation',
    headline: 'Got a good one?',
    emphasis: "Let's make it real.",
    body: 'Tell us what you are building, where it needs to go, and what is getting in the way. We will take it from there.',
  },
};
