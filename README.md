# 安装

npm install objectjs-opm

# 使用：

## 在工程目录中：

### 安装组件

```bpm install namespace_component```

组件会被安装到 imports/ _namespace_ / _component_ / _version_ / 目录中

## 在组件目录中：

### 初始化组件

```bpm init```

会生成一个 package.json

### 发布组件

```bpm publish```

将组件发布到中央库，并同时存放在 exports/ _component_ / _version_ / 目录中
