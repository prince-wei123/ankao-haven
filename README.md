# 岸上见 · 考研避难所

一个给考研人的「避难所」。不是打卡工具，是一个有人等你回来的地方。

- 纯静态网站：React 前端，数据全部存在浏览器本地（localStorage），不需要后端和数据库
- 部署一次，任何朋友点开链接就能用，页面完全一样
- 不排名、不惩罚、断签不扣分

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 · Vite 5 · Tailwind 3 · Framer Motion · Zustand · React Router |
| 数据 | 浏览器 localStorage（`src/lib/localDb.js` 实现了一套本地「假后端」） |
| 部署 | GitHub Pages（GitHub Actions 自动构建发布） |

## 目录结构

```
ankao-haven/
├── index.html
├── vite.config.js            # 生产环境 base = /ankao-haven/
├── scripts/postbuild.mjs     # 生成 404.html 以支持子路由刷新
├── .github/workflows/deploy.yml  # 推 main 自动发布到 GitHub Pages
└── src/
    ├── App.jsx               # 顶栏导航 + 路由 + Toast + 加载态
    ├── main.jsx              # Router（basename 跟随部署路径）
    ├── store/index.js        # Zustand 全局状态
    ├── lib/api.js            # 接口封装（内部调用本地数据层，无需联网）
    ├── lib/localDb.js        # 本地数据层：签到/专注/收藏/信/胶囊/小事
    ├── lib/utils.js          # 日期 / hash / 双语文本工具
    ├── data/content.js       # 角色 / 台词 / 章节 / 成就 / 出征令
    ├── components/           # MoodButton / ResultCard
    └── pages/                # Home / Hall / Character / Studio / Ritual / Circle / Me
```

## 本地运行

```bash
npm install
npm run dev        # 打开 http://localhost:5173
npm run build      # 产物在 dist/，并把 index.html 复制成 404.html
npm run preview    # 预览构建产物：http://localhost:4173/ankao-haven/
```

首次打开会自动生成本地身份并写入 localStorage，无需注册。

## 部署到 GitHub Pages

1. 仓库 Settings → Pages → Source 选 **GitHub Actions**（只需设置一次）
2. 之后每次 push 到 `main`，`.github/workflows/deploy.yml` 会自动构建并发布
3. 访问地址：`https://<用户名>.github.io/ankao-haven/`

## 数据说明

- 签到、专注、金句本、信件、胶囊、三件小事、设置都只存在当前浏览器
- 换设备、换浏览器、清理缓存 = 重新开始（没有云端备份）
- 研友圈是本地单机版：只能看到并管理自己写的帖子

## 设计要点

- 粉色主题 #d1738f 主色，纸白背景，衬线标题，玻璃态顶栏，Framer Motion 微动画
- 情绪分诊 → 角色结果卡 → 收下 / 换一句；首页今日一句支持中英切换
- 英文角色（Taylor / Mariah）说英文并附中文小字译文，中文角色直接说中文
- 章节分期：>120 天地基期 / 60–120 编曲期 / 20–60 冲刺期 / <20 上台期
