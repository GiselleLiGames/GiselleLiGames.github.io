(function () {
  'use strict';

  var proof = document.querySelector('.proof');
  if (!proof) return;

  var chapters = [
    {
      number: '02', title: 'Background & Why',
      left: {
        kicker: 'Research / Visual Language', title: 'Background', image: 'spread-2-left-visual.jpg',
        lead: '<strong>Source inspiration.</strong> The project begins with the visual language of Fumito Ueda: quiet ruins, moss-covered stone, a cave-like entrance and a transparent green atmosphere.',
        bullets: ['Extract the temple, stone, moss, water and light as reusable visual components.', 'Replace reference materials with a self-authored shader system.', 'Keep the palette focused on brown-yellow walls, deep shadow and pale green light.']
      },
      right: {
        kicker: 'Motivation / Practice', title: 'Why This Project', image: 'spread-2-right-visual.jpg',
        lead: '<strong>The material becomes the narrator.</strong> Instead of treating shaders as isolated exercises, this project tests them together inside one art-directed scene.',
        bullets: ['Apply three months of ShaderLab study to PBR, foliage, water and translucent materials.', 'Use scene integration to expose real production problems that do not appear in isolated tests.', 'Compare the approach with customized PBR workflows observed in production projects such as Tower of Fantasy.']
      }
    },
    {
      number: '03', title: 'Scene Conception & Build Process',
      left: {
        kicker: 'World Building / Key Items', title: 'Scene Conception', image: 'spread-3-left-visual.jpg',
        lead: '<strong>Six scene anchors</strong> define the composition before technical work begins.',
        bullets: ['Mist permeates the scene and catches refracted light.', 'An angel sculpture becomes the emotional focal point.', 'Temple ruins, forest plants and ancient stone establish age and scale.', 'Water completes the path through the space and reflects the light gap.', 'A Stable Diffusion sketch was used only to explore the first composition.']
      },
      right: {
        kicker: 'Pipeline / Iteration', title: 'Setting Up the Scene', image: 'spread-3-right-visual.jpg', process: true,
        bullets: ['Collect and import Fab assets into Unreal Engine 5.5.', 'Transfer selected assets into Unity.', 'Adjust overall lighting and diagnose import errors.', 'Replace stock materials with self-authored shaders.', 'Add baked GI and ShadowMap support to the PBR framework.', 'Fine-tune shaders, materials and lighting as one system.']
      }
    },
    {
      number: '04', title: 'Sculpture & Ice Material',
      left: {
        kicker: 'Technical Details / Sculpture', title: 'White Model Study', image: 'spread-4-left-visual.jpg',
        lead: '<strong>The statue is the lighting reference.</strong> A white-model pass isolates silhouette, value structure and screen-space distortion before surface styling.',
        bullets: ['Start from a clean opaque model to confirm shape and focal hierarchy.', 'Move toward a semi-transparent ice response.', 'Use screen color to build controlled refraction through the sculpture.']
      },
      right: {
        kicker: 'Technical Details / Shader', title: 'Ice Shader', image: 'spread-4-right-visual.jpg',
        lead: '<strong>Layered construction</strong> keeps the ice readable while preserving transparency.',
        bullets: ['Create object-space variation from the model position and normal direction.', 'Generate a compatible normal treatment for the MatCap layer.', 'Combine translucent rendering, refraction and rim response.', 'Calibrate the final material against the environment rather than a neutral test sphere.']
      }
    },
    {
      number: '05', title: 'PBR, Foliage & Water',
      left: {
        kicker: 'Technical Details / BRDF', title: 'PBR Shader', image: 'spread-5-left-visual.jpg',
        lead: '<strong>A reusable PBR framework</strong> supports ordinary opaque objects before specialized materials are added.',
        bullets: ['Implement BRDF plus image-based lighting with energy conservation.', 'Compare the self-written response against Unity URP.', 'Separate direct and indirect diffuse/specular contributions for debugging.', 'Extend the framework into a foliage PBR shader with reverse spherical harmonics and transmission.']
      },
      right: {
        kicker: 'Technical Details / Motion', title: 'Scattering & Wind', image: 'spread-5-right-visual.jpg',
        lead: '<strong>Foliage must react to both light and weather.</strong> Backlighting produces transmission while the vertex stage drives directional motion.',
        bullets: ['Add a controllable scattering effect for backlit leaves.', 'Replace simple stacked sine/cosine motion after it produced uniform shaking.', 'Adopt an islanding-crisis style wind model with main bend, detail deformation, frequency and strength controls.', 'Use the same scene to begin the water shader study.']
      }
    },
    {
      number: '06', title: 'Water, Fog & Editor Tools',
      left: {
        kicker: 'Technical Details / Water', title: 'Water Shader', image: 'spread-6-left-visual.jpg',
        lead: '<strong>Surface motion evolved from flow maps to FFT data.</strong> The change gives the water a more dimensional height structure.',
        bullets: ['Bake ocean normal and height information and sample both in the shader.', 'Distort screen UVs for refraction while protecting geometry above the waterline.', 'Add reflection and scene-color capture for environmental coherence.', 'Build volumetric light and fog with ray-AABB intersection, ray marching, step sampling and 3D noise.']
      },
      right: {
        kicker: 'Production Support / C#', title: 'Editor Tools Used', image: 'spread-6-right-visual.jpg',
        lead: '<strong>The shader interface is part of the artwork pipeline.</strong> As parameters increased, custom tools kept iteration practical.',
        bullets: ['Create a custom ShaderGUI that groups features and hides unused parameters.', 'Capture scene colors through C# for refraction and reflection workflows.', 'Build a batch scene-management window.', 'Add one-click light renaming by type and reusable material-property controls.']
      }
    },
    {
      number: '07', title: 'Final Synthesis & Reflection',
      left: {
        kicker: 'Final / Rendering', title: 'Scene Synthesis', image: 'spread-7-left-visual.jpg',
        lead: '<strong>The final frame is assembled in inspectable layers</strong> rather than treated as a single beauty pass.',
        bullets: ['Direct specular reflection.', 'Indirect specular reflection.', 'Direct diffuse reflection.', 'Indirect diffuse reflection.', 'Volumetric light, ACES, bloom, color adjustment and SSAO complete the synthesis.']
      },
      right: {
        kicker: 'Final / Review', title: 'Summary & Feedback', image: 'spread-7-right-visual.jpg',
        lead: '<strong>Goal-driven learning exposed production constraints.</strong> Semi-transparent and opaque objects required different debugging and optimization strategies.',
        bullets: ['Scene-level integration revealed problems that isolated shader studies concealed.', 'A general shader is useful for team adoption, but style-specific scenes still need targeted variants.', 'Performance and parameter planning must begin earlier in the next iteration.', 'The finished scene now serves as both an artwork and a reusable technical foundation.']
      }
    }
  ];

  function pageMarkup(page, side, number) {
    var listClass = page.process ? 'process-list' : '';
    return '<article class="page editorial-page" data-page="' + number + (side === 'left' ? 'L' : 'R') + '">' +
      '<header class="editorial-head"><div><p class="editorial-kicker">' + page.kicker + '</p><h3>' + page.title + '</h3></div><span class="editorial-index">' + number + '</span></header>' +
      '<div class="editorial-visual"><img loading="lazy" src="assets/uploads/rebuild/pbr/' + page.image + '" alt="' + page.title + ' visual study"></div>' +
      '<div class="editorial-copy' + (page.process ? ' wide-copy' : '') + '">' + (page.lead ? '<p>' + page.lead + '</p>' : '') +
      '<ul class="' + listClass + '">' + page.bullets.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul></div></article>';
  }

  proof.insertAdjacentHTML('beforebegin', chapters.map(function (chapter) {
    return '<section class="rebuild-chapter"><p class="chapter-label">PDF Spread ' + chapter.number + ' · ' + chapter.title + '</p>' +
      '<div class="spread">' + pageMarkup(chapter.left, 'left', chapter.number) + pageMarkup(chapter.right, 'right', chapter.number) + '</div>' +
      '<p class="chapter-note">Two independent responsive pages · native HTML text and CSS layout</p></section>';
  }).join(''));
})();
