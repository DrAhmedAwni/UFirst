# UFirst cinematic 3D asset inventory

Status: implementation checkpoint
Scope: UFirst only

The current experience uses original procedural Three.js geometry for the interactive camera. No third-party model or unlicensed GLB was downloaded. Raster images are used as approved UFirst content surfaces and fallback imagery; they are not used as the interactive camera body.

## Interactive geometry currently in the runtime

| Asset | Runtime source | Purpose | Current state |
| --- | --- | --- | --- |
| Camera body shell | `app/components/cinematic/CinematicWorld.ts` | Exterior reveal, silhouette, reassembly | Procedural, beveled, PBR materials |
| Lens housing and barrel | `CinematicWorld.ts` | Approach and lens-entry scale | Procedural concentric housing, focus ring, front glass |
| Aperture assembly | `CinematicWorld.ts` | Aperture passage and focus metaphor | Eight separated blades, iris, timing ring |
| Shutter assembly | `CinematicWorld.ts` | Production/execution chapter | Rails, blades, timing ring, screws |
| Sensor assembly | `CinematicWorld.ts` | Insight/work chapter | Frame, sensor plate, contacts, readout ring |
| Processor board | `CinematicWorld.ts` | Creative/process chapter | PCB, chips, traces, signal ring |
| Memory bay and card | `CinematicWorld.ts` | Carry-forward/data chapter | Bay, card, contacts, transfer ring |
| Viewfinder/exit module | `CinematicWorld.ts` | Reassembly and final frame | Rear module, ring, output signals |
| Physical content screens | `CinematicWorld.ts` | Services and work inside the camera | Three.js planes with metal frames and UFirst imagery |

## Content and fallback imagery

The source paths and current roles are recorded in `public/models/asset-manifest.json`. The existing `/public/assets/journey/` images are used for service/work surfaces. `/assets/camera/ufirst-camera-exterior-v2.png` remains the approved hero fallback when WebGL cannot run. The hero image is not mounted as a sprite in the active 3D world.

## Materials and lighting

- Body and mounts use `MeshPhysicalMaterial` with dark painted-metal/polymer values, clearcoat, and controlled roughness.
- Rings, screws, and rails use higher-metalness materials with separate roughness values.
- Optical elements use transmission, thickness, IOR, and restrained blue/teal emissive response.
- Sensor, PCB, copper contacts, buttons, and red UFirst accents are separate material families.
- Key, red accent, back, ambient, and lens-interior lights are authored in the same physical world.
- Post-processing is intentionally omitted from the current pass so the camera remains legible and the content stays readable.

## Runtime performance

- One persistent renderer and one scene are used for the full scroll journey.
- DPR is capped at approximately 1.5 on high desktop and 1.1 on mobile/low tiers.
- Low quality loads fewer service/work surfaces and keeps the story-critical geometry.
- Textures are loaded through `LoadingManager`; renderer and textures are disposed on teardown.
- No per-frame React state drives geometry; the scroll timeline updates Three.js objects directly.

## Required production upgrade

The procedural camera is a documented implementation model, not a final photorealistic production asset. A production camera GLB is still required at `public/models/ufirst-camera-production.glb` when the agency supplies or approves one. It must include the separated hierarchy, materials, pivots, LODs, and compression requirements in `docs/3D-ASSET-REQUIREMENTS.md`.

The runtime scene contract is already isolated so the approved GLB can replace the procedural groups without changing the content model, admin dashboard, scroll timeline, or semantic fallback.
