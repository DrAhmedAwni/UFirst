# UFirst Immersive 3D Master Plan

Status: implemented UFirst experience / production camera asset polish pending
Scope: UFirst only  
Reference: Active Theory-level interaction thinking, without copying its branding, assets, code, or composition

## 1. Creative north star

UFirst is presented as one continuous camera journey. The visitor does not move through unrelated landing-page sections while a decorative canvas sits behind them. The 3D world is the interface and the camera is the beginning of the story.

The narrative is:

`darkness → camera reveal → approach → lens entry → exploded mechanism → services/work inside the system → reassembly → camera turns toward the visitor → project CTA`

The experience should make the visitor remember specific physical moments:

- the camera arrives from darkness;
- the lens catches light as the visitor approaches;
- the camera opens into separated parts;
- the visitor travels through the lens and internal architecture;
- services and work are discovered inside the camera system;
- the camera rebuilds itself and points back at the visitor.

This is a cinematic product visualisation of UFirst’s way of working, not a generic agency template and not a Three.js effects demo.

## 2. Non-negotiable principles

1. UFirst only. No Shift Digital files, routes, styles, content, assets, or deployment changes are in scope.
2. Major objects must be real 3D geometry: GLB/GLTF where available, or documented procedural geometry where it is the right production choice.
3. Raster images are content surfaces, textures, references, or fallback imagery—not substitutes for the camera body or its exploded parts.
4. One master timeline controls camera position, target, lens/FOV, object transforms, lighting, atmosphere, text, and transitions.
5. Scroll is the primary control. Pointer response is subtle and never fights the scroll journey.
6. Transitions are spatial: lens passage, aperture, occlusion, light reveals, travel through geometry, and reassembly. Section fade-ins are not the primary transition system.
7. The 3D experience remains persistent. DOM content is semantic, accessible, and positioned as part of scene moments rather than rendered as opaque pages over a hidden canvas.
8. Content must remain understandable without WebGL, motion, or a high-performance device.
9. Quality is adaptive: high, medium, and low device tiers preserve the story while reducing expensive effects.
10. No invented client results or fake case studies. The work layer uses only approved UFirst content.

## 3. Rebuild decision

The current UFirst implementation is treated as an exploratory prototype, not as the final architecture. It already provides useful content, route structure, admin editing, procedural camera geometry, camera keyframes, and local image assets. The final build may replace the current landing-page composition and refactor the scene completely while preserving approved UFirst copy and the editor capability.

The current audit found:

- active app surface: `site/`;
- Next/Vinext + React + TypeScript + Three.js;
- existing UFirst landing-page content and editable content model;
- existing admin editor for text, image URLs, and media records;
- existing procedural cinematic scene and scroll director;
- no native `.glb`, `.gltf`, `.obj`, `.fbx`, Blender, HDR, KTX2, or EXR production model in the project;
- camera PNGs and agency artwork are available, but they are not an interactive separated camera model;
- existing CSS still places normal document sections above a fixed canvas, which conflicts with the final world-as-interface direction;
- `.openai/hosting.json` and existing D1 configuration are preserved; deployment is a later validation phase.

Implementation checkpoint: the persistent UFirst camera journey, semantic chapter layer, adaptive quality tiers, reduced-motion behavior, editable experience copy, physical service/work surfaces, non-WebGL fallback, and original separated camera GLB are now implemented. The remaining production work is photoreal surface texturing, LOD1/LOD2 optimization, and agency approval of the generated asset against `3D-ASSET-REQUIREMENTS.md`.

## 4. Experience architecture

### 4.1 Persistent layers

The runtime is organised into five coordinated layers:

1. **Experience shell** — semantic document structure, navigation, skip link, loader, progress, fallback content, and reduced-motion mode.
2. **WebGL canvas** — persistent renderer, scene manager, camera rig, lighting, models, textures, post-processing, and quality controller.
3. **Scene choreography** — a config-driven timeline that samples camera paths and scene ranges without putting high-frequency values in React state.
4. **Spatial typography/UI** — short editorial copy, labels, service markers, project titles, and CTA moments that can be placed in depth or paired with a semantic DOM representation.
5. **Content source** — the existing UFirst content model, later extended with scene labels, service anchors, project media, and asset metadata so non-developers can update approved content.

### 4.2 Suggested project boundaries

Adapt the existing project rather than migrating stacks unnecessarily:

```text
app/
  components/
    experience/
      Experience.tsx
      ExperienceCanvas.tsx
      SceneManager.ts
      TimelineDirector.ts
      QualityController.ts
      LoadingExperience.tsx
    models/
      CameraModel.ts
      CameraParts.ts
      Environment.ts
    scenes/
      IntroScene.ts
      CameraRevealScene.ts
      ExplodedCameraScene.ts
      LensJourneyScene.ts
      ServicesScene.ts
      WorkScene.ts
      FinaleScene.ts
    effects/
      LensTransition.ts
      PostProcessing.ts
    ui/
      Navigation.tsx
      SceneCopy.tsx
      AccessibleContent.tsx
      CTA.tsx
  config/
    experience-timeline.ts
    camera-paths.ts
    quality-tiers.ts
docs/
  IMMERSIVE-3D-MASTER-PLAN.md
  3D-ASSET-REQUIREMENTS.md
public/
  models/
  textures/
  environment/
  images/
```

