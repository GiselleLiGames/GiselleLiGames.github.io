/* Hand-arranged case studies. Original layout preserved; source coverage reconciled. */
window.CURATED_CASE_STUDIES = {
  "5": [
    {
      "id": "laputa",
      "title": {
        "zh": "Laputa · 天空之城",
        "en": "Laputa"
      },
      "cover": "assets/uploads/figma/source/34283f9c9a5d75f7215bd873871b4c66c16bfd71.webp",
      "kicker": "Individual Project · Full-pipeline stylized scene · PCG + Substance Designer",
      "links": [
        {
          "href": "https://www.youtube.com/watch?v=pp-lyCpy6qE",
          "title": {
            "zh": "项目视频",
            "en": "Project video"
          }
        }
      ],
      "sections": [
        {
          "h": "",
          "sub": "",
          "text": "This project draws inspiration from the \"Laputa's cabin\" in Hayao Miyazaki's Castle in the Sky. I translated 2D hand-painted aesthetics into a real-time 3D rendered environment while exploring the full-cycle technical implementation of Procedural Content Generation (PCG).\nUsing Substance Designer, I developed 3 material maps based on the original art. Additionally, with Houdini, I created parametric tools that enable one-click generation of stylized brick walls, spline-based stone wall creation, and layered mountain terrain via HeightField systems—greatly accelerating the efficiency of scene iteration.\nWithin Unreal Engine 5, I applied custom Toon Shaders, vertex-color materials, and Runtime Virtual Texturing (RVT) techniques to enhance the simplicity of colors and the abstraction of lighting, thus recreating Studio Ghibli's distinctive soft visual style.",
          "images": []
        }
      ]
    },
    {
      "id": "inspiration",
      "title": {
        "zh": "灵感与风格化材质",
        "en": "Inspiration & Stylized Materials"
      },
      "sections": [
        {
          "h": "Inspiration — Why?",
          "sub": "",
          "text": "This project originated from my long-time admiration for Hayao Miyazaki's works. When I saw this image of Laputa's home in Castle in the Sky, its palette reminded me of the tones I love in ICO, yet it was rendered in a stylized manner—which inspired me to give it a try. At the same time, I noticed that many of its assets involved foundational workflows created with Houdini HDAs, so I also wanted to use this as an opportunity to practice hands-on Houdini development.",
          "images": [
            {
              "src": "assets/uploads/figma/source/3febad7d14ac84184a8229ec58f174678143b383.webp",
              "w": 1200,
              "h": 1714,
              "cap": "Castle in the Sky"
            },
            {
              "src": "assets/uploads/figma/source/98da3b738a047ec08a22d7ebbb2da4c95f3e7089.webp",
              "w": 480,
              "h": 288,
              "cap": "Reference"
            },
            {
              "src": "assets/uploads/figma/source/5922163136128a1a3d5a081f700d9f97aab1f8f5.webp",
              "w": 665,
              "h": 375,
              "cap": "Reference"
            },
            {
              "src": "assets/uploads/figma/source/9160fbfb4e4fda4495760fe5ff0d4c96d412ca3e.webp",
              "w": 480,
              "h": 637,
              "cap": "Reference"
            }
          ]
        },
        {
          "h": "Brick Wall Material",
          "sub": "Slope Blur Edge Wear + Flood Fill + Curvature Edge Highlights",
          "text": "",
          "images": [
            {
              "src": "assets/uploads/figma/source/7995910e6b4d85285ca38c793dddc3d57c00a032.webp",
              "w": 603,
              "h": 314,
              "cap": "Reference"
            },
            {
              "src": "assets/uploads/figma/source/86a604058781cf2252e1822ab927e1aff0f623e8.webp",
              "w": 2048,
              "h": 1102,
              "cap": "Substance Designer graph"
            },
            {
              "src": "assets/uploads/figma/source/656a0230940e395610f24be6195ebba9a84bf01e.webp",
              "w": 2048,
              "h": 1152,
              "cap": "Result"
            }
          ]
        },
        {
          "h": "Wooden Plank Wall Material",
          "sub": "Directional Warp Grain Generation + Tile Generator + Height-Based Moss Mask",
          "text": "",
          "images": [
            {
              "src": "assets/uploads/figma/source/e212d52a431beb925dda7043c424ea1f0f2dc001.webp",
              "w": 543,
              "h": 282,
              "cap": "Reference"
            },
            {
              "src": "assets/uploads/figma/source/c64aed6e9de9c0fc44989c8c732dc68b241099a5.webp",
              "w": 731,
              "h": 380,
              "cap": "Reference"
            },
            {
              "src": "assets/uploads/figma/source/0265dc6c2c938f29e38cfd26dc5bb04d9848ca17.webp",
              "w": 2048,
              "h": 1102,
              "cap": "Substance Designer graph"
            },
            {
              "src": "assets/uploads/figma/source/e051fc1ba081aecb3f179cf3ab59b7ad5da377b8.webp",
              "w": 2048,
              "h": 1152,
              "cap": "Result"
            }
          ]
        },
        {
          "h": "Eaves Material",
          "sub": "Tile Sampler + Flood Fill",
          "text": "",
          "images": [
            {
              "src": "assets/uploads/figma/source/53609f97e6d468981c45543034d0006c3d408da6.webp",
              "w": 1041,
              "h": 576,
              "cap": "Reference"
            },
            {
              "src": "assets/uploads/figma/source/1ab405c35fa4c05485677fdce445686fa896085a.webp",
              "w": 2048,
              "h": 1102,
              "cap": "Substance Designer graph"
            },
            {
              "src": "assets/uploads/figma/source/9fe6b1d533e666b398e7d2258414fce3492415cf.webp",
              "w": 2048,
              "h": 1152,
              "cap": "Result"
            },
            {
              "src": "assets/uploads/figma/source/507046b7df23e2c4090605a135e7dcb108a4ee09.webp",
              "w": 1644,
              "h": 1338,
              "cap": "In scene"
            }
          ]
        },
        {
          "h": "Brushstroke Touches",
          "sub": "",
          "text": "Finally, I added a few brushstroke touches to enhance the stylized feel—a technique I carried over from experience on another game project.",
          "images": [
            {
              "src": "assets/uploads/figma/source/5ad5d0c7332b9e71e9bb633f0b4fa15810e1945a.webp",
              "w": 2048,
              "h": 1460,
              "cap": "Brushstroke graph"
            },
            {
              "src": "assets/uploads/figma/source/8c99b219348bd43a43b8562ca7d2a09cd615ec25.webp",
              "w": 1728,
              "h": 1730,
              "cap": "Brushstroke texture"
            },
            {
              "src": "assets/uploads/figma/source/f2b3b700432f23ef7a84f97b78fc9f08e18fb2a8.webp",
              "w": 2048,
              "h": 1152,
              "cap": "From another project"
            }
          ]
        }
      ]
    },
    {
      "id": "brick-wall",
      "title": {
        "zh": "Houdini 程序化砖墙",
        "en": "Houdini Procedural Brick Wall"
      },
      "sections": [
        {
          "h": "House Brick Wall",
          "sub": "Procedural feature",
          "text": "Users only need to place two cubes—one to generate a brick wall based on Cube 1's transform, and another to create a door based on Cube 2's transform. When the material texture of the wall is modified, the wall model updates accordingly. It streamlines the workflow by eliminating the need for manual modeling of complex brick walls.\nParameters — Bricks: Brick Tile Scale, Brick Height. Door: Has Door, Door Bevel Distance, Door Bevel Division, Door Width. Top Edge: Top Edge Width, Top Edge Scale.",
          "images": [
            {
              "src": "assets/uploads/figma/source/eb7f19e7d45e90dba253b3338293b06fdc54c76e.webp",
              "w": 2048,
              "h": 1171,
              "cap": "Generated wall"
            },
            {
              "src": "assets/uploads/figma/source/917ed68d3d2146560cca052a958608feec872c52.webp",
              "w": 1821,
              "h": 1905,
              "cap": "Node network",
              "detail": true
            },
            {
              "src": "assets/uploads/figma/source/ba1aa7046535502fcf0427b275950a15d00b6f48.webp",
              "w": 752,
              "h": 807,
              "cap": "Brick parameters",
              "detail": true
            },
            {
              "src": "assets/uploads/figma/source/1571bd99bbb5ac3896cdfecf31d5bfcda4de6325.webp",
              "w": 752,
              "h": 807,
              "cap": "Door parameters",
              "detail": true
            },
            {
              "src": "assets/uploads/figma/source/913b5bbd72419d60b3a248e1c2ef4fa4d3e51962.webp",
              "w": 752,
              "h": 807,
              "cap": "Top-edge parameters",
              "detail": true
            }
          ]
        },
        {
          "h": "Production Process",
          "sub": "",
          "text": "I used the brick material created in Substance Designer, then converted it into a model mesh by applying Attribute from Map and Poly Reduce.",
          "images": [
            {
              "src": "assets/uploads/figma/source/42393161f211c073c164f3109766eecc77962cd7.webp",
              "w": 2048,
              "h": 1171,
              "cap": "Mesh from SD material"
            },
            {
              "src": "assets/uploads/figma/source/9279286791c6a94182f4fed432375bddc5f7d25f.webp",
              "w": 852,
              "h": 768,
              "cap": "Nodes"
            }
          ]
        },
        {
          "h": "Advanced Workflow",
          "sub": "",
          "text": "I used Blast to extract specific faces of a cube, Boolean to cut out the door opening, and finally Sweep to generate the door frame, top trim, and related structural details.",
          "images": [
            {
              "src": "assets/uploads/figma/source/ec2433f56740f182e2dfc38fe714767fd8c88cdf.webp",
              "w": 2048,
              "h": 1171,
              "cap": "Boolean door"
            },
            {
              "src": "assets/uploads/figma/source/55ccfee778af87bee7f561d728fd3f58607bb6d0.webp",
              "w": 2048,
              "h": 1171,
              "cap": "Door curve"
            },
            {
              "src": "assets/uploads/figma/source/40eaf24973592924a377c15f9383dc58843d53dc.webp",
              "w": 2048,
              "h": 1171,
              "cap": "Sweep frame"
            },
            {
              "src": "assets/uploads/figma/source/d2302bfdfddd29d20104ffb24859a5181739c34e.webp",
              "w": 1026,
              "h": 969,
              "cap": "Nodes",
              "detail": true
            }
          ]
        },
        {
          "h": "Preview Mode Set",
          "sub": "",
          "text": "I separated performance-intensive nodes using a Switch, allowing users to adjust parameters in Preview Mode first, then toggle the FinalResult button to view the final outcome.",
          "images": [
            {
              "src": "assets/uploads/figma/source/b0a52b4fe2ae6c7703f56cf51e587da05c99e12c.webp",
              "w": 2048,
              "h": 1171,
              "cap": "Preview mode"
            },
            {
              "src": "assets/uploads/figma/source/a7611f25e5b03b59e5829abb8c9997bfcac65ce2.webp",
              "w": 2048,
              "h": 1171,
              "cap": "Final result"
            }
          ]
        },
        {
          "h": "Using House Brick Walls in Unreal Engine",
          "sub": "",
          "text": "",
          "images": [
            {
              "src": "assets/uploads/figma/source/8fff1abcbc6cfb997d452dc50c383c85807a92a4.webp",
              "w": 1920,
              "h": 1040,
              "cap": "Debugging position and shape in Preview Mode"
            },
            {
              "src": "assets/uploads/figma/source/381487cf63b5963c450bed030ffc2c86f37c879c.webp",
              "w": 1920,
              "h": 1040,
              "cap": "Click Is Final Result to generate the actual model"
            }
          ]
        }
      ]
    },
    {
      "id": "stone-wall-mountains",
      "title": {
        "zh": "程序化石墙与山体",
        "en": "Procedural Stone Wall & Mountains"
      },
      "sections": [
        {
          "h": "Foreground Stone Wall",
          "sub": "Parameters",
          "text": "The wall's overall length, width, and height can be adjusted, along with the individual stone's length, width, height, and the degree of weathering or breakage.",
          "images": [
            {
              "src": "assets/uploads/figma/source/121e068310361f2c3a4b343a142a783c397fab8b.webp",
              "w": 2048,
              "h": 1046,
              "cap": "Stone wall"
            },
            {
              "src": "assets/uploads/figma/source/571c764278075bd22d874faf9d66eb5bbe9f0e41.webp",
              "w": 1229,
              "h": 711,
              "cap": "Parameters"
            }
          ]
        },
        {
          "h": "For Loop per Stone",
          "sub": "",
          "text": "Use For Loop to modify parameters for each stone.",
          "images": [
            {
              "src": "assets/uploads/figma/source/54ae6d4957170e067f40c121360422ec4e5c1915.webp",
              "w": 2048,
              "h": 1453,
              "cap": "Per-stone variation"
            },
            {
              "src": "assets/uploads/figma/source/7caba5d8d0b0df55104df61614b9dd8cbe161a82.webp",
              "w": 1356,
              "h": 1272,
              "cap": "For Loop nodes"
            }
          ]
        },
        {
          "h": "Key Node: Point Wrangle",
          "sub": "",
          "text": "Using Point Wrangle to script a pattern: modify the point positions of odd-numbered primitives based on the vector between adjacent points and a given length, then add extra points and polylines. This enables staggered placement of stones.",
          "images": [
            {
              "src": "assets/uploads/figma/source/a82a1fd3899af1baa3b6694895ba960c8eca816d.webp",
              "w": 2048,
              "h": 1342,
              "cap": "Staggered points"
            },
            {
              "src": "assets/uploads/figma/source/a0b582fd8566f85dee9f5e6a20a7d8d1744a4035.webp",
              "w": 1185,
              "h": 1737,
              "cap": "VEX & nodes"
            }
          ]
        },
        {
          "h": "Using Foreground Stone Walls in Unreal Engine",
          "sub": "",
          "text": "",
          "images": [
            {
              "src": "assets/uploads/figma/source/dd1df28a060715e2d7b46633a4e112ee03de7aa3.webp",
              "w": 1920,
              "h": 1080,
              "cap": "Drag / adjust spline"
            },
            {
              "src": "assets/uploads/figma/source/5e4404fbaf50b386a26bb96ce3a434d016ba66e9.webp",
              "w": 1449,
              "h": 864,
              "cap": "Spline in scene"
            },
            {
              "src": "assets/uploads/figma/source/4d9b5a7bf9f4839f98b2836b1155a54462ca6b75.webp",
              "w": 1029,
              "h": 565,
              "cap": "Adjust the effect in Preview Mode"
            }
          ]
        },
        {
          "h": "Background Mountain Range",
          "sub": "",
          "text": "Use various nodes to sculpt the overall form, then enhance it with a HeightField Erode node and auto-coloration.",
          "images": [
            {
              "src": "assets/uploads/figma/source/353614b033b20d8b99d9f37440552055b2b1c004.webp",
              "w": 2048,
              "h": 1245,
              "cap": "Mountain range"
            },
            {
              "src": "assets/uploads/figma/source/483a93e850af430b5a829324e38bac481eda6897.webp",
              "w": 2048,
              "h": 1318,
              "cap": "Node network",
              "detail": true
            },
            {
              "src": "assets/uploads/figma/source/398e8c01a8a304095781b6f48e9b22f53982df63.webp",
              "w": 1920,
              "h": 918,
              "cap": "Base form"
            },
            {
              "src": "assets/uploads/figma/source/d332a5bf2b0d6cc500b5f88beefc4ffabb7b2026.webp",
              "w": 2048,
              "h": 1250,
              "cap": "HeightField Erode"
            }
          ]
        },
        {
          "h": "Layered Mountain Forms",
          "sub": "",
          "text": "I utilized Sweep combined with Mix by Attribute node to create layered mountain forms and blend terrain at varying elevations. The result is exported as a HeightMap for use in Unreal Engine.",
          "images": [
            {
              "src": "assets/uploads/figma/source/65d13cbada6e829574b1a7257dddd69b8ae9bd9e.webp",
              "w": 2048,
              "h": 1009,
              "cap": "Layered forms"
            },
            {
              "src": "assets/uploads/figma/source/78737ddae5ee8b5f47b271974a578f851a7a4198.webp",
              "w": 1818,
              "h": 1332,
              "cap": "Sweep result"
            },
            {
              "src": "assets/uploads/figma/source/bebda0561917e0f78ddba80d56be08654d248306.webp",
              "w": 1170,
              "h": 1071,
              "cap": "Mix by Attribute",
              "detail": true
            },
            {
              "src": "assets/uploads/figma/source/6f8341d5048e364e2227f979a53a893d69aab9d4.webp",
              "w": 2048,
              "h": 2048,
              "cap": "Exported HeightMap"
            }
          ]
        },
        {
          "h": "Thought Process",
          "sub": "",
          "text": "Another attempt involved adding elements like rivers, but it felt too realistic and was ultimately not adopted.",
          "images": [
            {
              "src": "assets/uploads/figma/source/008408f7ceb2bcda1791877e48924a5e09394c0b.webp",
              "w": 2048,
              "h": 799,
              "cap": "River attempt (not adopted)"
            }
          ]
        }
      ]
    },
    {
      "id": "scene-iteration",
      "title": {
        "zh": "场景材质与风格迭代",
        "en": "Scene Materials & Style Iteration"
      },
      "sections": [
        {
          "h": "Core Asset — Laputa's Cabin",
          "sub": "",
          "text": "I created the house model in Maya, as we plan to utilize materials produced in Substance Designer—only UV unwrapping was required.",
          "images": [
            {
              "src": "assets/uploads/figma/source/d5d748f47c6928a749c98c7fbe2688126ba84f6b.webp",
              "w": 2048,
              "h": 1102,
              "cap": "Cabin model"
            }
          ]
        },
        {
          "h": "Runtime Virtual Texturing Grass",
          "sub": "",
          "text": "RVT makes the grass blend more naturally with the landscape.",
          "images": [
            {
              "src": "assets/uploads/figma/source/915daa3d37203eb75ab7ad3de894e1277ff17430.webp",
              "w": 364,
              "h": 145,
              "cap": "RVT textures"
            },
            {
              "src": "assets/uploads/figma/source/843696a3a2b494e99b7cf9775cfec322c327fbc4.webp",
              "w": 2048,
              "h": 906,
              "cap": "Material"
            },
            {
              "src": "assets/uploads/figma/source/73923e4b410f5f747c9c7022c0d1b5f20316ddae.webp",
              "w": 2048,
              "h": 1122,
              "cap": "Result"
            }
          ]
        },
        {
          "h": "Stone Wall — Vertex Color Shader",
          "sub": "",
          "text": "",
          "images": [
            {
              "src": "assets/uploads/figma/source/df2d580ca97557543d083e1b64f61913503e17c4.webp",
              "w": 1268,
              "h": 741,
              "cap": "Vertex-color stone wall"
            },
            {
              "src": "assets/uploads/figma/source/ee8f072312aaf0a2404439b25e4803d89ac32544.webp",
              "w": 867,
              "h": 428,
              "cap": "Detail"
            },
            {
              "src": "assets/uploads/figma/source/fd855b7e8f834fabf60fd155c9d750dcb7d29ece.webp",
              "w": 843,
              "h": 885,
              "cap": "Material ball"
            }
          ]
        },
        {
          "h": "Scene Construction and Iteration",
          "sub": "",
          "text": "I studied Substance Designer courses and created brick and wood materials for the house. However, they appear too realistic and do not align with my original reference images.",
          "images": [
            {
              "src": "assets/uploads/figma/source/d0c37ce527167cc98b2eeab88bf55b4a27714135.webp",
              "w": 1071,
              "h": 555,
              "cap": "Original reference"
            },
            {
              "src": "assets/uploads/figma/source/bffbd2b3379566a5e4956ad4654d56213b0e055f.webp",
              "w": 2048,
              "h": 2048,
              "cap": "First pass"
            },
            {
              "src": "assets/uploads/figma/source/a5787ef72813e01b1305984e13b7bfd51f490568.webp",
              "w": 1977,
              "h": 1024,
              "cap": "First pass"
            },
            {
              "src": "assets/uploads/figma/source/f80371ef6f2c58fbabad057ad9e95e690ae79a29.webp",
              "w": 2048,
              "h": 1152,
              "cap": "Realistic brick"
            }
          ]
        },
        {
          "h": "Feedback & Iteration",
          "sub": "",
          "text": "After working on it, I realized that stylization mainly involves simplifying details—for example, with a brick wall, only basic embossing or highlights are needed.",
          "images": [
            {
              "src": "assets/uploads/figma/source/1165f793e4ad7aae0c7d9142a55531273cde9ee8.webp",
              "w": 2048,
              "h": 1120,
              "cap": "Before"
            },
            {
              "src": "assets/uploads/figma/source/4ba427fcb2af7e1ef77650220713c2477adfb90b.webp",
              "w": 2048,
              "h": 1098,
              "cap": "After"
            },
            {
              "src": "assets/uploads/figma/source/63e6e6a8aa9ef2451d6d0050a1110bcc7396ed78.webp",
              "w": 2048,
              "h": 1152,
              "cap": "Final"
            },
            {
              "src": "assets/uploads/figma/source/4f54b5f2868261bb0db358275b693144082f6eba.webp",
              "w": 2048,
              "h": 1111,
              "cap": "Scene iteration"
            }
          ]
        }
      ]
    }
  ]
};

