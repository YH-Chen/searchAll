#### 背景

第一种情况：

一般浏览习惯，会收藏一些页面，久而久之，收藏夹中存储过多，即使对页面进行分组也不好查找；

`chrome://bookmarks`可以打开标签管理，但是跳转页面对用户始终是不友好的

第二种情况：

浏览器意外关闭，忘记保存页面，下次要找的时候就不太容易；

同样`chrome://history`

chrome浏览器支持自定义扩展，给开发者带来了更好的体验



#### chrome扩展程序

[详细教程](http://open.chrome.360.cn/extension_dev/overview.html)

一个扩展程序应包含文件：

+ 一个manifest.json
+ html文件
+ js文件
+ icon图标

##### manifest.json

> 包含一个扩展程序的注册信息

```json
{
  // 必须的字段
  "name": "My Extension",
  "version": "versionString",
  "manifest_version": 2,
  // 建议提供的字段
  "description": "A plain text description",
  "icons": { ... },
  "default_locale": "en",
  // 多选一，或者都不提供
  "browser_action": {...},
  "page_action": {...},
  "theme": {...},
  "app": {...},
  // 根据需要提供
  "background": {...},
  "chrome_url_overrides": {...},
  "content_scripts": [...],
  "content_security_policy": "policyString",
  "file_browser_handlers": [...],
  "homepage_url": "http://path/to/homepage",
  "incognito": "spanning" or "split",
  "intents": {...}
  "key": "publicKey",
  "minimum_chrome_version": "versionString",
  "nacl_modules": [...],
  "offline_enabled": true,
  "omnibox": { "keyword": "aString" },
  "options_page": "aFile.html",
  "permissions": [...],
  "plugins": [...],
  "requirements": {...},
  "update_url": "http://path/to/updateInfo.xml",
  "web_accessible_resources": [...]
} 
```

> **browser actions**  可以在chrome主工具条的地址栏右侧增加一个图标。作为这个图标的延展，一个browser action图标还可以有[tooltip](http://open.chrome.360.cn/extension_dev/browserAction.html#tooltip)、[badge](http://open.chrome.360.cn/extension_dev/browserAction.html#badge)和[popup](http://open.chrome.360.cn/extension_dev/browserAction.html#popups)。

```json
{
  "name": "My extension",
  ...
  "browser_action": {
    "default_icon": "images/icon19.png", // optional 
    "default_title": "Google Mail",      // optional; shown in tooltip 
    "default_popup": "popup.html"        // optional 
  },
  ...
}
```

> **permissions** 扩展程序将使用的一组权限。

```json
"permissions": 
[    
	"tabs",    
	"bookmarks",    
	"http://www.blogger.com/",    
	"http://*.google.com/",    
	"unlimitedStorage"  
], 
```

> **manifest_version** 用整数表示manifest文件自身格式的版本号。
>
> **content_security_policy** 为缓解潜在的大规模的跨站点脚本攻击问题，Chrome扩展系统已遵循[ **Content Security Policy (CSP)**](http://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html)的理念，引入了严格的策略使扩展更安全，同时提供创建和实施策略规则的能力，这些规则用以控制扩展（或应用）能够加载的资源和执行的脚本。
>
> 定义`manifest_version`为2的扩展才会默认开启内容安全策略。

```json
"content_security_policy": script-src 'self'; object-src 'self'
```

放宽默认策略（白名单）

```json
// 允许加载 https://example.com 上的脚本
"content_security_policy": "script-src 'self' https://example.com; object-src 'self'"
```



#### searchAll

> 查询 浏览器收藏夹 和 历史浏览记录

效果如下：

![http://oxv1k8kvi.bkt.clouddn.com/18-9-29/88468247.jpg](http://oxv1k8kvi.bkt.clouddn.com/18-9-29/88468247.jpg)

文件目录：

![http://oxv1k8kvi.bkt.clouddn.com/18-9-29/56623319.jpg](http://oxv1k8kvi.bkt.clouddn.com/18-9-29/56623319.jpg)

+ manifest.json

  ```json
  {
  
    "manifest_version": 2,
    "content_security_policy": "script-src 'self' https://ajax.googleapis.com; object-src 'self'",
  
    "permissions": [
      "bookmarks",	// 访问 书签 权限
      "history"		// 访问 历史记录	权限
    ],
  
    "browser_action": {
      "default_title": "SearchAll",  // brower_action 名称（鼠标悬停显示）
      "default_icon": "icon.png",	   // 任务栏 图标
      "default_popup": "popup.html"  // 弹框 样式
    }
  }
  ```

+ popup.html

  ```html
  <html>
  <head>
      <script src="bookmarks.js"></script>	<!--加载 bookmarks脚本-->
      <script src="history.js"></script>	<!--加载 history脚本-->
  </head>
  <body>
      <div>
          <!--输入框-->
          <label for="search">Search:&emsp;</label><input id="search" autofocus="autofocus">
      </div>
      <div id="records">
          <label for="bookmarks" id="label_marks"></label>
          <ul id="bookmarks"></ul> 	<!--标签列表-->
          <label for="history" id="label_history"></label>
          <ul id="history"></ul>		<!--历史纪录列表-->
      </div>
  </body>
  </html>
  ```

+ bookmarks.js

  > 通过getTree方法可以获得用户完整的书签树。

  ```js
  chrome.bookmarks.getTree(function(bookmarkArray){
      //TODO: 对用户书签树进行处理，这里是将搜索到的每个连接加入到`id="bookmarks"`的<ul>中
  });
  ```

  > 点击链接，实现跳转
  >
  > 这里使用到`tabs`标签，chrome标签模块被用于和浏览器的标签系统交互。
  >
  > [create](http://open.chrome.360.cn/extension_dev/tabs.html#method-create) 和 [update](http://open.chrome.360.cn/extension_dev/tabs.html#method-update) 不需要申请`tabs`权限

  ```js
  const li = $('<li>');
  const anchor = $('<a>');
  anchor.attr('href', bookmarkNode.url);
  anchor.text(bookmarkNode.title ? bookmarkNode.title : bookmarkNode.url);
  anchor.click(function () {
      chrome.tabs.create({url: bookmarkNode.url});
  });
  li.append(anchor);
  ```

+ history.js

  > 读取历史记录。Chrome提供了search和getVisits两种方法读取历史。通过search方法可以读取匹配指定文字，指定时间区间，指定条目的历史结果。

  ```js
  chrome.history.search({
      text: 'xxx',	// 筛选文本
      startTime: new Date().getTime()-24*3600*1000,	
      endTime: new Date().getTime(),	// 时间区间
      maxResults: 20	// 筛选数目
  }, function(historyItemArray){
      // TODO: 处理得到的历史纪律，同样添加到`id="history"`的<ul>中，并创建`tabs`标签，实现链接跳转
  });
  ```



#### 最后一步

+ 安装

  将本地文件加载到chrome浏览器，可以进行调试

  ![http://oxv1k8kvi.bkt.clouddn.com/18-9-29/80438282.jpg](http://oxv1k8kvi.bkt.clouddn.com/18-9-29/80438282.jpg)

+ 打包

  对本地文件进行封装，得到一个crx文件（扩展程序）和一个pem私钥文件（更新使用），得到crx文件，可以进行发布，提供给其他用户使用

  ![http://oxv1k8kvi.bkt.clouddn.com/18-9-29/21012087.jpg](http://oxv1k8kvi.bkt.clouddn.com/18-9-29/21012087.jpg)

+ 发布

  太贵了，开发者验证要`$5.00`，而且只能发布20个程序，而且不支持支付宝微信银联

  给个链接，自己看吧  —— [登录应用市场](https://chrome.google.com/webstore/developer/)