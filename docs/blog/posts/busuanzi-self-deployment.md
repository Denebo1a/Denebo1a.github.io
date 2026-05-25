---
layout: article
title: 为VitePress博客自部署一个不蒜子Docker吧~
date: 2026-05-09
category: 日常折腾
tags: [VitePress, docker, 不蒜子]
cover: /blog/covers/default.png
summary: 由星辰大佬开源的开源自部署不蒜子服务！
---

对于 VitePress 这样的**静态博客框架**而言，访问统计这种对于动态网站信手拈来的功能，难免要绕上一点远路。

由[不如](https://ibruce.info/)大佬开发的[不蒜子](https://www.busuanzi.cc/)就是一个针对静态建站框架的优秀解决方案，只需要一行脚本+一行标签，即可实现网站访问量(PV)、访客数(UV)和页面阅读量的访问数据实时统计与前端展示。

不过随着用户的增多等客观原因，官方服务难免会有不稳定的问题。针对这个痛点，也有很多大佬给出了解决方案。冲浪之余，我翻到了2024年的这篇博客，站长[清羽飞扬](https://blog.liushen.fun/)老师使用了由[星辰](https://blog.xsot.cn/)大佬开发的[开源不蒜子服务](https://github.com/soxft/busuanzi)，这个项目通过`Go`和`redis`实现了类似不蒜子的访问统计功能，并且支持多种部署方式，如果手头上正好有闲置的服务器资源，那么使用`Docker`部署一个自用的不蒜子服务，就是一个很香的选择了：
- 可以获取稳定可控的服务质量
- 可以更全面地接管访问统计数据的备份/迁移
- 自建服务运行起来资源占用极小，个人使用的程度几乎完全不会有性能负载

## 服务端部署
### 配置`docker-compose.yaml`
在服务器上配置好`Docker`环境就可以开始啦。要把服务跑起来，我们还需要相关的`Docker`镜像以及配置。我们可以在[项目的文档](https://busuanzi.apifox.cn/doc-5083724)中找到作者给出的样例`docker-compose.yaml`:

```yaml
version: "3.8"

services:
  redis:
    image: "redis:alpine"
    volumes:
      - ./data/redis:/data                              # 将 redis 数据库的挂载到
  
  bsz:
    image: "xcsoft/busuanzi:latest"
    ports:
      - "8080:8080"                                     # 修改映射到宿主机的端口 host:container
    volumes:
      - /data/bsz:/app/expose
    links:
      - redis
    depends_on:
      - redis
    environment:
      WEB_LOG: true                                     # 是否开启日志
      WEB_DEBUG: false                                  # 是否开启debug模式
      WEB_CORS: "*"                                     # 跨域访问
      BSZ_EXPIRE: 0                                     # 统计数据过期时间 单位秒, 请输入整数 (无任何访问, 超过这个时间后, 统计数据将被清空, 0为不过期)
      BSZ_SECRET: "bsz"                                 # 签名密钥，请设置为任意长度的随机值
      API_SERVER: http://127.0.0.1:8080                 # 填写你的 API 地址
      REDIS_ADDRESS: redis:6379                         # redis 地址，默认为
      BSZ_PATHSTYLE: true
      BSZ_ENCRYPT: MD516
```

这份配置文件组织相当清楚，一个`redis`数据库服务 + 一个`Go`编写的访问统计服务，为了保证数据的持久存储以及后续对不蒜子服务的若干自定义实现，这里的`volumes`配置千万不能略去。

除此之外，我们需要自主修改的部分主要是环境变量`environment`部分，可以按照自己的实际情况设置。

这边比较重要的字段有：
- `API_SERVER`字段：代表着不蒜子服务启动后监听的地址/端口，也对应之后客户端配置中的请求的地址/端口。
- `WEB_CORS`：如果不希望不蒜子服务被他人随意调用，也可以在这个字段指定自己的网站域名，禁止其他来源的跨域访问。

### 转向本地构建
那么按照正常流程，我们只需要在服务器上新建一个目录，在里面放上这份修改后的`docker-compose.yaml`，接着使用命令:

```bash
docker compose up -d    # -d 参数表示服务在后台静默运行
```

拉取镜像并启动服务，就大功告成了。

这也是清羽飞扬大佬验证过的方式，不过我在实践时却遇到了问题：拉取第二个`bsz`服务时，fetch 镜像`image: "xcsoft/busuanzi:latest"`超时了，也许是因为这份两年前的配置文件中所写的镜像仓库现在已经不可用了。

幸亏只是网络问题，在各种网络环境下尝试无果后，我突然想起这是一个开源项目，这也就意味着我们可以自己使用源码构建镜像，而无需依赖镜像仓库源了（这时候才想起来吗你这家伙）。

项目仓库也提供了用于本地构建的`docker-compose.build.yaml`，并且有配套的`DockerFile`。

不过我们已经按照自己的配置改好了`docker-compose.yaml`，将其中的的`image: "xcsoft/busuanzi:latest"`一行修改为`build: .`，即可得到一份用于本地构建的配置，不必再修改仓库中的`docker-compose.build.yaml`

我们可以直接在服务器`clone`仓库以后，进入项目根目录文件夹，替换我们的`docker-compose.yaml`，直接本地构建镜像：

```bash
docker compose up -d    # 再来一遍
```

在安装过程中，我发现，由于已过去两年，`Dockerfile`中的一些依赖间的版本兼容性已经出现了问题，会引发构建错误中断。调试修复后的版本我放在文末附录了，大家可以点击目录跳转取用。

除此之外，还有一个隐秘的在`Docker`运行时才会触发的错误。`Dockerfile`的最后一行使用`ENTRYPOINT`指定了容器启动时运行的脚本`entrypoint.sh`：

```Dockerfile
ENTRYPOINT  [ "sh", "entrypoint.sh" ]
```
我们直接`clone`下来的项目里，这个脚本使用的是`Windows`格式的换行符`\r\n (CRLF)`，容器的`Linux`环境会则只认识`Unix`格式的换行符`\n (LF)`，这就导致`Shell`脚本中多余的回车符`\r`会被识别为命令参数的一部分，进而导致系统抛出“非法选项”的错误。

> 这便又可以引出另一个话题了，即`Windows/Unix/Mac`上文件的行尾序列以及在`git`协作中如何做统一规范化的问题。<br/>
> 关于这些内容有一篇很棒的知乎专栏[CRLF和LF的差异](https://zhuanlan.zhihu.com/p/380574688)。感兴趣可以阅读一下~

要解决这个问题很简单，如果构建环境有安装现代IDE，比如`VS Code`等，我们可以打开这个.sh脚本，很方便地在状态栏处将行尾序列从`CRLF`修改为`LF`。在`linux`系统下，可以使用`dos2unix`工具进行转换：

```bash
dos2unix entrypoint.sh
```
在服务器上构建镜像也会有一些痛点，尤其是使用硬件性能不那么宽裕的服务器时，若是遇到问题需要反复尝试，缓慢的编译会让调试非常折磨。不过对于这个轻量的项目，这种情况并不会那么突出。

如果个人电脑上安装了`Docker`环境，那么使用性能更好的个人电脑构建完镜像，再推送到服务器上也是一种很优雅的做法。可以使用一些云服务商（如阿里云）提供的免费容器镜像仓库来实现镜像的推送与拉取。

解决了上述这些问题以后，如果两个`Docker`都已经正常工作，且端口正常开放/配置反向代理，我们可以用浏览器访问之前`API_SERVER`指定的地址，如果出现这个默认的面板，就说明我们的服务端已经完成了基本部署啦！

### 数据的备份与迁移

### 服务端自定义
我们之前在`docker-compose.yaml`里添加了`volumes`配置：

```yaml
  bsz:
    image: "xcsoft/busuanzi:latest"
    ports:
      - "8080:8080"                                     
    volumes:
      - /data/bsz:/app/expose                           # 将 Docker 卷内的 /app/expose 映射到宿主机当前目录下的 /data/bsz
```

我们便可以在`docker-compose.yml`所在的目录下找到

## 客户端配置
这个项目在客户端的配置与官方不蒜子服务的形式是几乎完全相同的，只要插入脚本 + 标签就可以实现访问统计 + 前端显示。


## 附录
### 修正后的Dockerfile

```Dockerfile
FROM golang:1.23-alpine AS builder
WORKDIR /app

#ENV GOPROXY=https://goproxy.cn,direct
COPY . .

# 在 Go 构建之前，先使用 go mod tidy 自动修复、清理并对齐所有的 Go 依赖包版本
RUN set -evx -o pipefail        \
    && apk update               \
    && apk add --no-cache git   \
    && rm -rf /var/cache/apk/*  \
    && go mod tidy \
    && go build -ldflags="-s -w" -o busuanzi main.go

FROM node:21-alpine AS ts-builder
WORKDIR /app
COPY ./dist .

# 指定 pnpm 的版本，适应 node:21-alpine 基础镜像较低的 node 版本
RUN set -evx -o pipefail        \
    && npm install -g pnpm@8      \
    && pnpm install             \
    && pnpm run build           \
    && rm -rf node_modules      \
    && rm -rf pnpm-lock.yaml    \
    && rm -rf tsconfig.json

FROM alpine:3.16
WORKDIR /app

COPY --from=builder /app/busuanzi /app
COPY --from=ts-builder /app /app/dist
COPY --from=builder /app/config.yaml /app/config.yaml
COPY --from=builder /app/entrypoint.sh /app

RUN chmod +x /app/entrypoint.sh

EXPOSE 8080
ENTRYPOINT  [ "sh", "entrypoint.sh" ]
```
