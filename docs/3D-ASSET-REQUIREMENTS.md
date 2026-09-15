# UFirst 3D Asset Requirements

Status: production specification  
Scope: UFirst only  
Purpose: define the assets required for a realistic, scroll-driven camera journey

## 1. Asset policy

The camera and other major scene objects must be actual 3D geometry. A generated PNG, exploded render, or flat sprite can support the story as a content surface or fallback, but it cannot be presented as the interactive camera model.

Every production asset must include source, license/ownership, dimensions, triangle count, texture memory, material notes, pivot names, LODs, and intended quality tier.

Preferred delivery format: GLB with embedded or explicitly documented textures. Use GLTF only when the delivery pipeline requires separate resources.

## 2. Priority matrix

| Priority | Asset | Needed for | Current status |
| --- | --- | --- | --- |
| P0 | Separated realistic camera model | Reveal, lens entry, exploded journey, reassembly | Original production-format GLB generated; photoreal texture/LOD polish pending |
| P0 | Camera material/texture set | Photorealistic product lighting | Required with model |
| P0 | Lens optical assembly | Entry transition and internal journey | Required as separated meshes |
| P0 | Internal camera mechanism | Storytelling through components | Required as separated meshes or approved simplified mechanism |
| P1 | Studio environment | Scale, lighting, reveal, exit | Can begin procedurally; production HDRI/environment later |
| P1 | Service scene objects | Spatial service identities | Can be procedural if designed and documented |
| P1 | Work display surfaces | Approved project proof | Existing project images can be mapped to real surfaces |
| P2 | Hero/finale alternate camera views | Fallback and social preview | Existing raster assets available |
| P2 | Atmospheric details | Depth and continuity | Procedural particles/lighting only where they support composition |

## 3. P0 — Realistic camera model

### NAME

UFirst hero camera / production camera system

### PURPOSE

Primary physical object and narrative device. It must read as a real professional camera before the visitor enters it, remain legible when exploded, and reassemble convincingly at the end.

### FORMAT

GLB preferred. GLTF acceptable. Include a clean hierarchy, named nodes, animation-ready pivots, and no hidden dependency on a DCC file at runtime.

### POLYGON TARGET

- Hero exterior: approximately 80k–180k triangles at high quality.
- Exploded/interior active parts: approximately 120k–260k triangles total at high quality.
- Medium tier: approximately 60% of high-tier geometry through LODs.
- Low tier: approximately 25–40% of high-tier geometry, preserving silhouette, lens, body, and all story-critical parts.

These are targets, not a reason to sacrifice silhouette or material quality. The final budget is confirmed after profiling on the target devices.

### TEXTURES

- 2K packed texture sets for hero-critical surfaces; 1K for secondary parts.
- Base color, normal, roughness, metalness, and ambient-occlusion maps only where each map materially improves the shot.
- KTX2/Basis or WebP/AVIF delivery variants where supported.
- No oversized 4K maps for small parts.
- Separate glass/optical textures or procedural physical materials for lens elements.

### MATERIALS

- Camera body: slightly rough black polymer or painted magnesium, fine normal detail, controlled clearcoat.
- Lens housing and rings: machined dark metal with realistic roughness variation.
- Lens glass: physically plausible transmission/refraction, IOR, thickness, subtle absorption, and controlled reflections.
- Aperture blades: dark coated metal with crisp edge highlights.
- Sensor: dark reflective surface with subtle iridescence, never a flat bright rectangle.
- Internal frame: matte and machined metals with distinct roughness values.
- PCB/processor: restrained green board, metal contacts, and no fake readable claims.
- Buttons/dials: separate tactile materials with different roughness and highlight response.

### ANIMATIONS

Animation can be runtime-driven or delivered as clips, but the parts must respond deterministically to the master scroll timeline:

- body shell open/close;
- lens barrel advance and retreat;
- lens group separation;
- aperture open/close;
- shutter reveal;
- sensor and processor separation;
- display/side panel separation;
- buttons and dials with minimal secondary motion;
- full reassembly in reverse order.

### PIVOT REQUIREMENTS

Use explicit pivots and documented local axes:

- `CameraRoot`
- `BodyShellPivot`
- `LensMountPivot`
- `LensBarrelPivot`
- `FocusRingPivot`
- `AperturePivot`
- `ShutterPivot`
- `DisplayPivot`
- `BatteryDoorPivot`
- `TopPlatePivot`

