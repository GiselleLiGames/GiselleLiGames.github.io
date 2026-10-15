# OC companion assets

## Website rig v2

The homepage now mounts the companion in `#animeFeatured`, replacing the former featured-work circle. Project entries remain in the portfolio list. The art overflows the upper ring, while a circular lower mask and a foreground ring hide the torso edge.

- `oc-sclera-v2.png`: neutral character with complete eye whites and no irises.
- `oc-iris-v2.png`: a single transparent iris/pupil texture, used independently for both eyes.
- `oc-companion.css` and `../../js/oc-companion.js`: portal composition, masked pupil tracking, procedural eyelids, spring-driven body/head/hair motion, isolated thumb motion, click reaction, idle state, and entry animation.
- `../../js/oc-mesh.js`: a continuous 40 × 36 WebGL mesh with head yaw/pitch, body counter-rotation, chest breathing, controller motion, independently delayed braid/ahoge movement, and overshooting entry. A lower-density Canvas 2D renderer runs at 24 fps if WebGL is unavailable. Shared vertices keep the neck and hair attached without cut-layer gaps. The output has 112 pixels of transparent headroom to protect moving hair tips.
- `oc-idle-v1.png`: complete static fallback while loading, or if rig images fail.
- `rig-v2-prompts.md`: exact generation prompts used with the built-in image_gen tool.

Tracking smooths over about 85 ms and clamps each pupil inside its eye aperture. A project-selection event (`anime:preview`) triggers a 480 ms downward glance and thumb press. Clicking the face closes the eyes into a smile and adds blush for 420 ms; repeated clicks extend the reaction to 700 ms. Entry is a 620 ms jump with about 92 source pixels of overshoot, slight stretch and landing compression, timed to the opening intro panels. Spring motion and breathing run about 35–40% faster than the initial mesh version. The face hover caption has been removed. After 16 seconds without input, the eyes relax. Reduced motion shows the neutral pose. Animation pauses offscreen, in a hidden tab, during focused text entry, and while the project dialog is open. The original v1 atlas is not used by the live rig.

The source texture and all deformations use one coordinate system. Spring motion follows different timing for the body, head, left braid, right braid and ahoge. The shoulder/chest area breathes while the controller floats slightly between the hands. This is a lightweight procedural 2D rig rather than a Cubism model: it supports modest frontal turns; reaching, face-covering, loading-bar pulling and full side-switching still require extra artwork.

## Original v1 illustrations

Generated with the built-in image_gen tool from the user-supplied character reference.

- `oc-idle-v1.png`: neutral controller-holding base illustration, actual alpha transparency.
- `oc-actions-atlas-v1.png`: eight action key poses, arranged in four columns and two rows, actual alpha transparency.

Pose order, left to right, top to bottom: blink; controller input; puffed cheeks; cover face/peek; edge peek; reach for cursor; sleepy rest; controller celebration.

These are prototype illustrations, not finished rigged animation assets. The generated atlas has varying pose bounds and imperfect gutters: do not assume exact equal-cell cropping without visual adjustment. The website uses the v2 rig described above instead.

## Neutral pose prompt

Use case: identity-preserve. Asset type: transparent PNG base illustration for a small website edge companion. Input image 1 is the character identity and style reference. Recreate ONLY the same chibi character in a clean high-resolution waist-up front view, both hands holding the same dark game controller at chest height. Preserve the very large magenta pink eyes with peach highlights, pale pink bob and two long braided pigtails with mauve shadow tips, single curved ahoge, cheerful open mouth, blush, dark oversized t-shirt with red cartoon monster graphic, proportions and soft anime painted linework. Keep the full ahoge, both braids and their tips, both arms, controller and upper torso fully inside the canvas with transparent padding on every side. Calm symmetrical upright seated implied posture, warm friendly expression, pupils looking straight ahead. Improve clarity of the low-resolution reference without changing costume, character design or age/proportions. No background, no black backdrop, no floor, no UI, no text, no watermark, no logo lettering, no labels. Actual alpha transparency around the character and through gaps. One character only. This is the neutral anchor pose for subsequent action variants.

## Action atlas prompt

Use case: identity-preserve. Asset type: ONE transparent PNG sprite atlas for website companion prototype, exactly 4 equal columns by 2 equal rows, eight separate waist-up poses of the SAME character. Input image 1 is original OC identity; input image 2 is the approved clean neutral model; match its face, linework, proportions, pale pink bob, long pink-to-mauve twin braids, magenta eyes, curved ahoge, dark oversized red-monster t-shirt and black handheld controller exactly. Transparent background throughout, no checkerboard drawing, no panels, no borders, no labels, no numbers, no text, no watermarks, no environment. Every cell has equal dimensions; align characters to the SAME scale, head size, central x position and baseline, with generous transparent gutters and padding; nothing overlaps adjacent cells; include braid tips and hair completely. Read left to right, top row then bottom row: (1) gentle blink, both eyes CLOSED, relaxed smile, both hands holding controller at chest; (2) looking DOWN at controller while thumbs press buttons, focused little mouth; (3) cute puffed cheeks, eyes open looking at viewer, controller held at chest; (4) BOTH hands covering face, one magenta eye PEEKING through fingers, controller lowered into lap; (5) peeking upward from an implied UI edge with BOTH hands gripping the invisible horizontal edge below chin, no actual edge drawn, curious expression, controller absent; (6) one hand holding controller against body and the other reaching forward and upward toward an invisible cursor, curious wide eyes, no cursor drawn; (7) sleepy resting chin on folded forearms along an invisible panel edge, eyes half closed, slightly drooping ahoge, no controller visible; (8) HAPPY celebration, both hands lift controller above forehead, bright eyes and delighted smile, controller and arms fully inside cell. All eight are the same character at consistent size, artwork finished, crisp soft anime illustration. This is an atlas of discrete animation key poses, not a comic and not a scene. Actual alpha transparency.

