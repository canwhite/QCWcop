# QCWcop
用koa2.x进行微信公众平台开发，写了一整套开发框架
<br/>
## use
使用方法很简单:  
1.根目录下的config.js中填写你公众平台里边获取的appId、appSecret和token  
2.加载三方包
```
npm i
```  
3.一个云服务器，具体的配置在我的CSDN博客里有  
[阿里云配置](https://blog.csdn.net/dangbai01_/article/details/102821023)  
## desc：
主要模块介绍:  

1.access_token_management  
```
负责管理access_token如果请求的时候过期了，会自动更新，并且保存到本地access_token_file文件夹下
```  

2.controller
```
中间件，主要用作控制流程，写逻辑，封装好在入口app.js中调用
```  

3.model  
```
为流程提供数据，主要是调用微信接口，返回数据，里边的调用方法都返回了Promise，方便在controller中async/await调用
```  

4.view_json  
```
eg:setMenu之类的发送给微信的样式json
```  

5.utils  
```
主要是接收xml的解析和返回xml的包装工具
```

