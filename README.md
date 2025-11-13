# 60s-web
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x%20%7C%2022.x-brightgreen.svg)](https://nodejs.org/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Open Source Love png1](https://raw.githubusercontent.com/ellerbrock/open-source-badges/master/badges/open-source-v1/open-source.png)](https://github.com/ellerbrock/open-source-badges/)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/xiaomizhoubaobei/60s-web/badge)](https://scorecard.dev/viewer/?uri=github.com/xiaomizhoubaobei/60s-web)

一个现代化的 React 应用，用于展示和访问各类信息 API 服务，包括每日 60 秒、微博热搜、知乎热榜、百度热搜、抖音热点、天气信息、在线翻译等。项目基于 Vite + TypeScript + Tailwind CSS 构建，提供响应式设计和深色模式支持，实现了一个功能丰富的信息聚合平台。

## 项目特点

- 响应式设计，支持深色模式
- 使用 TypeScript 进行类型安全开发
- 基于 Vite 的快速开发体验
- 使用 Tailwind CSS 进行现代化样式设计
- 支持路由导航和浏览器历史记录管理
- 本地存储主题设置
- 丰富的数据展示功能，包括新闻、热搜、天气、翻译等
- 使用 Radix UI 组件库构建可访问的用户界面
- 集成 Recharts 用于数据可视化图表展示

## 功能特性

### 首页功能
- **多类别导航**：包含每日60秒、微博热搜、知乎热榜、百度热搜、抖音热点等多个内容类别
- **直观界面**：每个类别配有图标、颜色标识和简要描述
- **主题切换**：支持深色/浅色模式切换，设置自动保存到本地存储
- **响应式布局**：适配桌面端和移动端设备

### 详情页功能
- **新闻展示**：以卡片形式展示新闻标题、封面图、热度和发布时间
- **外部链接**：支持点击新闻卡片或链接图标在新窗口打开原文
- **天气信息**：展示温度、湿度、风力、气压、降水量、空气质量等详细天气数据
- **在线翻译**：支持多语言翻译功能，包括英语、日语、韩语、法语、德语、西班牙语、俄语等
- **数据可视化**：使用 Recharts 展示相关数据图表
- **图片懒加载**：优化用户体验和页面加载速度

### 数据展示
- **新闻类**：微博热搜、知乎热榜、百度热搜、抖音热点等实时数据
- **每日60秒**：每天60秒读懂世界，包含新闻列表和相关链接
- **天气数据**：实时天气信息和空气质量指数
- **翻译功能**：快速文本翻译服务
- **数据缓存**：本地缓存机制提升数据加载速度

## 技术栈

- **React 18**: 前端 UI 库，使用函数组件和 Hooks
- **TypeScript 5**: 类型安全和智能提示
- **Vite 6**: 构建工具和开发服务器，提供快速热更新
- **Tailwind CSS 3**: 原子化 CSS 框架
- **Radix UI**: 原始可访问的 UI 组件
- **Lucide React**: 一致的图标库
- **Recharts 2**: 基于 D3 的图表库
- **Zod**: 运行时类型验证
- **date-fns**: 日期处理库
- **lucide-react**: 精美的图标组件
- **next-themes**: 主题切换管理
- **cmdk**: 命令面板组件
- **react-hook-form**: 表单验证和管理
- **react-resizable-panels**: 可调整大小的面板组件
- **sonner**: 现代化通知组件
- **tailwind-merge**: 用于合并 Tailwind CSS 类名
- **tailwindcss-animate**: 动画工具类

## API 服务

本项目使用60s API 提供的数据服务，详情请参考 [60s API 文档](https://github.com/vikiboss/60s),需要自己搭建后端服务。
若不想搭建可以使用我已经内置的API服务,请访问 [60s API](https://60s.mizhoubaobei.top)

### API 配置

项目支持自定义 API 服务地址，可以通过环境变量进行配置：
- `VITE_API_BASE_URL`: 自定义 API 基础地址（默认为 `https://60s.mizhoubaobei.top/v2`）


## 安装与运行

### 环境要求

- Node.js (v18.0.0 或更高版本)
- yarn 或 npm (推荐使用 yarn 进行依赖管理)

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
   git clone https://github.com/xiaomizhoubaobei/60s-web.git
   cd 60s-web
   ```

2. 安装依赖：
   ```bash
   yarn install
   # 或者使用 npm
   # npm install
   ```

3. 启动开发服务器：
   ```bash
   yarn dev
   # 或者使用 npm
   # npm run dev
   ```

4. 在浏览器中访问 `http://localhost:5173`（或终端显示的其他端口）查看应用

### 生产模式

1. 构建应用：
   ```bash
   yarn build
   # 或者使用 npm
   # npm run build
   ```

2. 启动预览服务器：
   ```bash
   yarn preview
   # 或者使用 npm
   # npm run preview
   ```

## 项目结构

```
src/
├── components/          # React 组件
│   ├── HomePage.tsx     # 首页组件，包含导航和类别展示
│   ├── DetailPage.tsx   # 详情页组件，展示具体数据内容
│   ├── WeatherWidget.tsx # 天气组件，展示天气信息
│   └── ui/              # UI 组件库 (基于 Radix UI)
│       ├── accordion.tsx    # 手风琴组件
│       ├── alert-dialog.tsx # 警告对话框组件
│       ├── alert.tsx        # 提示组件
│       ├── avatar.tsx       # 头像组件
│       ├── badge.tsx        # 徽章组件
│       ├── button-group.tsx # 按钮组组件
│       ├── button.tsx       # 按钮组件
│       ├── card.tsx         # 卡片组件
│       ├── checkbox.tsx     # 复选框组件
│       ├── dialog.tsx       # 对话框组件
│       ├── dropdown-menu.tsx # 下拉菜单组件
│       ├── input.tsx        # 输入框组件
│       ├── label.tsx        # 标签组件
│       ├── popover.tsx      # 弹出框组件
│       ├── radio-group.tsx  # 单选组组件
│       ├── select.tsx       # 选择器组件
│       ├── separator.tsx    # 分隔符组件
│       ├── sheet.tsx        # 面板组件
│       ├── skeleton.tsx     # 骨架屏组件
│       ├── spinner.tsx      # 加载指示器组件
│       ├── switch.tsx       # 开关组件
│       ├── table.tsx        # 表格组件
│       ├── tabs.tsx         # 标签页组件
│       ├── textarea.tsx     # 文本域组件
│       ├── toast.tsx        # 通知组件
│       ├── toggle-group.tsx # 切换组组件
│       └── toggle.tsx       # 切换组件
├── hooks/              # 自定义 React hooks
│   ├── use-mobile.tsx  # 移动端检测 hook
│   └── use-toast.ts    # 通知管理 hook
├── lib/                # 工具函数库
│   ├── api.ts          # API 请求封装
│   ├── fanyi.ts        # 翻译功能实现
│   └── utils.ts        # 通用工具函数
├── App.tsx             # 主应用组件，路由配置
├── main.tsx            # 应用入口文件
├── App.css             # 全局样式
├── index.css           # Tailwind CSS 配置
└── assets/             # 静态资源
    └── react.svg       # React 图标
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

在提交代码前，请确保：
- 遵循项目现有的代码风格
- 添加必要的测试用例
- 更新相关文档

## 许可证
本项目使用AGPL v3许可证。详情请查看 [LICENSE](./LICENSE) 文件。

## 联系我们
- 通过 [GitHub Issues](https://github.com/xiaomizhoubaobei/60s-web/issues) 提交问题或建议
- 联系项目维护者：[@xiaomizhoubaobei](https://github.com/xiaomizhoubaobei)
## 鸣谢

60s-web 的开发依赖于以下开源项目：
- [React](https://reactjs.org/)：一个用于构建用户界面的JavaScript库
- [TypeScript](https://www.typescriptlang.org/)：一种由微软开发的开源编程语言，是JavaScript的一个超集
- [Vite](https://vitejs.dev/)：一个由Vue.js作者尤雨溪开发的快速前端构建工具
- [Tailwind CSS](https://tailwindcss.com/)：一个实用主义的CSS框架，用于快速构建自定义设计
- [Radix UI](https://radix-ui.com/)：一个用于构建高质量、可访问的UI组件的开源库
- [Lucide React](https://lucide.dev/)：一个轻量级的图标库，提供React组件形式的图标
- [Recharts](https://recharts.org/)：基于 D3 的图表库
- [Zod](https://zod.dev/)：TypeScript-first schema declaration and validation library
- [date-fns](https://date-fns.org/)：现代JavaScript日期工具库

## 贡献者
- [xiaomizhoubaobei](https://github.com/xiaomizhoubaobei) - 项目创建者和主要维护者
- [Vikiboss](https://github.com/vikiboss) - API 提供者

## 免责声明
60s-web 仅供学习和参考使用，请勿用于商业用途。项目中展示的数据来源于第三方API，开发者不对数据的准确性和完整性负责。

感谢使用 60s-web！如果有任何问题或建议，请随时提出。