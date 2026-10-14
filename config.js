/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              config.js — 网站配置文件                        ║
 * ║                                                              ║
 * ║  ★ 这是你唯一需要编辑的文件 ★                                ║
 * ║  修改下方内容后，刷新浏览器即可看到效果                        ║
 * ║  每项旁边都有注释说明，按照格式填写即可                        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const CONFIG = {

  /* ============================================================
     § 1. 个人基本信息
     ============================================================ */

  name: {
    en: 'Hanqing Li',
    zh: '李涵清',
    alias: 'GiselleLi',
  },

  role: {
    en: 'Technical Artist',
    zh: '技术美术师',
  },

  location: {
    en: 'Shanghai, China',
    zh: '中国 · 上海',
  },

  experience: {
    en: '3+ years in game industry',
    zh: '3 年以上游戏行业经验',
  },

  languages: {
    en: 'Chinese (native) / English (professional)/Japanese',
    zh: '中文（母语）/ 英文（专业阅读）/日语',
  },

  status: {
    en: 'Open to new opportunities · Available for projects',
    zh: '开放新机会 · 可接项目合作',
  },

  contact: {
    email:      'kyuandart@gmail.com',
    github:     'https://GiselleLi.github.io/index.html',
    artstation: 'N/A',
    linkedin:   'https://www.linkedin.com/in/hanqing-li-000069223',
    tel:        '13061878150',
  },

  copyright: '© 2026 Hanqing Li · All rights reserved',


  /* ============================================================
     § 2. 首页文字
     ============================================================ */

  home: {
    subtitle: {
      en: 'Technical Artist · <span style="color:var(--pink)">GiselleLi</span>',
      zh: '技术美术师 · <span style="color:var(--pink)">九十九</span>',
    },

    about: {
      title: { en: 'Technical Artist', zh: '游戏技术美术' },
      desc: {
        en: 'Focused on the intersection of game visuals and technology — specializing in shader development, procedural content generation, and real-time rendering optimization.',
        zh: '专注于游戏视觉技术与艺术的交叉领域，擅长 着色器 开发、程序化内容生成与实时渲染优化。致力于将技术与美学融合，打造沉浸式游戏视觉体验。',
      },
    },

    stats: [
      { num: '3+', label: { en: 'Years of Experience', zh: '年从业经验' } },
      { num: '20+', label: { en: 'Projects Completed', zh: '完成项目' } },
      { num: '5+', label: { en: 'Games Shipped', zh: '参与游戏' } },
      { num: '∞', label: { en: 'Passion for Games', zh: '对游戏的热爱' } },
    ],

    skills: [
      'HLSL / GLSL',
      'Unity URP / HDRP',
      'Unreal Engine 5',
      'Houdini',
      'Python',
      'Maya',
      'Substance Painter',
      'Shader Graph',
      'Niagara VFX',
      'C#',
      'Procedural Generation',
      'Real-time Rendering',
    ],
  },


  /* ============================================================
     § 3. 关于我页面
     ============================================================ */

  about: {
    bio: {
      en: 'A technical artist who loves games — focused on shader development, procedural content, and real-time rendering. I believe the boundary between technology and art was always blurred: the best visuals in games are poetry written in code.',
      zh: '热爱游戏的技术美术师，专注于 着色器 开发、程序化内容生成与实时渲染。相信技术与艺术的边界本就模糊——最好的游戏画面，是代码写出来的诗。',
    },

    desc: {
      en: 'Fell in love with games early on and taught myself shader programming in college. I enjoy solving "can this effect even be done?" questions — most of the time the answer is yes. In my free time I make Game Jam games and explore the aesthetic potential of indie development.',
      zh: '从小热爱游戏，大学期间自学 着色器 编程并一头扎进技术美术领域。喜欢解决"这个效果能实现吗"这类问题——大多数时候，答案是可以的。业余时间喜欢制作 Game Jam 游戏，探索独立游戏的美学可能性。',
    },

    photo: '',

    interests: [
      {
        icon:  '⚡',
        title: { en: 'Real-time Rendering', zh: '实时渲染' },
        desc:  { en: 'Exploring GPU-driven rendering, ray tracing, and deferred pipeline frontiers.',
                 zh: '探索 GPU 驱动渲染、光线追踪与延迟渲染管线的前沿技术。' },
      },
      {
        icon:  '🌀',
        title: { en: 'Procedural Generation', zh: '程序化生成' },
        desc:  { en: 'Using math and noise to create infinitely varied worlds — terrain, vegetation, cities.',
                 zh: '用数学和噪波创造无限变化的世界——地形、植被、城市。' },
      },
      {
        icon:  '🎮',
        title: { en: 'Indie Games', zh: '独立游戏' },
        desc:  { en: 'Passionate about Game Jams; believing small teams can create stunning work.',
                 zh: '热衷于 Game Jam，相信小团队也能做出令人惊叹的作品。' },
      },
      {
        icon:  '🔬',
        title: { en: 'Technical Research', zh: '技术研究' },
        desc:  { en: 'Continuously studying SIGGRAPH papers and converting research into engineering practice.',
                 zh: '持续学习 SIGGRAPH 论文，将学术前沿转化为工程实践。' },
      },
    ],
  },


  /* ============================================================
     § 4. 作品集
     ============================================================ */

  workGroupNames: {
    project: { en: 'Complete Projects', zh: '完整项目作品' },
    tool: { en: 'Tools', zh: '工具作品' },
    art: { en: 'Independent Works', zh: '独立作品' },
    collab: { en: 'Collaborative Works', zh: '合作作品' },
  },
  works: [
    {
      category: 'shader',
      group: 'collab',
      hasVideo: true,
      image: 'assets/uploads/previews/casino-central-orbit.webp',
      title: { en: 'Art Deco Casino Shader', zh: '装饰艺术赌场着色器' },
      desc: {
        en: 'An Art Deco casino environment in Unreal Engine, shaded for standalone Meta Quest 3 — materials, lighting and reflections built to hold up on mobile VR hardware.',
        zh: '在 Unreal Engine 中为 Meta Quest 3 一体机制作的 装饰艺术 风格赌场场景着色，兼顾材质、灯光与反射效果和移动 VR 的性能限制。',
      },
      tags: ['Unreal Engine', 'Meta Quest 3', 'VR', 'Shader', 'Art Deco'],
      clip: 'assets/clips/casino',
      detail: {
        year: '2026',
        tools: 'Unreal Engine',
        overview: {
          en: 'A stylized toon shader for an Art Deco casino environment, featuring custom metallic reflections and support for multiple lights.',
          zh: '为 装饰艺术 风格赌场场景制作的风格化卡渲 着色器，结合自定义金属反射，并支持多光源。',
        },
      },
      links: [
        { type: 'video', label: { en: 'Watch 2K Video →', zh: '观看 2K 视频 →' }, href: 'assets/uploads/Casino_CentralOrbit_2K_30fps.mp4' },
        { type: 'video', label: { en: 'Material Study · 2K →', zh: '材质球展示 · 2K →' }, href: 'assets/uploads/Toon_MaterialStudy_SingleLight_2K_30fps.mp4', poster: 'assets/uploads/previews/toon-material-study-single-light.webp', description: { en: 'One shader across three surfaces: shader-only, slot machine and floor. Each sphere receives one rotating light using the original light settings. 2560 × 1440 · 30 fps · 10 seconds.', zh: '同一 着色器 的三种表面：无颜色贴图、老虎机与地板。每个球仅使用一个旋转光源，参数沿用原来的灯光。2560 × 1440 · 30 fps · 10 秒。' } },
        { type: 'video', label: { en: 'Live Lighting Adjustment →', zh: '实时光照调节 · 录屏 →' }, href: 'assets/uploads/Casino_LightAdjustment_Live_30fps.mp4', poster: 'assets/uploads/previews/casino-light-adjustment.webp', description: { en: 'Live Unreal Editor recording: BP_ToonLIght_Point2 moves vertically from Z −230 to +230. Light intensity and range stay fixed; the actor returns to its original position.', zh: 'Unreal 编辑器实时录屏：BP_ToonLIght_Point2 沿 Z 轴从 −230 到 +230 上下移动，展示墙面、地板和人物的光照变化。强度和范围保持不变，录完恢复原位置。' } },
      ],
    },
    {
      category: 'shader',
      group: 'project',
      hasVideo: true,
      image: 'assets/uploads/previews/pbr-shaders.webp',
      title: { en: 'PBR Shaders', zh: 'PBR 着色器' },
      desc:  {
        en: 'A scene-based shader showreel focused on real-time material and rendering presentation.',
        zh: '以场景展示为主的 着色器 作品集，聚焦实时材质与渲染表现。',
      },
      tags: ['Shader', 'Shading', 'Showreel'],
      clip: 'assets/clips/pbr-shaders',
      pdf: 'assets/uploads/Project1_Compressed.pdf',
      links: [
        { type: 'video', label: { en: 'Watch Video →', zh: '观看视频 →' }, href: 'assets/uploads/ShadingShowreel.mp4' },
      ],
    },
    {
      category: 'shader',
      group: 'art',
      hasVideo: true,
      image: 'assets/uploads/previews/lycorius-shader.webp',
      title: { en: 'Lycorius Shader Iteration', zh: '彼岸花着色器迭代' },
      desc:  {
        en: 'An iterative shader study for Lycorius, exploring stylized surface response and presentation polish.',
        zh: '围绕 彼岸花 的 着色器 迭代研究，探索风格化表面响应与展示效果。',
      },
      tags: ['Shader', 'Iteration'],
      clip: 'assets/clips/lycoris',
      pdf: 'assets/uploads/Project2_Compressed.pdf',
      links: [
        { type: 'video', label: { en: 'Watch Video →', zh: '观看视频 →' }, href: 'assets/uploads/LycoriusShader迭代.mp4' },
      ],
    },
    {
      category: 'shader',
      group: 'art',
      hasVideo: true,
      image: 'assets/uploads/previews/eye-shader.webp',
      title: { en: 'Eye Shader Study', zh: '眼球着色器研究' },
      desc:  {
        en: 'A real-time eye material study focused on iris depth, corneal highlight, and character readability.',
        zh: '实时眼球材质研究，聚焦虹膜层次、角膜高光与角色表现力。',
      },
      tags: ['Shader', 'Character'],
      clip: 'assets/clips/eye',
      links: [
        { type: 'video', label: { en: 'Watch Video →', zh: '观看视频 →' }, href: 'assets/uploads/Eye.mp4' },
      ],
    },
    {
      category: 'render',
      group: 'art',
      hasVideo: true,
      image: 'assets/uploads/previews/shadow-man.webp',
      title: { en: 'Shadow Man', zh: '暗影人' },
      desc:  {
        en: 'A remastered presentation of ShadowMan, refining atmosphere, rendering, and scene mood.',
        zh: '暗影人 的重制展示，重点优化氛围、渲染表现与场景情绪。',
      },
      tags: ['Render', 'Remaster'],
      clip: 'assets/clips/shadow-man',
      links: [
        { type: 'video', label: { en: 'Watch Video →', zh: '观看视频 →' }, href: 'assets/uploads/ShadowMan_Remaster.mp4' },
      ],
    },
    {
      category: 'pcg',
      group: 'project',
      hasVideo: true,
      image: 'assets/uploads/previews/pcg-showcase.webp',
      title: { en: 'PCG Showcase', zh: 'PCG 程序化生成展示' },
      desc:  {
        en: 'A procedural content generation showcase focused on repeatable scene-building and real-time presentation.',
        zh: '程序化内容生成展示，聚焦可复用的场景构建流程与实时呈现效果。',
      },
      tags: ['PCG', 'Procedural', 'Tool'],
      clip: 'assets/clips/pcg',
      pdf: 'assets/uploads/Project3_Compressed.pdf',
      links: [
        { type: 'video', label: { en: 'Watch Video →', zh: '观看视频 →' }, href: 'assets/uploads/PCG.mp4' },
      ],
    },
    {
      category: 'tool',
      group: 'tool',
      hasVideo: false,
      image: 'assets/uploads/previews/tower-of-fantasy.webp',
      title: { en: 'Tower Of Fantasy', zh: '幻塔' },
      desc:  {
        en: 'A Unreal Engine level tool showcase for improving scene-building workflow and iteration efficiency.',
        zh: 'Unreal Engine 关卡工具展示，用于提升场景搭建流程与迭代效率。',
      },
      tags: ['Tool', 'Unreal Engine'],
      pdf: 'assets/uploads/Project4_Compressed.pdf',
      links: [
        { type: 'image', label: { en: 'View Image →', zh: '查看图片 →' }, href: 'assets/uploads/UE关卡工具.webp' },
      ],
    },
  ],


  /* ============================================================
     § 5. 简历 — 教育经历
     ============================================================ */

  education: [
    {
      school: { en: 'Shanghai University', zh: '上海大学' },
      period: { en: 'Sep 2019 — Aug 2023', zh: '2019.09 — 2023.08' },
      degree: { en: 'Bachelor of Fine Arts (Broadcasting and Television Playwright-director)',
                zh: '艺术学学士（广播电视编导）' },
      detail: {
        en: '<strong>Core Courses:</strong> Image Technology and Art, Visual Plastic Arts, Film and Video Shoot, Film and Video Editor, Analysis on Audio-visual Element, New Digital Media Foundation and Application.',
        zh: '<strong>核心课程：</strong>影像技术与艺术、视觉造型艺术、影视摄制、影视剪辑、视听元素分析、新数字媒体基础与应用、影视音乐、新媒体影像、演播室制作。',
      },
      award: { en: '', zh: '' },
    },
    {
      school: { en: 'Shanghai Vancouver Film School', zh: '上海温哥华电影学院' },
      period: { en: 'Sep 2021 — Aug 2022', zh: '2021.09 — 2022.08' },
      degree: { en: 'Game Design',
                zh: '游戏设计' },
      detail: {
        en: '<strong>Core Courses:</strong> Game Mechanics, Level Design, Art Fundamentals, Game Art, Unity C#, Unreal, 3D Modeling, Procedure Materials, Programming.',
        zh: '<strong>核心课程：</strong>游戏机制、关卡设计、艺术基础、游戏美术、Unity C#、虚幻引擎、3D 建模、程序化材质、编程、关卡设计。',
      },
      award: { en: '<span class="text-pink">Awards:</span> Full Scholarship to 2021 Talent SHVFS Game Design', zh: '<span class="text-pink">奖项：</span>2021 年度 SHVFS 游戏设计才能奖全额奖学金' },
    },
  ],


  /* ============================================================
     § 6. 简历 — 工作经历
     ============================================================ */

  workExp: [
    {
      company:    { en: 'Tencent', zh: '腾讯' },
      period:     { en: 'Dec 2025 — Now', zh: '2025.12 — 至今' },
      role:       { en: '(Intern) Technical Artist for Golden Spatula (Teamfight Tactics China Edition)',
                    zh: '（实习）技术美术师 — 金铲铲之战（自走棋中国版）' },
      projectUrl: '',
      bullets: [
        {
          en: '<strong>Shader Maintenance & Pipeline R&D:</strong> Maintained shader variant effects triggered by piece skills and integrated the variant-switching workflow with gameplay systems; researched and migrated shader effects across rendering pipelines; designed shaders for board environments.',
          zh: '<strong>着色器 维护与管线预研：</strong>维护棋子技能效果触发时的 着色器 变体效果，整合变体切换方式与程序功能的连接；完成不同渲染管线下 着色器 效果的预研与迁移；负责棋盘场景 着色器 设计。',
        },
        {
          en: '<strong>Art Asset Coordination & Iteration:</strong> Coordinated with co-development partners on art assets required for target effects; reviewed deliveries, requested revisions, and drove iterative improvements.',
          zh: '<strong>美术资产沟通与迭代：</strong>与 CP 方沟通制作效果所需的美术资产，审核交付内容并提出打回修改意见，推动后续迭代。',
        },
        {
          en: '<strong>Python TA Tool Development & Testing:</strong> Developed Python-based TA tools and established repeatable testing and verification workflows.',
          zh: '<strong>Python TA 工具开发与测试：</strong>开发 Python TA 工具，并建立规范化的测试与验证流程。',
        },
        {
          en: '<strong>Video-to-Character Animation Pipeline:</strong> Architected an end-to-end pipeline from source video to project-ready character animation; increased production efficiency by 80%.',
          zh: '<strong>视频转角色动画流水线：</strong>构建从视频素材到可用角色动画的端到端流水线，自研重定向工具集，生产效率提升 80%。',
        },
      ],
    },
    {
      company:    { en: 'Perfect World-Hotta Studio', zh: '完美世界-幻塔子公司' },
      period:     { en: 'May 2024 — Oct 2025', zh: '2024.05 — 2025.10' },
      role:       { en: 'Level Designer for Tower Of Fantasy (UE4 Open-world MMORPG)',
                    zh: '关卡设计师 — 幻塔（UE4 开放世界 MMORPG）' },
      projectUrl: 'https://www.youtube.com/watch?v=5CtQmstePSU',
      bullets: [
        {
          en: '<strong>Tool Design & Development:</strong> Engineered proprietary level editing tools for open-world mass production, reducing manual labor by 30%.',
          zh: '<strong>工具设计与开发：</strong>为开放世界大规模制作开发专有关卡编辑工具，减少人工操作 30%。',
        },
        {
          en: '<strong>UE4 Blueprint Development:</strong> Independently managed the full lifecycle of 19 open-world exploration gameplay features across versions 4.2-5.4.',
          zh: '<strong>UE4 蓝图开发：</strong>独立完整管理 4.2–5.4 版本共 19 个开放世界探索玩法功能全生命周期。',
        },
        {
          en: '<strong>Gameplay Framework Design:</strong> Designed scalable gameplay infrastructure including core data assets (DA) and data tables (DT).',
          zh: '<strong>玩法框架设计：</strong>设计可扩展的玩法基础架构，包含核心数据资产（DA）与数据表（DT）。',
        },
        {
          en: '<strong>Art Asset Design & Integration:</strong> Designed gameplay visuals (models, animations, VFX, interaction logic) and independently integrated art assets.',
          zh: '<strong>美术资产设计与集成：</strong>设计玩法视觉（模型、动画、VFX、交互逻辑）并独立完成美术资产集成。',
        },
        {
          en: '<strong>Cross-Team Collaboration:</strong> Collaborated with Art and Engineering to optimize performance (LOD, texture compression) to maintain target frame rates.',
          zh: '<strong>跨团队协作：</strong>与美术和工程团队协作进行性能优化（LOD、贴图压缩），维持目标帧率。',
        },
      ],
    },
    {
      company:    { en: 'NeoCast', zh: '上海辛卡司' },
      period:     { en: 'Mar 2024 — May 2024', zh: '2024.03 — 2024.05' },
      role:       { en: 'Technical Artist for Nezha (AR Interactive Mini-game)',
                    zh: '技术美术师 — 哪吒（AR 互动小游戏）' },
      projectUrl: '',
      bullets: [
        {
          en: '<strong>Environment Art:</strong> Crafted stationary 360° panoramic environments for AR glasses.',
          zh: '<strong>环境美术：</strong>为 AR 眼镜制作固定式 360° 全景环境，专注场景建模与优化后处理。',
        },
        {
          en: '<strong>Performance Optimization:</strong> Conducted profiling analysis; collaborated with Rokid\'s technical team for stable frame rates.',
          zh: '<strong>性能优化：</strong>进行 性能分析 分析定位瓶颈，与 Rokid 技术团队协作确保稳定帧率。',
        },
        {
          en: '<strong>Shader Development:</strong> Developed custom shader solutions utilizing ASE, CG, and HLSL for stylized rendering.',
          zh: '<strong>着色器 开发：</strong>使用 ASE、CG 和 HLSL 开发风格化渲染的自定义着色器方案。',
        },
      ],
    },
    {
      company:    { en: 'Bug Inventor (Tencent)', zh: '腾云摘星' },
      period:     { en: 'Dec 2022 — Feb 2023', zh: '2022.12 — 2023.02' },
      role:       { en: 'Intern Level Designer for Fried Chicken Battle',
                    zh: '（实习）关卡设计师 — 炸鸡大作战' },
      projectUrl: 'https://www.youtube.com/watch?v=jxHt0R11O-o',
      bullets: [
        {
          en: '<strong>Level Creation:</strong> Built 4 original multiplayer brawl maps (FFA/2v2) to support seasonal content goals.',
          zh: '<strong>关卡制作：</strong>制作 4 张原创多人混战地图（FFA/2v2），支持赛季内容目标。',
        },
        {
          en: '<strong>Production & Maintenance:</strong> Led playtesting cycles, revised levels based on feedback, and managed full deployment pipeline.',
          zh: '<strong>生产与维护：</strong>主导测试周期，根据反馈修改关卡，管理完整发布流程。',
        },
        {
          en: '<strong>Cross-Team Collaboration:</strong> Partnered with production and operations to align level design with live-ops strategy.',
          zh: '<strong>跨团队协作：</strong>与制作和运营团队合作，使关卡设计与运营策略保持一致。',
        },
      ],
    },
  ],


  /* ============================================================
     § 7. 简历 — 独立项目经历
     ============================================================ */

  indieProjects: [
    {
      title:      'Inside The Paper',
      period:     { en: 'Jun 2023 — Aug 2023', zh: '2023.06 — 2023.08' },
      role:       { en: 'Technical Artist (3D Stylized Puzzle Game)',
                    zh: '技术美术师（3D 风格化解谜游戏）' },
      projectUrl: 'https://www.youtube.com/watch?v=mVqrnLEID94',
      award:      { en: '', zh: '' },
      bullets: [
        {
          en: '<strong>Environment Art:</strong> Built level whiteboxes in Unity; crafted scene ambiance through particle effects and post-processing; created Low Poly models in Maya.',
          zh: '<strong>环境美术：</strong>在 Unity 中按概念图搭建关卡白盒，通过粒子特效和后处理营造场景氛围；在 Maya 中制作低多边形模型。',
        },
        {
          en: '<strong>Shader Development:</strong> Independently developed a streamlined cartoon graffiti-style shader to match the game\'s artistic vision.',
          zh: '<strong>着色器 开发：</strong>独立开发符合游戏美术风格的简化卡通涂鸦风着色器，并完成集成保证视觉统一。',
        },
      ],
    },
    {
      title:      'Lycoris',
      period:     { en: 'May 2022 — Aug 2022', zh: '2022.05 — 2022.08' },
      role:       { en: 'Technical Artist (3D Puzzle Platformer)',
                    zh: '技术美术师（3D 解谜平台跳跃游戏）' },
      projectUrl: 'https://www.youtube.com/watch?v=kVGB4noxZYs',
      award:      { en: 'Won the Outstanding Future Game Production Team Award (9th Golden Mouth Awards)', zh: '荣获第九届金口奖"杰出未来游戏制作团队"奖' },
      bullets: [
        {
          en: '<strong>3D Art:</strong> Crafted 3D character and environment assets; developed custom VFX for puzzle feedback loops.',
          zh: '<strong>3D 美术：</strong>制作 3D 角色与环境资产；为解谜反馈循环开发自定义 VFX。',
        },
        {
          en: '<strong>Shaders:</strong> Designed custom shaders in Unity URP for character gameplay and core puzzle mechanics.',
          zh: '<strong>着色器：</strong>在 Unity URP 中为角色玩法、环境美术和核心解谜机制设计自定义着色器。',
        },
        {
          en: '<strong>Project Planning:</strong> Led timeline planning by breaking down technical pipelines into manageable sprints.',
          zh: '<strong>项目规划：</strong>主导项目时间线规划，将技术流水线拆解为可管理的冲刺任务。',
        },
        {
          en: '<strong>Cross-Team Collaboration:</strong> Coordinated with designers and programmers to resolve asset integration issues.',
          zh: '<strong>跨团队协作：</strong>与设计师协调使技术资产与逻辑对齐；与程序员协作解决资产集成问题。',
        },
      ],
    },
    {
      title:      'Behind Me',
      period:     { en: 'Mar 2022 — May 2022', zh: '2022.03 — 2022.05' },
      role:       { en: 'Lead Designer (VR Horror Game)',
                    zh: '主设计师（VR 恐怖游戏）' },
      projectUrl: 'https://www.youtube.com/watch?v=eIB4k4AAeCE',
      award:      { en: '', zh: '' },
      bullets: [
        {
          en: '<strong>Game Design Documentation:</strong> Developed a comprehensive GDD centered on immersive horror VR experience.',
          zh: '<strong>游戏设计文档：</strong>围绕沉浸式恐怖 VR 体验制作完整 GDD，定义循环、交互逻辑和叙事元素。',
        },
        {
          en: '<strong>Level Design:</strong> Created modular level whitebox environments in Unity ensuring tension-rich progression.',
          zh: '<strong>关卡设计：</strong>在 Unity 中创建模块化白盒关卡环境，确保流畅且充满紧张感的游戏推进。',
        },
        {
          en: '<strong>Visual Design & Shaders:</strong> Designed high-impact enemy visuals and implemented custom horror-themed shaders.',
          zh: '<strong>视觉设计与 着色器：</strong>设计高冲击力的敌人外观，并实现自定义恐怖主题着色器。',
        },
        {
          en: '<strong>Enemy Behavior Programming:</strong> Programmed enemy detection, pursuit, and ambush behaviors in Unity C#.',
          zh: '<strong>敌人行为编程：</strong>在 Unity C# 中实现敌人的探测、追击与伏击行为。',
        },
      ],
    },
  ],

};  // ← CONFIG 结束，不要删除这个括号
