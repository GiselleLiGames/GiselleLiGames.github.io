# Dream Gallery redesign

The visual references are `Portfolio Dream Gallery.dc.html` and
`Work Detail - Casino v3.dc.html`, supplied on 2026-10-15.

- `assets/entry/dream-gallery.css` defines the shared cream / antique gold palette,
  IM Fell English and Noto Serif SC typography, gallery and detail layouts, and
  responsive adjustments. Resume and Contact inherit the shared visual language.
- `js/dream-gallery.js` renders the collection from `CONFIG.works`, including
  category counts, URL filters, bilingual labels and return scroll position.
- `assets/scene/` contains compressed WebP versions of the supplied dream garden
  backplate, flowers, curtains, shrubs and pendants from the matching
  `universal-bg-layers` source set. Their layout uses the reference coordinates.
  The reference spring motion, layered parallax and petals respect reduced motion
  preferences. There is no added scroll dimming. The export references a separate
  arch-flower cutout that was not supplied, so the original backplate flower is
  retained as a static detail.
- `js/dream-preview.js` opens the complete case study directly in a native dialog.
  There is no intermediate preview or second project-details click. The dialog
  and direct `work.html` URLs both mount the shared `DreamWork` renderer.
  The `work` query parameter supports refresh, browser Back/Forward and sharing.
  Opening it hides the underlying navigation, introduction and collection while
  keeping the scene visible. Closing restores the same filter and scroll position.
- `js/dream-work.js` renders all seven works from the existing configuration.
  The main video appears once at the top; additional videos and images retain
  their captions and descriptions. Existing case-study chapters and PDF links
  remain available. Image dialogs support zoom, pan, keyboard controls and focus
  restoration.
- `js/dream-navigation.js` groups the three navigation links and language switch
  at the horizontal center on Gallery, Resume and Contact.
- `assets/entry/dream-pages.css` keeps the original Resume and Contact layouts,
  sharing only the animated scene, palette and centered navigation. The redundant
  Resume contact CTA is removed; contact is available in the top navigation.
- `index.html` opens the gallery directly. Legacy `project.html?id=…` links route
  to the corresponding `work.html?id=…` page, preserving query and hash values.

The reference's simulated wireframe / lighting / albedo peeling section is
deliberately omitted. No authentic render passes were supplied for it, and it
does not serve the current collection. The older opening curtain and click
sparks are not used by the redesigned gallery.

No build step or external UI runtime is required. Serve the repository with a
static HTTP server to preview. Content continues to live in `config.js`.

Validation: desktop and phone browser checks, all seven work routes, Chinese /
English switching, category filtering, graph zoom / Escape / focus restoration,
pointer panning, wheel zoom, double-click reset, native video playback,
  exact reference geometry for the hero and opening detail sections, and
  JavaScript syntax and Git whitespace checks.
