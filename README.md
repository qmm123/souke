# 搜课PC(前后端不分离)

## 命令

```
npm install     // 安装gulp及插件
+ 建议安装cnpm，下载node包速度会快一些，下面是安装指令   // mac安装需要sudo权限
+ npm install -g cnpm --registry=https://registry.npm.taobao.org
npm run dev     // 启动开发版本，不压缩，启用css map
npm run pro     // 启动生产版本，压缩图片和js，不启用css map，不启动本地sever(用于上线)
npm run mock     // 启动开发版本，不压缩，启用css map，开启mock-server（==该版本自动刷新功能不起作用==）
npm run clean   // 删除dist文件夹(需在gulp do之前执行)
npm run sftp    // 将 dist/** 上传至sftp（上传至本地研发服务器）

```

## 文件编译规则

## 目录结构
<pre>
暂无
</pre>

## 模拟数据
1. 在src/Ajaxs 放置自己模拟数据的json文件（目录层级最好根据后端的控制器方法来组织）。
2. 执行命令

```
npm run mock     // 启动开发版本，不压缩，启用css map，开启mock-server（==该版本自动刷新功能不起作用==）
```
3. 调用
假设src/Ajaxs 现在有如下文件 /categories/getCategorieThree.json

```
$.post("/categories/getCategorieThree", {a: 123}, function (data) {
	console.log(data)
})
```

## css3兼容性速查
http://caniuse.com/#search=%3A%3Aafter