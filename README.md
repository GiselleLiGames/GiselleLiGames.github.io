# GiselleLi Portfolio

一个纯静态个人作品集网站，包含开场入口、作品集、简历、关于、联系页，以及用于维护内容的本地可视化编辑器。

---

## 快速开始

推荐通过本地静态服务器访问，避免浏览器对 `file://` 页面加载脚本和资源的限制。

```bash
python -m http.server 8000
```

然后访问：

| 页面 | 文件 | 说明 |
| --- | --- | --- |
| 开场入口 | `index.html` | GitHub Pages 默认入口，播放开场视频 |
| 快速菜单 | `menu.html` | 跳过开场动画后的四入口菜单 |
| 主页 | `home.html` | 传统个人主页/精选作品 |
| 作品集 | `portfolio.html` | 动态渲染作品卡片 |
| 简历 | `resume.html` | 动态渲染教育、工作和项目经历 |
| 联系 | `contact.html` | 动态渲染个人信息和联系方式 |
| 联系 | `contact.html` | 从 `config.js` 读取联系方式 |
| 编辑器 | `local-editor/index.html` | 可视化维护内容和排版 |

---

## 内容维护

主要内容集中在 `config.js` 中维护；排版参数集中在 `js/typography.js` 中维护。编辑器可以导入、修改并导出这两个文件。

### 编辑流程

1. 双击 `local-editor/start-editor.bat`，或用本地服务器打开 `local-editor/index.html`。
2. 修改内容或排版。
3. 点击顶部的「导出 config.js」或「导出 typography.js」。
4. 使用“直接保存”（Chrome/Edge）或下载后替换项目中的对应文件。
5. 刷新页面，必要时强制刷新缓存（`Ctrl+Shift+R`）。

### 编辑器覆盖范围

| 模块 | 文件/数据 |
| --- | --- |
| 基本信息、联系信息 | `config.js` |
| 主页文案、统计、技能 | `config.js` |
| 关于页、简历、作品集 | `config.js` |
| 作品图片、视频、PDF 链接 | `config.js` 中的路径或外链 |
| 字体、字号、行高等排版 | `js/typography.js` |
| 媒体上传 | `assets/uploads/` 或 GitHub 仓库上传 |

本地媒体资源当前放在 `assets/uploads/`；入口页场景资源放在 `assets/entry/`。

---

## 数据流

```text
config.js
  -> js/content.js      # 将 CONFIG 转成按语言组织的 CONTENT
  -> js/i18n.js         # 切换语言并渲染动态列表/卡片/联系信息

js/typography.js        # 独立注入全站排版 CSS
assets/entry/*          # 入口页和场景背景资源
```

页面脚本顺序应保持为：

```html
<script src="config.js"></script>
<script src="js/typography.js"></script>
<script src="js/content.js"></script>
<script src="js/i18n.js"></script>
```

`home.html` 额外使用 `js/depth-of-field-bg.js` 作为背景；`resume.html`、`portfolio.html`、`contact.html` 使用 `assets/entry/scene-pages.css` 和 `assets/entry/scene-background.js`。

---

## 项目结构

```text
GiselleLi.github.io/
├── index.html                      # 开场入口（GitHub Pages 默认入口）
├── menu.html                       # 静态快速菜单
├── home.html                       # 主页
├── portfolio.html                  # 作品集
├── resume.html                     # 简历
├── contact.html                    # 联系
├── config.js                       # 主要内容数据源
├── js/
│   ├── content.js                  # 构建 CONTENT
│   ├── i18n.js                     # 语言切换与动态渲染
│   ├── typography.js               # 排版配置与注入
│   └── depth-of-field-bg.js        # home.html 背景 Canvas
├── local-editor/
│   ├── index.html                  # 可视化编辑器入口
│   ├── editor.js                   # 编辑器逻辑
│   ├── server.js                   # 零依赖本地服务器
│   └── start-editor.bat            # Windows 一键启动
├── assets/
│   ├── entry/                      # 入口页视频、门框、预览图、场景背景
│   └── uploads/                    # 作品图片、视频和 PDF
└── docs/
    └── portfolio-entry-design.md   # 入口页设计说明
```

---

## 发布到 GitHub Pages

1. 将项目推送到 GitHub 仓库。
2. 进入仓库 `Settings -> Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/ (root)`。
5. 访问 `https://<用户名>.github.io/<仓库名>/`。

如果仓库名是 `<用户名>.github.io`，访问地址就是 `https://<用户名>.github.io/`。

---

## 常见问题

**首次访问如何自动选择语言？**
作品集、作品详情、简历和联系页面共用 `js/language-detection.js`。优先级为：链接中的 `?lang=zh/en` → 已保存的手动选择 → IP 所在地区 → 浏览器首选语言。中国大陆、香港、澳门、台湾默认中文，其他地区默认英文。

IP 地区由 [Country.is](https://country.is/) 查询，无需密钥；地区代码在浏览器缓存 24 小时，不保存返回的 IP。查询失败或超过 1.8 秒时使用浏览器语言。VPN 或代理可能影响判断，右上角仍可随时手动切换并记住选择。测试命令：`node --test tests/language-detection.test.cjs`。

**编辑器打开后内容为空？**
请双击 `local-editor/start-editor.bat`，或通过本地服务器访问 `local-editor/index.html`。

**导出后页面没有变化？**
确认替换的是项目根目录下的 `config.js` 或 `js/typography.js`，并强制刷新浏览器缓存。

**作品图片或视频不显示？**
检查路径是否存在。仓库内媒体建议放在 `assets/uploads/`，路径示例：`assets/uploads/PCG.mp4`。

**语言切换后有文字没变？**
该文字需要在 `config.js` 或 `js/content.js` 中提供对应的中英文字段，并在 HTML 上绑定 `data-i18n`。
