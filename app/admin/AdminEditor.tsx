'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { useEffect, useState, type ChangeEvent } from 'react';
import type { Service, SiteContent } from '@/app/content';

type MediaAsset = { id: string; objectKey: string; filename: string; contentType: string; size: number };
type MediaListPayload = { configured?: boolean; assets?: MediaAsset[] };
type ApiPayload = { error?: string; src?: string; asset?: MediaAsset };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminEditor({ initialContent, identity }: { initialContent: SiteContent; identity: string }) {
  const [content, setContent] = useState(initialContent);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [status, setStatus] = useState('Draft ready');
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'media'>('content');
  const [mediaEnabled, setMediaEnabled] = useState(false);

  useEffect(() => {
    fetch('/api/admin/media').then(async (response) => {
      if (!response.ok) return;
      const payload = await response.json() as MediaListPayload;
      setMediaEnabled(payload.configured === true);
      setAssets(payload.assets ?? []);
      if (payload.configured === false) setStatus('Text editor ready. Image storage is paused until R2 is enabled.');
    }).catch(() => setStatus('Text editor ready. Image storage is currently unavailable.'));
  }, []);

  function updateHero(field: 'eyebrow' | 'headline' | 'emphasis' | 'body' | 'primaryCta' | 'secondaryCta', value: string) {
    setContent((current) => ({ ...current, hero: { ...current.hero, [field]: value } }));
  }

  function updateAbout(field: 'headline' | 'emphasis' | 'body', value: string) {
    setContent((current) => ({ ...current, about: { ...current.about, [field]: value } }));
  }

  function updateSystemAsset(field: 'dashboard' | 'mobile' | 'browser', src: string) {
    setContent((current) => ({ ...current, system: { ...current.system, [field]: { ...current.system[field], src } } }));
  }

  function updateHeroImage(src: string) {
    setContent((current) => ({ ...current, hero: { ...current.hero, background: { ...current.hero.background, src } } }));
  }

  function updatePatternImage(src: string) {
    setContent((current) => ({ ...current, backgrounds: { ...current.backgrounds, pattern: { ...current.backgrounds.pattern, src } } }));
  }

  function updateAboutImage(src: string) {
    setContent((current) => ({ ...current, about: { ...current.about, image: { ...current.about.image, src } } }));
  }

  function updateService(index: number, patch: Partial<Service>) {
    setContent((current) => ({ ...current, services: current.services.map((service, serviceIndex) => serviceIndex === index ? { ...service, ...patch } : service) }));
  }

  async function uploadImage(file: File, label: string, apply: (src: string) => void) {
    setBusy(true);
    setStatus(`Uploading ${label}…`);
    const formData = new FormData();
    formData.set('file', file);
    try {
      const response = await fetch('/api/admin/media', { method: 'POST', body: formData });
      const payload = await response.json() as ApiPayload;
      if (!response.ok) throw new Error(payload.error ?? 'Upload failed.');
      if (!payload.src || !payload.asset) throw new Error('Upload response was incomplete.');
      apply(payload.src);
      setAssets((current) => [payload.asset as MediaAsset, ...current]);
      setStatus(`${label} uploaded. Publish to make it live.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>, label: string, apply: (src: string) => void) {
    const file = event.target.files?.[0];
    if (file) void uploadImage(file, label, apply);
    event.target.value = '';
  }

  async function publish() {
    setBusy(true);
    setStatus('Publishing changes…');
    try {
      const response = await fetch('/api/admin/content', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(content) });
      const payload = await response.json() as ApiPayload;
      if (!response.ok) throw new Error(payload.error ?? 'Could not publish changes.');
      setStatus(`Published just now by ${identity}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not publish changes.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-nav"><Link className="brand admin-brand" href="/"><span className="brand-glyph">U</span><span>FIRST</span></Link><div className="admin-nav-right"><span className="admin-user">{identity}</span><Link className="admin-public-link" href="/">View public site ↗</Link></div></header>
      <div className="admin-layout">
        <aside className="admin-sidebar"><p className="admin-kicker">UFirst / Control room</p><h1>Keep the work moving.</h1><p>Update the visual system and content that powers the public landing page.</p><div className="admin-tabs"><button className={activeTab === 'content' ? 'admin-tab admin-tab-active' : 'admin-tab'} type="button" onClick={() => setActiveTab('content')}><span>01</span> Content</button><button className={activeTab === 'media' ? 'admin-tab admin-tab-active' : 'admin-tab'} type="button" onClick={() => setActiveTab('media')}><span>02</span> Media library</button></div><div className="admin-sidebar-note"><span className="admin-status-dot" />{status}</div></aside>
        <section className="admin-main">
          <div className="admin-main-head"><div><p className="admin-kicker">{activeTab === 'content' ? 'Content editor' : 'Asset library'}</p><h2>{activeTab === 'content' ? 'Shape the next frame.' : 'Every image in one place.'}</h2></div>{activeTab === 'content' ? <button className="button button-primary" type="button" onClick={() => void publish()} disabled={busy}>{busy ? 'Working…' : 'Publish changes'} <span>↗</span></button> : null}</div>

          {activeTab === 'content' ? <div className="admin-content-grid">
            <section className="admin-storage-notice admin-card-wide"><span className="admin-status-dot" /><p>Text and content publishing are available. Uploads are paused until R2 is enabled, but you can paste a trusted image URL in any image control and publish it without returning to a developer.</p></section>
            <section className="admin-card admin-card-wide"><div className="admin-card-heading"><div><p className="admin-kicker">01 / Hero</p><h3>The first impression</h3></div><ImageUpload disabled={!mediaEnabled} label="Replace hero background" src={content.hero.background.src} onChange={(event) => handleImageChange(event, 'hero background', updateHeroImage)} onSourceChange={updateHeroImage} /></div><div className="admin-form-grid"><Field label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => updateHero('eyebrow', value)} /><Field label="Headline" value={content.hero.headline} onChange={(value) => updateHero('headline', value)} /><Field label="Emphasis" value={content.hero.emphasis} onChange={(value) => updateHero('emphasis', value)} /><Field label="Primary CTA" value={content.hero.primaryCta} onChange={(value) => updateHero('primaryCta', value)} /><Field label="Secondary CTA" value={content.hero.secondaryCta} onChange={(value) => updateHero('secondaryCta', value)} /><Field wide label="Supporting text" value={content.hero.body} onChange={(value) => updateHero('body', value)} multiline /></div></section>
            <section className="admin-card"><div className="admin-card-heading"><div><p className="admin-kicker">01A / Backgrounds</p><h3>Set the texture</h3></div><ImageUpload disabled={!mediaEnabled} label="Replace pattern" src={content.backgrounds.pattern.src} onChange={(event) => handleImageChange(event, 'background pattern', updatePatternImage)} onSourceChange={updatePatternImage} /></div><p className="admin-card-hint">This pattern is reused across the hero and dark content sections.</p></section>
            <section className="admin-card"><div className="admin-card-heading"><div><p className="admin-kicker">02 / About</p><h3>Make the work matter.</h3></div><ImageUpload disabled={!mediaEnabled} label="Replace about image" src={content.about.image.src} onChange={(event) => handleImageChange(event, 'about image', updateAboutImage)} onSourceChange={updateAboutImage} /></div><div className="admin-form-stack"><Field label="Headline" value={content.about.headline} onChange={(value) => updateAbout('headline', value)} /><Field label="Emphasis" value={content.about.emphasis} onChange={(value) => updateAbout('emphasis', value)} /><Field label="Body" value={content.about.body} onChange={(value) => updateAbout('body', value)} multiline /></div></section>
            <section className="admin-card admin-card-wide"><div className="admin-card-heading"><div><p className="admin-kicker">02A / 3D system</p><h3>Replace the scene surfaces</h3></div><span className="admin-card-hint">These images are mapped onto the live cinematic 3D world as screen content.</span></div><div className="admin-system-assets">{([['dashboard', 'Dashboard surface'], ['mobile', 'Mobile surface'], ['browser', 'Browser surface']] as const).map(([field, label]) => <div className="admin-system-asset" key={field}><img src={content.system[field].src} alt="" /><ImageUpload disabled={!mediaEnabled} label={label} src={content.system[field].src} onChange={(event) => handleImageChange(event, `3D ${label.toLowerCase()}`, (src) => updateSystemAsset(field, src))} onSourceChange={(src) => updateSystemAsset(field, src)} /></div>)}</div></section>
            <section className="admin-card admin-card-wide"><div className="admin-card-heading"><div><p className="admin-kicker">03 / Services</p><h3>Update each capability</h3></div><span className="admin-card-hint">Images are used as screen content and editorial service imagery.</span></div><div className="admin-service-list">{content.services.map((service, index) => <article className="admin-service-row" key={service.number}><div className="admin-service-number">{service.number}</div><div className="admin-service-fields"><Field label="Title" value={service.title} onChange={(value) => updateService(index, { title: value })} /><Field label="Description" value={service.text} onChange={(value) => updateService(index, { text: value })} multiline /><Field label="Tags (comma separated)" value={service.tags.join(', ')} onChange={(value) => updateService(index, { tags: value.split(',').map((tag) => tag.trim()).filter(Boolean) })} /></div><div className="admin-service-media"><img src={service.image.src} alt="" /><ImageUpload disabled={!mediaEnabled} label="Replace image" src={service.image.src} onChange={(event) => handleImageChange(event, `service ${service.number}`, (src) => updateService(index, { image: { ...service.image, src } }))} onSourceChange={(src) => updateService(index, { image: { ...service.image, src } })} /></div></article>)}</div></section>
            <section className="admin-card admin-card-wide"><div className="admin-card-heading"><div><p className="admin-kicker">04 / Work imagery</p><h3>Keep selected work current</h3></div><span className="admin-card-hint">Project names and descriptions remain editable in the content model.</span></div><div className="admin-project-list">{content.projects.map((project, index) => <div className="admin-project-row" key={project.title}><img src={project.image.src} alt="" /><div><span className="admin-kicker">{project.category}</span><strong>{project.title}</strong></div><ImageUpload disabled={!mediaEnabled} label="Replace image" src={project.image.src} onChange={(event) => handleImageChange(event, `project ${index + 1}`, (src) => setContent((current) => ({ ...current, projects: current.projects.map((item, itemIndex) => itemIndex === index ? { ...item, image: { ...item.image, src } } : item) })))} onSourceChange={(src) => setContent((current) => ({ ...current, projects: current.projects.map((item, itemIndex) => itemIndex === index ? { ...item, image: { ...item.image, src } } : item) }))} /></div>)}</div></section>
          </div> : <div className="admin-media-grid">{assets.length ? assets.map((asset) => <article className="media-asset" key={asset.id}><img src={`/api/media/${asset.objectKey}`} alt={asset.filename} /><div><strong>{asset.filename}</strong><span>{formatBytes(asset.size)} · {asset.contentType}</span></div></article>) : <div className="admin-empty"><span>✦</span><h3>Your library is ready.</h3><p>Upload an image from any content section and it will appear here.</p></div>}</div>}
        </section>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, multiline = false, wide = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; wide?: boolean }) {
  return <label className={wide ? 'admin-field admin-field-wide' : 'admin-field'}><span>{label}</span>{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} /> : <input value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function ImageUpload({ label, src, onChange, onSourceChange, disabled = false }: { label: string; src: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void; onSourceChange: (src: string) => void; disabled?: boolean }) {
  return <label className={disabled ? 'image-upload image-upload-disabled' : 'image-upload'}><span>{label}</span><input type="file" accept="image/*" onChange={onChange} disabled={disabled} /><input className="image-source-input" type="text" value={src} onChange={(event) => onSourceChange(event.target.value)} placeholder="/assets/... or https://..." aria-label={`${label} source URL`} /><small>{disabled ? 'Upload paused; paste a source URL, then publish' : src.startsWith('/api/media/') ? 'Managed media' : 'Current asset'}</small></label>;
}