Parts that translate during the exploded view should have their rest transforms preserved in the export and be driven from authored offsets rather than guessed in the render loop.

### COMPONENT SEPARATION

The following named meshes are required or must have a documented equivalent:

- `CameraBody`
- `TopPlate`
- `BottomPlate`
- `InternalFrame`
- `LensHousing`
- `LensMount`
- `FrontLens`
- `LensGlass01`
- `LensGlass02`
- `LensGlass03`
- `FocusRing`
- `Aperture`
- `ApertureBlade01` through `ApertureBlade08` (or a justified count)
- `Shutter`
- `Sensor`
- `Processor`
- `MainBoard`
- `Display`
- `Battery`
- `Buttons`
- `Dials`
- `Viewfinder`
- `Grip`
- `ScrewsAndFasteners`

The exact node names may vary only if the mapping is documented in the asset manifest. One baked flattened camera mesh is not sufficient for the journey.

### LOD REQUIREMENTS

- LOD0: hero and close lens shots.
- LOD1: approach and reassembly.
- LOD2: distant reveal and final exit.
- Internal components can be unloaded or simplified outside the lens/exploded ranges.
- Preserve the lens silhouette, body outline, red UFirst accent, and story-critical separation at every tier.

## 4. P0 — Optical and internal realism

The camera interior must be designed for the actual journey, not merely copied from a flat exploded image.

Required visual decisions:

- front lens elements have visible thickness and controlled reflections;
- aperture blades are visible and animate cleanly;
- shutter and sensor read as distinct layers;
- processor/main board has depth, edge detail, and believable mounting;
- interior frame provides occlusion and scale;
- screws/fasteners are repeated through instancing or an efficient grouped mesh;
- component positions leave enough negative space for labels and camera travel;
- dark materials retain detail under low-key lighting.

If a fully accurate manufacturer camera cannot be licensed, build an original fictional professional camera inspired by real industrial design language. Do not use another brand’s recognizable logo, model number, or protected product markings.

## 5. P1 — Studio environment

### NAME

UFirst product studio / camera world

### PURPOSE

Give the camera believable scale and a continuous world for reveal, service scenes, work surfaces, and the final exit.

### FORMAT

Procedural geometry is acceptable for floor, walls, rails, plinths, light cards, and shadow catchers. Use GLB for hero environment props if their detail benefits from authored modeling.

### POLYGON TARGET

Keep the persistent environment under approximately 80k visible triangles on desktop and substantially lower on mobile. Use instancing for repeated structural details.

### TEXTURES / MATERIALS

- matte charcoal floor and walls;
- warm ivory or neutral reflective surfaces for content planes;
- UFirst red and restrained teal used as deliberate accents;
- no generic neon gradient room;
- optional HDRI or authored reflection capture with a lightweight fallback.

### ANIMATIONS / PIVOTS

Light cards, practical lights, doors/portals, and content surfaces need named transforms if they move with the timeline. The environment should remain spatially coherent as the camera travels.

## 6. P1 — Service identities

Services should be represented by physical or spatial objects with a clear role:

| Service story | Possible physical identity | Required outcome |
| --- | --- | --- |
| Brand & strategy | positioning grid, identity kit, lens/focus marker | visitor understands direction and clarity |
| Creative & content | storyboard, art-direction surface, campaign set | visitor understands idea and expression |
| Production | camera rig, light, clapper, set detail | visitor understands making and delivery |
| Digital / experiences | screen, interface surface, responsive device geometry | visitor understands digital execution |
| Media & growth | signal bars, audience rings, optimisation instrument | visitor understands measured momentum |

Procedural geometry is acceptable only when it has a deliberate physical identity and is not a random primitive collection. Existing UFirst artwork may be used as a surface or fallback until the physical service objects are produced.

## 7. P0 — Monumental threshold doors

### NAME

UFirst threshold door architecture

### PURPOSE

Create the physical transition between the optical camera interior and the UFirst agency world. The doors are a second memorable camera journey beat: the visitor approaches, sees a controlled warm light leak, watches both panels swing from real hinge pivots, and travels through the opening.

### FORMAT

