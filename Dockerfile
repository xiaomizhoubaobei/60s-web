# 1. 构建阶段
FROM node:lts AS builder
WORKDIR /app

# 使用系统自带的 yarn（体积最小）
RUN corepack enable && corepack prepare yarn@stable --activate

# 先复制依赖描述文件，充分利用缓存
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# 再复制其余源码
COPY . .
RUN yarn build

# 2. 运行阶段
FROM node:lts
WORKDIR /app

# 仅安装一个静态服务器
RUN yarn global add serve --silent

# 把构建产物拷进来
COPY --from=builder /app/dist ./dist

# 非 root 运行（可选但强烈建议）
RUN addgroup -g 1001 -S nodejs && \
    adduser -S vite -u 1001 -G nodejs && \
    chown -R vite:nodejs /app
USER vite

EXPOSE 5173
# serve 默认就是 0.0.0.0，无需额外配置
CMD ["serve", "-s", "dist", "-l", "5173"]