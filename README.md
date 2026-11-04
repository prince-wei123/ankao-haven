# 岸上见 · 考研避难所（最终版）

一个给考研人的「避难所」。不是打卡工具，是一个有人等你回来的地方。

- 全栈真实网站：React 前端 + Express 后端 + SQLite 数据库
- 部署到公网后，任何朋友点开链接就能用，看到的页面和你完全一样
- 每人独立匿名身份与数据；只有「研友墙」是公开的
- 不排名、不惩罚、断签不扣分

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 · Vite 5 · Tailwind 3 · Framer Motion · Zustand · React Router |
| 后端 | Node.js · Express 4 · better-sqlite3 |
| 部署 | Railway（完整 Node 进程 + 可写文件系统 + 自动 HTTPS） |

## 目录结构

```
ankao-haven/
├── index.html               # Vite 入口
├── vite.config.js           # 开发代理 /api → :3001
├── tailwind.config.js       # 暖橙棕设计 token
├── postcss.config.js
├── railway.json             # Railway 构建/启动/健康检查配置
├── .nvmrc                   # 指定 Node 22
├── server/                  # 后端
│   ├── prod.js              # 生产入口：托管 dist + API（同源）
│   ├── index.js             # 开发入口（CORS + 路由）
│   ├── db.js                # SQLite 初始化 + 8 张表
│   ├── middleware/auth.js   # 匿名 token 认证
│   └── routes/              # auth/checkins/focus/favs/letters(+capsules)/wall/settings/tiny
└── src/                     # 前端
    ├── App.jsx              # 顶栏导航 + 路由 + Toast + 加载态
    ├── store/index.js       # Zustand 全局状态
    ├── lib/api.js           # fetch 封装 + 匿名 token 自动管理
    ├── lib/utils.js         # 日期 / hash / 双语文本工具
    ├── data/content.js      # 角色 / 台词 / 章节 / 成就 / 出征令
    ├── components/          # MoodButton / ResultCard
    └── pages/               # Home / Hall / Character / Studio / Ritual / Circle / Me
```

## 本地运行

```bash
# 1. 装依赖（Node 20–26）
npm install
cd server && npm install && cd ..

# 2. 开发模式（前端 5173 + 后端 3001，自动热更新）
npm run dev
# 打开 http://localhost:5173

# 3. 生产模式（构建后由 Express 统一托管，推荐用于验收）
npm run build
npm start
# 打开 http://localhost:3001
```

首次打开会自动生成匿名 token 并写入 localStorage，无需注册。

## 部署到公网（Railway）

1. 推代码到 GitHub：
   ```bash
   git init && git add . && git commit -m "岸上见 最终版"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/ankao-haven.git
   git push -u origin main
   ```
2. Railway → New Project → Deploy from GitHub repo → 选择该仓库。
   `railway.json` 会自动执行：`npm install && npm run build && cd server && npm install --omit=dev`，启动 `node prod.js`。
3. 部署完成后在 Settings → Networking 点 Generate Domain，得到
   `https://<项目名>.up.railway.app`，把这个链接发给朋友即可。

### 必须做：让数据不丢

Railway 容器重建会清空容器内文件，所以 **SQLite 必须挂在 Volume 上**：

1. 项目里 Add → Volume，挂载路径填 `/data`
2. 服务 Variables 增加 `DB_PATH=/data/haven.db`
3. 重新部署一次

之后每次重新部署，用户数据都会保留。

## API

```
POST   /api/auth/anonymous      生成匿名 token
GET    /api/auth/me             校验 token

GET    /api/checkins?limit=30   签到历史
POST   /api/checkins            今日签到（同一天 upsert）
PUT    /api/checkins/:id        标记「收下了」
GET    /api/checkins/stats      累计天数 / 连续天数 / 最近心情

GET    /api/focus?days=30       专注记录
POST   /api/focus               记录专注分钟

GET/POST/DELETE  /api/favs      金句本

GET/POST         /api/letters          写信 / 列表
POST             /api/letters/:id/open 拆信

GET/POST         /api/capsules          封存 / 列表
POST             /api/capsules/:id/open 到日期后才能拆

GET/POST         /api/wall             研友墙（公开，限 200 条）
DELETE           /api/wall/:id         作者删除

GET/PUT          /api/settings         名字 / 考试日
GET/PUT          /api/tiny             今日三件小事
GET              /api/health           健康检查
```

## 数据表

users / checkins / focus / favs / letters / capsules / wall_posts / tiny

## 设计要点

- 暖橙棕 #c17b5c 主色，纸白背景，衬线标题，玻璃态顶栏，Framer Motion 微动画
- 情绪分诊 → 角色结果卡 → 收下 / 换一句；首页今日一句支持中英切换
- 英文角色（Taylor / Mariah）说英文并附中文小字译文，中文角色直接说中文
- 章节分期：>120 天地基期 / 60–120 编曲期 / 20–60 冲刺期 / <20 上台期
- 匿名 token（nanoid）存 localStorage，后端按 token 关联，用户彼此不可见

## 隐私

- 私密：签到、专注、金句本、信件、胶囊、三件小事、设置
- 公开：仅研友墙
- 不采集任何实名信息，不需要注册登录