Original runtime geometry is acceptable for the first production pass because the doors are a structural environment object, not a branded product asset. A later authored GLB may replace it without changing the `LeftDoorHingePivot` / `RightDoorHingePivot` scene contract.

### GEOMETRY / MATERIALS

- paired dark painted-metal panels with recessed rubber inset and machined vertical ribs;
- independent left/right panels with edge seals, frame columns, header, threshold, hinge fasteners, and depth behind the opening;
- warm emissive light leak and localized point light beyond the threshold;
- no logos, invented copy, or generic neon-grid decoration.

### PIVOTS / ANIMATION

- `LeftDoorHingePivot` at the left outer edge;
- `RightDoorHingePivot` at the right outer edge;
- closed state at the lens-entry handoff;
- panels open in opposite directions from approximately 0° to ±75° across the `door-open` range;
- passage completes only after the center is clear; reverse scroll closes the doors naturally.

### BUDGET

Keep the runtime door assembly below approximately 15k visible triangles on desktop and use the same geometry on mobile with capped pixel ratio and reduced lighting.

## 8. P1 — Work and content surfaces

### PURPOSE

Present approved UFirst work inside the environment while maintaining ownership and editability.

### FORMAT

Real 3D frames, displays, paper, lightboxes, or projection surfaces. Project images are textures/content, not the 3D objects themselves.

### REQUIREMENTS

- project surface must have real depth and edge treatment;
- media aspect ratio and crop are authored per project;
- title/category metadata remains available in semantic HTML;
- image loading is range-based and has a fallback poster;
- no invented metrics, clients, or outcomes;
- admin content model can replace approved project media without code changes.

## 9. P2 — Existing repository assets and their role

Current image assets include hero camera renders, camera exploded/exterior references, service artwork, process artwork, brand marks, and work/laptop imagery. Their role must be explicit:

- `camera/ufirst-camera-exterior-v2.png`: exterior visual reference/fallback, not the interactive model.
- `camera/ufirst-camera-exploded-v2.png`: exploded-view reference/fallback, not separated geometry.
- `camera/camera-cutaway-reference.png`: concept/reference only unless ownership and use are confirmed.
- `ufirst-agency-*.png`: agency/service content surfaces or fallback artwork.
- `journey/*.png`: journey reference/content surfaces; not substitutes for scene objects.
- `hero-camera-real.png`, `hero-camera.jpg`: hero/fallback/social support where appropriate.

Do not label any of these files as a real 3D camera in the admin dashboard.

## 10. Asset manifest requirements

Create a machine-readable manifest for production assets with:

```text
id
name
kind: model | texture | environment | fallback | reference
path
source
license
triangleCount
textureMemory
materials
lods
pivots
components
timelineRanges
desktopReady
mobileReady
status
```

`status` should support `required`, `in-progress`, `approved`, `temporary`, and `retired`.

## 11. Acceptance tests for the camera asset

Before wiring the full journey, verify:

- the exterior reads as a physical professional camera from three-quarter and front views;
- lens glass, barrel, aperture, shutter, sensor, processor, body shell, and internal frame can be addressed independently;
- all pivots produce predictable motion in local coordinates;
- the camera can explode and reassemble without intersections or snapping;
- materials remain legible under low-key lighting;
- LODs preserve the silhouette and critical component identity;
- model loads without a missing-texture or shader error;
- the model can be framed at desktop, tablet, and mobile aspect ratios;
- the asset has no unapproved logos, watermarks, fake client marks, or invented text.

The current generated assets pass the structural portion of this gate: `public/models/ufirst-camera-production.glb` is 81,288 triangles, `public/models/ufirst-camera-mobile.glb` is 32,364 triangles, and `public/models/ufirst-camera-distant.glb` is 23,288 triangles. All three expose the required named components and pivots, load through `GLTFLoader` in the local browser, and contain no external texture dependency. Photoreal surface validation and agency visual approval remain open.

## 12. Temporary asset policy

If a required production asset is unavailable during implementation, use a clearly documented temporary asset only to keep the scene testable. The implementation must record:

- the exact temporary file;
- why it is temporary;
- the production replacement required;
- which scene ranges are affected;
- whether the temporary asset is safe for launch.

The final experience is not considered complete while a major camera part is represented only by a flat image or an unexplained primitive.
