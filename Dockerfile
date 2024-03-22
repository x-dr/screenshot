# 第一阶段：构建依赖项
FROM node:lts-alpine as builder

WORKDIR /app
COPY package.json ./
RUN yarn install --frozen-lockfile

# 第二阶段：复制构建结果并运行应用程序
FROM node:lts-alpine



WORKDIR /app

# 从第一阶段复制依赖项
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# 设置环境变量
ENV CHROME_BIN=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    LANG=zh_CN.UTF-8 \
    LANGUAGE=zh_CN.UTF-8 \
    LC_ALL=zh_CN.UTF-8  \
    TZ=Asia/Shanghai \
    PORT=8080

RUN mkdir -p /usr/share/fonts/win
COPY ./ttf /usr/share/fonts/win

# 安装 Chromium 和其他依赖项
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      font-adobe-100dpi \
      dbus \
      && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
      && echo "Asia/Shanghai" > /etc/timezone \
      && rm -rf /var/cache/apk/* \
      && rm -rf /tmp/* \
      && rm -rf /var/tmp/* \
      && chmod 777 /usr/share/fonts/win/* \
      && fc-cache -fv \
      && fc-list 




EXPOSE 8080
 
CMD [ "npm", "run", "dev"]