(function () {
  'use strict';

  function shot(name, w, h, zh, en) {
    return { src: 'assets/uploads/level-design/' + name + '.webp', w: w, h: h, cap: { zh: zh, en: en } };
  }

  Object.assign(window.CURATED_CASE_STUDIES, {
    'uncharted-blockout': [
      {
        id: 'route-plan',
        title: { zh: '峡谷动线', en: 'Canyon Route' },
        sections: [
          {
            readable: true,
            text: {
              zh: '这份《神秘海域4》风格的关卡白盒以悬崖、桥梁和多层平台组织路线。总平面图标出了起点、终点、主路线和备选路线，也记录了演出点、敌人位置及可攀爬表面，便于检查玩家何时进入下一段挑战。',
              en: 'I organized the blockout around cliff faces, bridges and platforms at different elevations. The plan marks the start, finish, critical path and alternate routes, alongside cinematic beats, enemy positions and climbable surfaces.'
            },
            images: [shot('uncharted-route', 947, 634, '总平面图与路线图例', 'Overhead route plan and legend')]
          }
        ]
      },
      {
        id: 'bridges-and-companion',
        title: { zh: '桥梁与 NPC 配合', en: 'Bridges and Companion Interaction' },
        sections: [
          {
            readable: true,
            text: {
              zh: '我把桥梁和 NPC 配合作为主要设计练习。白盒标注了跨桥路线、岩壁上的替代攀爬路线和演出触发位置，并用第三个演出点的两张示意图区分等待与继续前进时的走法。',
              en: 'Bridges and companion interaction were the focus of the study. The blockout marks the bridge crossing, alternate climbs along the cliff, and cinematic triggers. Two diagrams for the third cinematic beat show the routes for waiting and moving on.'
            },
            images: [
              shot('uncharted-bridge-route', 1109, 863, '桥面与下方岩壁的路线', 'Bridge crossing and lower cliff route'),
              shot('uncharted-traversal', 909, 837, '岩壁攀爬段', 'Cliff traversal segment'),
              shot('uncharted-cinematic-point', 733, 232, '第三个演出点的两种走法', 'Two routes at cinematic point 3')
            ]
          }
        ]
      },
      {
        id: 'cliffside-encounter',
        title: { zh: '崖间战斗与攀爬', en: 'Cliffside Combat and Climbing' },
        sections: [
          {
            readable: true,
            text: {
              zh: '后段用桥连接高处建筑，把敌人和玩家的通行路线分布在不同层级。局部图标出了建筑内外的移动方式，以及攀爬点和跨崖跳跃之间的距离。',
              en: 'In the final stretch, bridges connect elevated buildings, with enemy positions and traversal routes spread across different heights. The detail drawings mark movement through and around the structures, including ledge spacing and jumps across the ravine.'
            },
            images: [
              shot('uncharted-encounter', 1320, 770, '建筑、桥梁与终点路线', 'Structures, bridges and the route to the finish'),
              shot('uncharted-climbing', 1319, 843, '攀爬点与跳跃距离', 'Climbable ledges and jump distances')
            ]
          }
        ]
      }
    ],
    'mall-blockout': [
      {
        id: 'mall-flow',
        title: { zh: '救援任务与楼层动线', en: 'Rescue Route Through the Mall' },
        links: [
          {
            href: 'https://u0273se2y4k.feishu.cn/docx/DaY0dPvedojpnqxrRiOcPrbgnGc',
            title: { zh: '关卡设计文档（飞书）', en: 'Level design document (Feishu)' }
          },
          {
            href: 'https://pan.baidu.com/s/17btrUjqlHCjAY8U5Wd0z7A?pwd=jy7t',
            title: { zh: '关卡解说视频（百度网盘，提取码 jy7t）', en: 'Level walkthrough (Baidu Netdisk, code jy7t)' }
          }
        ],
        sections: [
          {
            text: {
              zh: '主角得知朋友被当作人质后，从后门进入土匪占据的废弃商场。入口附近先安排一只丧尸，让玩家用刚拿到的武士刀学习近战。随后，玩家在带有「叛徒」标记的尸体旁捡到步枪，并用它应对远处的敌人。武器教学也交代了朋友与土匪团的关系。',
              en: 'When the protagonist learns that a friend is being held hostage, they enter the abandoned mall through a rear door. A lone zombie teaches melee with the katana. Farther in, the player finds a rifle beside a body marked “traitor” and uses it against a distant enemy. The weapon tutorial also leaves a clue about the friend’s connection to the gang.'
            }
          },
          {
            text: {
              zh: '我用挑空大厅和长廊安排较大的战斗，用地下通道和逃生楼梯串起狭窄的探索段。谈判失败后，土匪封闭通路并释放丧尸。玩家从 A 座绕到 B 座，最终沿安全通道上到天台救人。',
              en: 'The open atrium and long corridors accommodate larger encounters, while basement passages and fire stairs connect tighter exploration spaces. After negotiations fail, the gang seals the exits and releases the zombies. The player detours from Wing A into Wing B and climbs the fire stairs toward the rooftop rescue.'
            }
          }
        ]
      },
      {
        id: 'mall-lasers',
        title: { zh: '激光改变路线和战斗', en: 'Lasers Change Routes and Encounters' },
        sections: [
          {
            text: {
              zh: '低矮或移动的激光要求玩家判断跳跃和翻滚的时机。三道连续激光可以让玩家看见另一侧的空间，同时迫使玩家从侧面绕行或从上方进入。部分机关同时控制两道激光门，改变房间之间的通路。',
              en: 'Low and moving beams ask the player to time jumps and dodges. Three consecutive beams let the player see the space beyond while forcing a detour or an approach from above. Some switches control two laser gates, changing which rooms connect.'
            }
          },
          {
            text: {
              zh: '激光也会伤害丧尸。玩家可以把丧尸引过光束，在小 Boss 战中借场景处理敌人。同一个装置在过路时是障碍，在战斗中可以成为玩家利用的机关。',
              en: 'Beams also damage zombies. The player can lure enemies through them, including in a miniboss encounter. A device that blocks traversal can become a tool during combat.'
            }
          }
        ]
      },
      {
        id: 'mall-optional-route',
        title: { zh: '地下支路与场景线索', en: 'Basement Detour and Environmental Clues' },
        sections: [
          {
            text: {
              zh: '可读的日记交代了土匪如何占领商场、把丧尸关在特定房间，也提示 B1 藏有激光防护服。探索支路的玩家可以找到防护服，之后靠翻滚穿过激光。主线流程根据玩家是否拿到防护服提供不同走法。',
              en: 'Optional journals explain how the gang took over the mall and confined the zombies. One points to a protective suit hidden in the basement. Players who find it can dodge through beams, and the later route changes according to whether they have it.'
            }
          },
          {
            text: {
              zh: '白盒用色区分空间用途。白色标记相对安全区，暖黄色标记开阔战斗区，绿色标记丧尸关押区，蓝色标记狭窄或隐蔽的通道。',
              en: 'Blockout colors distinguish spatial roles. White marks relatively safe rooms, warm yellow marks open combat spaces, green marks zombie holding areas, and blue marks narrow or hidden passages.'
            }
          }
        ]
      }
    ],
    'screaming-chicken': [
      {
        id: 'sticky-party',
        title: { zh: '黏黏派对', en: 'Sticky Party' },
        sections: [
          {
            text: {
              zh: '一张兼容 2v2 和自由混战的圣诞追逃地图。弹簧与升降台让玩家可以迅速改变高度。最低层有安全掩体，但无法直接把炸弹扔到最高层。',
              en: 'A Christmas chase map for both 2v2 and free-for-all. Springs and lifts let players change elevation quickly. The lowest level offers cover and sits beyond throwing range of the highest platform.'
            },
            images: [
              shot('chicken-sticky-overview', 800, 450, '黏黏派对地图全景', 'Sticky Party map overview'),
              shot('chicken-sticky-elevation', 1523, 511, '高差与最低层掩体', 'Elevation changes and cover on the lowest level')
            ]
          },
          {
            h: { zh: '冰面与延迟拳套', en: 'Ice and the Delayed Punch' },
            text: {
              zh: '踩按钮后拳套会延迟弹出。被追的玩家可以先踩按钮再闪开，让跟上来的对手滑进拳套的范围。黏上炸弹后玩家质量增加，在冰上更难及时停下或转向。',
              en: 'The boxing glove fires a moment after someone steps on its button. A fleeing player can trigger it, dodge, and let the pursuer slide into its path. A player carrying a sticky bomb gains mass and has a harder time stopping or turning on the ice.'
            },
            images: [shot('chicken-sticky-punch', 1540, 966, '冰面旁的拳套机关', 'Boxing glove trap beside the ice')]
          }
        ]
      },
      {
        id: 'magnet-map',
        title: { zh: '步步惊心', en: 'Step by Step' },
        sections: [
          {
            text: {
              zh: '这张 2v2 地图以黏性炸弹和队友配合为核心。按钮与磁力机按颜色配对，队友可以按按钮，让刚拿到炸弹的对手被黏住。冰面能捡到炸弹并借传送门投掷，但玩家也会暴露在磁力机前。',
              en: 'This 2v2 map revolves around sticky bombs and coordination. Color-matched buttons activate magnets that can pin an opponent who has just picked up a bomb. On the ice, players can grab a bomb and throw it through a portal while exposed to the magnets.'
            },
            images: [
              shot('chicken-magnets-overview', 1920, 1080, '步步惊心地图全景', 'Step by Step map overview'),
              shot('chicken-magnets-button', 1320, 441, '按钮与磁力机的颜色对应', 'Color-coded buttons and magnets'),
              shot('chicken-magnets-risk', 1745, 543, '冰面上的炸弹与磁力机', 'Bomb and magnet positions around the ice')
            ]
          },
          {
            h: { zh: '传送门与中期配合', en: 'Portals and Mid-Match Team Play' },
            text: {
              zh: '中间高、两端低，传送门把两侧接成可追逃的路线。中期中央刷新心灵控制枪后，队友可以按对手是否携带炸弹选择配合。对手没带炸弹时，一人控制对手，另一人拾取炸弹并投向绿色传送门。对手带着炸弹时，可利用心灵控制让敌方队友穿过绿色传送门并踩下绿色按钮。',
              en: 'The center sits above both ends, and portals connect the lower areas into chase routes. When the mind-control gun spawns in the middle, teammates can choose a play based on whether the target has a bomb. Against an unarmed target, one player holds the target while the other picks up a bomb and throws it through the green portal. When the target is carrying a bomb, the team can use mind control to send the target’s teammate through the green portal and onto the green button.'
            },
            images: [shot('chicken-magnets-routes', 1920, 1002, '中央高台、传送门与两侧路线', 'Raised center, portals and routes on both sides')]
          }
        ]
      },
      {
        id: 'christmas-escape',
        title: { zh: '圣诞逃亡', en: 'Christmas Escape' },
        sections: [
          {
            readable: true,
            text: {
              zh: '玩家在四条赛道间换道，躲避电锯。障碍在两种组合之间轮换，一种配对为 1 与 3、2 与 4，另一种为 1 与 4、2 与 3。外侧栏杆升起前，报警器先抬起，给玩家留出换到安全赛道的时间。',
              en: 'Players switch between four lanes to avoid saws. Hazards alternate between two patterns, pairing lanes 1 and 3 with 2 and 4, then 1 and 4 with 2 and 3. An alarm rises before the outer barriers, giving players time to switch to a safer lane.'
            },
            images: [
              shot('chicken-escape-overview', 1920, 1080, '圣诞逃亡的四条赛道', 'The four lanes of Christmas Escape'),
              shot('chicken-escape-hazard-table', 1031, 463, '各赛道的障碍配置表', 'Obstacle placement table by lane')
            ]
          },
          {
            h: { zh: '道具布局与时机', en: 'Item Placement and Timing' },
            text: {
              zh: '两侧道具更强，但外侧栏杆升起时更容易被封住。中间也有较弱的道具，鼓励玩家持续换道。音响会让范围内的所有玩家停下，可以等自己处在安全位置、对手面临障碍时再使用。',
              en: 'The outer lanes offer stronger items at the risk of getting trapped by rising barriers. Weaker items in the middle give players a reason to switch lanes. The speaker stops everyone in range, so a player can time it for when they are safe and an opponent is exposed to a hazard.'
            },
            images: [
              shot('chicken-escape-items', 1364, 978, '两侧与中间的道具点', 'Outer and middle item positions'),
              shot('chicken-escape-speaker', 989, 579, '音响生效范围', 'Speaker area of effect')
            ]
          }
        ]
      }
    ]
  });

  window.FIGMA_CASE_STUDY_ADDITIONS = {
    '706:380': {
      sections: [
        {
          h: { zh: '信号塔的状态与复用', en: 'Signal Tower States and Reuse' },
          text: {
            zh: '5.0 的太空地图缺少分层小地图，扫描仪的寻人和藏宝图玩法均按单人流程设计。靠近未知信号塔后，它会转为已知信号塔。瞄准正在发射的信号可读到发射者姓名和距离，部分信号还会附带简讯。事件完成后关闭信号，同一座塔可以再次发射，作为后续任务的固定发出点。',
            en: 'The version 5.0 space map had no layered minimap. I designed both scanner activities for solo play. An unknown tower becomes known when the player gets close. Aiming at an active signal reveals its sender and distance, and some signals carry a short message. The signal shuts off when the event ends, so the tower can be reused as a fixed starting point for later missions.'
          }
        }
      ]
    },
    '742:241': {
      sections: [
        {
          h: { zh: '杰里事件的收尾', en: 'The End of Jerry’s Story' },
          text: {
            zh: '击败伪装成杰里的拟态虫后，玩家需要再次扫描，才能发现漂到更远处的遗体。生命记录仪留下了他临终前挂念女儿的片段。回档案处领奖时，玩家会遇到还不知道父亲死讯的女儿，听她说起父亲为了自己辛苦工作。',
            en: 'After defeating the mimic disguised as Jerry, the player scans again to find his body farther away. His life recorder reveals that he was thinking of his daughter in his final moments. Back at the archive, the player can hear his daughter talk about how hard he works for her. She still has no news of his death.'
          }
        },
        {
          h: { zh: '地图布局与玩家路线', en: 'Placement and Player Routes' },
          readable: true,
          text: {
            zh: '我用高差给同类事件做空间区分，例如被矿坑事件炸飞的失踪者位于矿坑顶部。部分藏宝点需要完成前置任务，作为主航线外大片空区的隐藏探索目标。配置草图标出了目击点与实际事件点。上方的玩家攻略图可以对照玩家实际采用的路线。',
            en: 'I used elevation to distinguish similar events. For example, one missing person was thrown to the top of a mine by an explosion. Some treasure sites require a prerequisite quest and serve as hidden destinations in empty stretches off the main route. The placement sketch marks the sighting and event locations. The player guide above shows how a player traced those routes.'
          },
          images: [shot('tof-placement-plan', 1617, 1008, '失踪人员目击点与实际事件点的配置草图', 'Placement sketch of last sightings and event locations')]
        }
      ]
    },
    '706:440': {
      sections: [
        {
          h: { zh: '其他开放世界探索点', en: 'More Open-World Activities' },
          images: [
            shot('tof-power-authentication', 1437, 684, '电力认证', 'Power authentication'),
            shot('tof-overclocked-machine', 1447, 690, '超阈智械', 'Overclocked machine'),
            shot('tof-overclocked-eye', 1441, 688, '超阈之眼', 'Overclocked eye'),
            shot('tof-overclocked-station', 1441, 681, '超阈基站', 'Overclocked station')
          ]
        },
        {
          images: [
            shot('tof-timed-crate', 1441, 691, '薛定谔箱', 'Schrödinger’s crate'),
            shot('tof-mech-power', 1438, 685, '机甲赋能', 'Mech empowerment'),
            shot('tof-gravity-mushroom', 1446, 694, '重力石蕾', 'Gravity stone bud'),
            shot('tof-combat-simulator', 1446, 682, '战斗模拟器', 'Combat simulator')
          ]
        },
        {
          h: { zh: '刷新点批量配置', en: 'Batch Spawn Point Setup' },
          text: {
            zh: '随机刷新工具可以批量重命名场景里的 Target，再统一赋值给随机刷新器。我用这一步把生成好的点位接到玩法配置中。',
            en: 'The random spawn tool can rename existing Target actors in bulk before assigning them to a random spawner. This connects the generated points to the gameplay setup.'
          }
        }
      ]
    }
  };
})();