The names are directional. The implementation should reuse stable existing boundaries when that is safer than a broad rewrite.

## 5. Scene-by-scene journey

The exact progress values remain configurable. The following is the narrative order, not a promise of a fixed scroll length.

### Scene 00 — Load into the world

Show the UFirst mark, a restrained progress indicator, and a dark studio atmosphere. Critical assets are preloaded. The loader resolves into the first camera frame through light and focus movement; it must not disappear into a blank frame.

### Scene 01 — The first frame

The visitor starts outside a realistic camera in a dark studio. The camera is partially concealed by darkness, with controlled highlights revealing the body, lens, and red UFirst accent. The first headline is concise and anchored to the composition. Navigation stays available without taking over the frame.

### Scene 02 — Approach the lens

The camera moves toward the front element. Reflections, glass thickness, focus rings, aperture blades, and barrel depth establish physical scale. The UFirst promise is revealed through typography and light—not a card overlay.

### Scene 03 — Enter the lens

The front lens fills the viewport. The transition uses glass/refraction, aperture movement, controlled exposure, or an occluding lens element to enter the camera. Avoid an unmotivated black flash or blurry particle tunnel.

### Scene 04 — Exploded mechanism

Inside the camera, separated components hold clear spatial relationships. Component labels appear only when the camera reaches the relevant area. The exploded state has readable staging, directional light, and enough contrast to identify each part.

### Scene 05 — The UFirst system

The internal camera system becomes a metaphor for integrated agency work. Strategy, creative, production, digital, and growth are represented by real scene objects and approved imagery. The visitor should understand that the parts are distinct but designed to work as one system.

### Scene 06 — Services in depth

Each approved UFirst service receives a spatial identity and a short explanation. Services should be encountered as the camera travels through the mechanism, not as four identical cards. A direct navigation shortcut can move the timeline to a service range.

### Scene 07 — Work / proof

Selected work appears as physical surfaces, displays, or projected scenes within the environment. Project imagery comes from the repository or later approved uploads. Titles and categories stay readable. An accessible project index remains available outside the cinematic path.

### Scene 08 — Process / motion

The camera travels through a sequence of production states: brief, direction, making, launch, and optimisation. The process story is expressed by set changes, light, and objects with deliberate purpose. The supplied process atlas can be used only as a temporary content surface until approved 3D objects or scene assets exist.

### Scene 09 — Reassembly

The internal components return in a controlled order. Sensor, shutter, processor, lens groups, and body shell converge. Motion has weight and avoids snapping or intersecting geometry. The completed camera becomes the visual proof of an integrated UFirst system.

### Scene 10 — Final frame / contact

The camera rotates toward the visitor and moves back into a composed studio shot. The lens illuminates or catches a final reflection as the CTA appears. The contact action must be short, clear, keyboard accessible, and available through direct navigation without replaying the full journey.

## 6. Camera choreography

Use a dedicated camera rig with separate position, look target, FOV, roll, and focus-distance tracks. Interpolate each track with cinematic easing and preserve continuity across scene boundaries.

Required behaviors:

- Catmull-Rom or equivalent smooth spatial path where a spline improves continuity.
- Look-at targets authored separately from camera position so the visitor can move past objects while attention stays intentional.
- FOV changes used sparingly for approach, lens entry, and exit; do not use FOV as a substitute for camera travel.
- Small roll changes only at motivated moments.
- Focus and depth-of-field tied to the current subject and disabled/reduced in low-quality and reduced-motion modes.
- Reversible timeline: scrolling backwards restores component positions, lighting, copy, and camera state without popping.
- Deep links/navigation shortcuts map to timeline ranges and still update semantic content and focus.

## 7. Content and admin direction

The content editor remains UFirst-only. It should eventually manage:

- hero and final CTA copy;
- section/service titles, descriptions, labels, and approved imagery;
- project titles, categories, descriptions, and approved media;
- scene labels and timeline captions;
- background/texture selections;
- asset status and replacement guidance.

The dashboard must not claim that a PNG is a 3D model. It should distinguish `3D model`, `scene texture`, `content image`, `fallback image`, and `temporary reference`. Until R2 is enabled, trusted URL replacement can remain a fallback, but the UI should clearly state that managed uploads are unavailable.

## 8. Performance plan

