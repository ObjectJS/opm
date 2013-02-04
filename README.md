# 介绍

bpm 是为 brix 提供的面向组件开发，基于 npm 的包管理工具。

# 安装

npm install brix-bpm -g

# 使用：

## 注册

bpm 同 npm 一样，发布组件前需要在注册服务器上进行注册，命令是：

```bash
bpm adduser
```

根据提示完成即可。

需要注意的是，这里的验证信息在本机保存在 npm 的配置信息里，为避免 bpm 注册后 npm 无法使用，
请使用同样的用户名密码进行注册。

## 在工程目录中：

### 初始化工程

请自行在工程目录中写一个 package.json，用于描述此工程的一些信息，例如：

```js
{
    "name": "etao.ux.x1", // 命名空间
    "version": "0.0.3", // 版本，暂时没什么用
    "repository": {
        "type": "svn",
        "url": "http://svn.a.b.com/"
    },
    "bpm": {
        "title": "项目名称", // 中文标题，在后台中展示用
        "description": "brix测试项目" // 中文描述
    }
}
```

[参考此例](https://github.com/etaoux/bpm-test/blob/master/projects/etao.ux.x1/package.example.json)。

### 安装组件

```shell
bpm install namespace_component
```

组件 __及其依赖__ 会被安装到 `imports/namespace/component/version/` 目录中

## 在组件目录中：

### 初始化组件

```shell
bpm init
```

会生成一个 package.json，其中的 name 是 `namespace\_subname` 格式的，`version` 必选。
`dependencies` 用于配置此组件的依赖，当组件被安装时，其依赖也会被安装到 `imports` 目录中，比如：

```js
{
    "name": "etao.ux.ehome_hotsale",
    "version": "0.0.1"
}
```

[参考此例](https://github.com/etaoux/bpm-test/blob/master/projects/etao.ux.x1/components/abc/package.example.json)。

### 发布组件

```shell
bpm publish
```

将组件发布到中央库，并同时存放在 exports/component/version/ 目录中
