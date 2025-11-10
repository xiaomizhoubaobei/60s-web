# 60s-web
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x%20%7C%2022.x-brightgreen.svg)](https://nodejs.org/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Open Source Love png1](https://raw.githubusercontent.com/ellerbrock/open-source-badges/master/badges/open-source-v1/open-source.png)](https://github.com/ellerbrock/open-source-badges/)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/xiaomizhoubaobei/60s-web/badge)](https://scorecard.dev/viewer/?uri=github.com/xiaomizhoubaobei/60s-web)

一个现代化的 React 应用，用于展示和访问各类信息 API 服务，包括每日 60 秒、微博热搜、知乎热榜、百度热搜、抖音热点、天气信息、在线翻译等。

## 项目特点

- 响应式设计，支持深色模式
- 使用 TypeScript 进行类型安全开发
- 基于 Vite 的快速开发体验
- 使用 Tailwind CSS 进行现代化样式设计
- 支持路由导航和浏览器历史记录管理
- 本地存储主题设置
- 丰富的数据展示功能，包括新闻、热搜、天气、翻译等

## 功能特性

### 首页功能
- **多类别导航**：包含每日60秒、微博热搜、知乎热榜、百度热搜、抖音热点等多个内容类别
- **直观界面**：每个类别配有图标、颜色标识和简要描述
- **主题切换**：支持深色/浅色模式切换，设置自动保存到本地存储

### 详情页功能
- **新闻展示**：以卡片形式展示新闻标题、封面图、热度和发布时间
- **外部链接**：支持点击新闻卡片或链接图标在新窗口打开原文
- **天气信息**：展示温度、湿度、风力、气压、降水量、空气质量等详细天气数据
- **在线翻译**：支持多语言翻译功能，包括英语、日语、韩语、法语、德语、西班牙语、俄语等

### 数据展示
- **新闻类**：微博热搜、知乎热榜、百度热搜、抖音热点等实时数据
- **每日60秒**：每天60秒读懂世界，包含新闻列表和相关链接
- **天气数据**：实时天气信息和空气质量指数
- **翻译功能**：快速文本翻译服务

## 技术栈

- **React**: 前端 UI 库
- **TypeScript**: 类型安全
- **Vite**: 构建工具和开发服务器
- **Tailwind CSS**: 样式框架
- **Radix UI**: 可访问的 UI 组件
- **Lucide React**: 图标库
- **Recharts**: 图表库
- **Zod**: 运行时类型验证

## API 服务

本项目使用60s API 提供的数据服务，详情请参考 [60s API 文档](https://github.com/vikiboss/60s),需要自己搭建后端服务。
若不想搭建可以使用我已经内置的API服务,请访问 [60s API](https://60s.mizhoubaobei.top)

## Docker 镜像

项目提供 ARM64 和 AMD64 架构的预构建 Docker 镜像：

- GitHub Container Registry 仓库：`ghcr.io/xiaomizhoubaobei/60s-web`
- 支持的架构：`amd64`, `arm64`
- 标签：
  - `latest` - 最新版本
  - `v1.0.0` - 版本标签(示例标签)

使用方法：
```bash
# 拉取镜像
docker pull ghcr.io/xiaomizhoubaobei/60s-web:latest

# 运行容器(需要映射容器的5173端口到宿主机任意端口)
docker run -d -p 8080:5173 ghcr.io/xiaomizhoubaobei/60s-web:latest
```

Docker 镜像已自动构建并推送至 GitHub Container Registry，支持多架构，可以在不同硬件平台上运行。

## 安装与运行

### 环境要求

- Node.js (v18.0.0 或更高版本)
- yarn (推荐使用 yarn 进行依赖管理)

### 环境变量配置

项目支持通过环境变量自定义 API 地址。如果需要使用自己的 API 服务，请按以下步骤配置：

1. 在项目根目录创建 `.env` 文件
2. 添加以下内容：

   ```env
   VITE_API_BASE_URL=https://your-api-domain.com/v2
   ```
   
如果没有配置环境变量，项目将默认使用 `https://60s.mizhoubaobei.top/v2` 作为 API 地址。

### 开发模式

1. 克隆仓库：
   ```bash
   git clone <repository-url>
   cd 60s-web
   ```

2. 安装依赖：
   ```bash
   yarn install
   ```

3. 启动开发服务器：
   ```bash
   yarn dev
   ```

4. 在浏览器中访问 `http://localhost:5173`（或终端显示的其他端口）查看应用

### 生产模式

1. 构建应用：
   ```bash
   yarn build
   ```

2. 启动预览服务器：
   ```bash
   yarn preview
   ```

### 其他命令

- 检查类型错误：`yarn type-check`
- 代码检查：`yarn lint`
- 修复代码格式：`yarn lint:fix`

## 项目结构

```
src/
├── components/          # React 组件
│   ├── HomePage.tsx     # 首页组件
│   ├── DetailPage.tsx   # 详情页组件
│   ├── WeatherWidget.tsx # 天气组件
│   └── ui/              # UI 组件库 (基于 Radix UI)
├── hooks/              # 自定义 React hooks
├── lib/                # 工具函数库
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口文件
└── assets/             # 静态资源
```

## 主题切换

应用支持深色模式切换，主题设置会保存在本地存储中。

## 浏览器兼容性

- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- 支持浏览器历史记录和地址栏导航

## 部署

应用构建后可以部署到任何支持静态文件托管的平台，如 Vercel、Netlify、GitHub Pages等等。

## 贡献
欢迎贡献代码！请遵循以下步骤：
1. Fork 本仓库
2. 创建新分支 (`git checkout -b feature/your-feature-name`)
3. 提交更改 (`git commit -m 'Add some feature'`)
4. 推送到分支 (`git push origin feature/your-feature-name`)
5. 创建 Pull Request
6. 等待审核和合并

## 许可证
本项目使用 MIT 许可证。

## 联系我们
联系我们：issues 页面提交问题或建议。

## 鸣谢
60s-web 的开发依赖于以下开源项目：
- [React](https://reactjs.org/)：一个用于构建用户界面的JavaScript库。
- [TypeScript](https://www.typescriptlang.org/)：一种由微软开发的开源编程语言，是JavaScript的一个超集。
- [Vite](https://vitejs.dev/)：一个由Vue.js作者尤雨溪开发的快速前端构建工具。
- [Tailwind CSS](https://tailwindcss.com/)：一个实用主义的CSS框架，用于快速构建自定义设计。
- [Radix UI](https://radix-ui.com/)：一个用于构建高质量、可访问的UI组件的开源库。
- [Lucide React](https://lucide.dev/)：一个轻量级的图标库，提供React组件形式的图标。

## 贡献者
- [xiaomizhoubaobei](https://github.com/xiaomizhoubaobei)
- [Vikiboss](https://github.com/vikiboss)

## 免责声明
60s-web 仅供学习使用，请勿用于商业用途。

感谢使用 60s-web！如果有任何问题或建议，请随时提出。