- Load the critical camera exterior and first-scene textures before the first frame.
- Lazy-load the exploded internals, work media, and later scene assets by timeline range.
- Use GLB compression (Draco or Meshopt where compatible) and KTX2/WebP/AVIF textures where the runtime supports them.
- Reuse geometry and materials; avoid per-frame allocations and React state updates.
- Cap DPR adaptively: target approximately 1.5 on desktop and approximately 1.1 on mobile, then reduce when frame time rises.
- Use one carefully sized shadow map, baked/soft lighting where appropriate, instancing for repeated screws/particles, and LODs for distant parts.
- Make post-processing conditional. Bloom, depth of field, chromatic effects, grain, and vignette must support the shot rather than obscure the camera.
- Dispose textures, materials, render targets, and scene groups when a range is no longer needed.
- Provide high/medium/low tiers and a reduced-motion tier while preserving the full content story.

## 9. Responsive behavior

Author separate desktop, tablet, and mobile camera paths. Do not simply scale the desktop composition.

Initial QA targets:

`1920×1080`, `1440×900`, `1366×768`, `1024×768`, `768×1024`, `430×932`, `390×844`, `375×812`.

Mobile requirements:

- natural page scrolling with no trapped touch gesture;
- shorter camera distances and safer FOV;
- less separation between exploded parts;
- reduced particle count, shadows, DPR, and post-processing;
- copy moved to safe readable zones;
- a clear static/fallback frame if WebGL is unavailable or too expensive.

## 10. Accessibility, SEO, and failure states

- Keep meaningful company copy in semantic HTML.
- Provide skip navigation, logical headings, visible focus states, keyboard-operable controls, alt text, and sufficient contrast.
- Respect `prefers-reduced-motion`; replace the journey with calm scene changes or a static sequence while retaining every important section.
- Provide a non-WebGL fallback with hero image, services, work, process, and contact content.
- Handle slow loading, model failure, texture failure, WebGL unavailability, and low-performance devices without a blank page.
- Preserve metadata, Open Graph fields, canonical page behavior, and crawlable UFirst content.

## 11. QA gate before deployment

The complete journey must be checked slowly, quickly, backwards, after refresh, across responsive sizes, and with reduced motion. Specifically verify:

- no black/blurry dead zone after lens entry;
- no content disappearing when the canvas loads;
- no camera snapping, object popping, z-fighting, or texture flicker;
- no section overlap or text collision;
- no scroll lock on touch devices;
- no console, hydration, shader, missing-asset, or 404 errors;
- sensible frame rate and quality-tier changes;
- direct navigation works without replaying the whole story.

## 12. Implementation order

1. Lock UFirst content and asset contracts.
2. Replace the current canvas-behind-sections composition with the persistent experience shell and semantic fallback.
3. Build/import the separated camera model and validate materials, pivots, scale, and lighting in isolation.
4. Implement the master timeline and camera rig.
5. Implement camera reveal, lens entry, exploded mechanism, and reassembly before adding secondary content.
6. Attach services, work, process, and CTA to scene ranges.
7. Add loading, fallback, reduced-motion, responsive paths, quality tiers, and keyboard navigation.
8. Extend the admin editor for scene content and asset types.
9. Perform browser QA and performance pass.
10. Build and deploy UFirst only after validation.

## 13. Definition of done

The rebuild is complete when a visitor can understand UFirst’s offer and reach contact without WebGL, while a capable device experiences one coherent, physical camera journey where the 3D world is the interface. The final implementation must document the actual model assets, temporary placeholders, performance decisions, responsive behavior, accessibility fallback, files changed, and remaining production requirements.

## 14. Current implementation record

- Persistent runtime: `app/components/cinematic/CinematicExperience.tsx` and `CinematicWorld.ts`.
- Production-format camera assets: `public/models/ufirst-camera-production.glb` and the 32,364-triangle mobile companion `public/models/ufirst-camera-mobile.glb`, both generated by `scripts/generate-ufirst-camera.mjs`; the loader verifies the named journey groups and uses the procedural model only if loading fails.
- Timeline and camera choreography: `camera-keyframes.ts`, `CameraRig.ts`, `ScrollDirector.ts`, and `scene-moments.ts`.
- Adaptive performance: `quality-tiers.ts`, capped renderer pixel ratio, reduced surface loading on low tier, and direct Three.js updates outside React state.
- Content management: `app/admin/AdminEditor.tsx` edits UFirst copy, chapter captions, backgrounds, services, project imagery, and scene surfaces. It also reports loaded image dimensions and recommended replacement sizes.
- Failure handling: static hero fallback, semantic content sections, loader progress from `LoadingManager`, and reduced-motion static framing.
- Validation completed: lint, production build, five unit/asset tests, GLB node/triangle inspection, local browser asset-load check, public browser smoke checks, desktop/mobile checks, editor route check, and clean reduced-motion check.

The implementation is not marked production-final until the generated camera receives its final photoreal surface texture set, LOD1/LOD2 variants, agency approval, and a production deployment validation using those final variants.
