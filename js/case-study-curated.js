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
