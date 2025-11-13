#---- 构建阶段 ----
FROM node:lts-alpine AS builder
WORKDIR /app
RUN apk add --no-cache yarn

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY . .
RUN yarn build && yarn cache clean

#---- 运行阶段 ----
FROM nginx:alpine
# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs vite

# 拷贝产物与配置
COPY --from=builder /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

# 降权：让 nginx 以 vite 身份跑
RUN chown -R vite:nodejs /usr/share/nginx/html && \
    chown -R vite:nodejs /var/cache/nginx && \
    chown -R vite:nodejs /var/log/nginx && \
    chown -R vite:nodejs /etc/nginx/conf.d
USER vite

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]