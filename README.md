# 介绍
bpm 是为 brix 提供的面向组件开发，基于 npm 的包管理工具。

# 安装

npm install brix-bpm

# 使用：

## 在工程目录中：

### 安装组件

```shell
bpm install namespace_component
```

组件 __及其依赖__ 会被安装到 <code>imports/<var>namespace</var>/<var>component</var>/<var>version</var>/</code> 目录中

## 在组件目录中：

### 初始化组件

```shell
bpm init
```

会生成一个 package.json

### 发布组件

```shell
bpm publish
```

将组件发布到中央库，并同时存放在 <code>exports/<var>component</var>/<var>version</var>/</code> 目录中
