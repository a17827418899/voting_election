# 使用官方 Node.js 镜像作为基础镜像
FROM docker.1ms.run/node:16-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

ENV NODE_ENV=production

# 安装依赖（使用阿里云镜像加速）
RUN npm install --production --registry=https://registry.npmmirror.com

# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 暴露端口（与 Egg.js 配置一致）
EXPOSE 7001

# 启动命令
CMD [ "npm", "start" ]