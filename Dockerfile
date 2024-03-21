FROM node:lts-alpine


# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV CHROME_BIN=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    LANG=zh_CN.UTF-8 \
    LANGUAGE=zh_CN.UTF-8 \
    LC_ALL=zh_CN.UTF-8  \
    TZ=Asia/Shanghai \
    PORT=8080


# Create app directory
ADD . /app/
WORKDIR /app

# Installs latest Chromium (100) package.
RUN  sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories && \
      apk update && \
      apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont  \
      ttf-dejavu wqy-zenhei \
      dbus \
      && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
      && echo "Asia/Shanghai" > /etc/timezone \
      && rm -rf /var/cache/apk/* \
      && rm -rf /tmp/* \
      && rm -rf /var/tmp/* \
      && yarn 

      
 






EXPOSE 8080

CMD [ "npm", "run", "dev"]