# 介绍

bpm 是为 brix 提供的面向组件开发，基于 npm 的包管理工具。

# 安装

```bash
npm install brix-bpm -g
```

# 使用

## 注册

bpm 同 npm 一样，发布组件前需要在注册服务器上进行注册，命令是：

```bash
bpm adduser
```

根据提示完成即可。阿里用户请使用与域账号相同的用户名进行注册，密码则可以不同。

## 初始化工程

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

## 初始化组件

在组件目录中( _components/component_name_ )执行：

```shell
bpm init
```

会生成一个 `package.json` 文件，以下两项必选：

 - `name`，格式如 `namespace_subname`
 - `version`，建议采用 [semver](http://semver.org/) 规范（[中文版](http://www.cnblogs.com/yaoxing/archive/2012/05/14/semantic-versioning.html)）

另外，还可以用 `dependencies` 配置此组件的依赖。当组件被安装时，其依赖也会被安装到 `imports` 目录中。

`package.json` 示例如下：

```js
{
    "name": "etao.ux.ehome_hotsale",
    "version": "0.0.1"
}
```

[参考此例](https://github.com/etaoux/bpm-test/blob/master/projects/etao.ux.x1/components/abc/package.example.json)。

## 发布组件

在组件目录中执行：

```shell
bpm publish
```

将组件发布到中央库，并同时存放在 `exports/component/version/` 目录中。

发布完成之后，可以到 [一淘 UX 规范中心](http://ux.etao.com/jades) 查看
（由于定时任务暂时还没跑起来，需要知会逸才手工同步）。

## 安装组件

在工程目录中执行：

```shell
bpm install namespace_component
```

组件 __及其依赖__ 会被安装到 `imports/namespace/component/version/` 目录中

可安装组件可到[中心库](http://ux.etao.com/jades/)查询

# 升级

bpm 还是一个新生项目，将会持续的进行改进，如果你发现什么问题，不如先尝试 ```npm update brix-bpm -g```看看勤奋的开发者有没有已经修复这个问题。如果还是不行的话，欢迎到Issues中进行提交，或直接联系开发者，谢谢。
