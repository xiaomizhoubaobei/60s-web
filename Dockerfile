#-----------------------------------------
# 1. 依赖 & 构建阶段
#-----------------------------------------
FROM node:lts AS builder

RUN curl -fsSL https://classic.yarnpkg.com/install.sh | bash
ENV PATH="/root/.yarn/bin:$PATH"

WORKDIR /app

# 先复制依赖描述文件，充分利用缓存
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# 再复制源码并构建
COPY . .
RUN yarn build

#-----------------------------------------
# 2. 运行阶段（仅产物 + serve）
#-----------------------------------------
FROM node:lts

# 安装一个极简静态服务器
RUN corepack enable && \
    yarn global add serve --silent && \
    yarn cache clean --all

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/dist ./dist

# 创建非 root 用户（Debian 语法）
RUN groupadd -r nodejs && \
    useradd -r -u 1001 -g nodejs -d /app -s /bin/false vite && \
    chown -R vite:nodejs /app

USER vite

# serve 默认监听 0.0.0.0，无需额外配置
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]