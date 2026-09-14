# UFirst cinematic 3D asset inventory

The current production scene is built from original procedural Three.js geometry. No third-party models or unlicensed GLB files were downloaded.

## Production geometry

| Asset | Source | Geometry | Runtime treatment |
| --- | --- | --- | --- |
| Fictional cinema camera | Original procedural model | Beveled body, rails, handle, monitor, vents, lens barrel, rings, matte box | Real depth, PBR materials, contact shadows, animated indicator |
| Lens and aperture | Original procedural model | Cylindrical optical groups, physical glass, eight extruded aperture blades | Focus-ring movement and scroll-driven aperture opening |
| Monumental doors | Original procedural architecture | Thick wall, frame, two leaves, three hinge barrels per leaf, threshold, foreground structure | Correct left/right hinge pivots, weighted opening, light leak |
| UFirst brand sculpture | Original procedural geometry | Extruded and beveled U mark | Studio platform with red/teal lighting |
| Studio world | Original procedural environment | Floor, side walls, ceiling, production table, softbox, light sources | Spatially ordered production environment |
| Devices and displays | Original procedural geometry | Physical phone, monitor/display frames, stands, billboard surfaces | Supplied UFirst imagery appears only as screen content |
| Growth station | Original procedural geometry | Display frame, dimensional bars, base | Service-world performance focus |

## Image content

The supplied and generated PNG/JPEG files remain content assets and screen surfaces. They are not treated as the camera, doors, or other major physical models.

## Performance targets

- Device pixel ratio: max 1.5 desktop, max 1.1 mobile.
- Shadows: one 1024px directional shadow map on desktop; disabled on mobile.
- Mobile: fewer aperture blades and reduced service-camera scale.
- Screens: loaded through `LoadingManager`, with the cinematic fallback photograph remaining available.
- WebGL failure: the HTML copy and static hero image remain usable.

## Future GLB upgrade path

If production modeling moves to Blender, the procedural camera, lens, door, and studio groups can be replaced behind the same scene update contract. Approved assets should be exported as GLB, normalized to one world unit per meter, assigned explicit pivot names, and documented with license, triangle, texture, LOD, and compression data before inclusion.
