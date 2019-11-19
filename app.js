

var Koa = require('koa');
var config = require('./config');//配置文件
var login_token = require('./controller/token_middleware');//验证后台
var AS = require('./access_token_management/access_token');//access_token管理对象
var koaBody = require('koa-body');//请求数据解析
var api_control = require('./controller/api_middleware');//微信api的本地封装



var app = new Koa();


// 使用koa-body中间件,koa-body也是返回一个定义好的中间件函数，参数是ctx和next
// 然后在这里通过app.use() push一下
app.use(koaBody());


//验证后台是否可用的token,如果是get说明是为了验证后台可用，如果是post，交给下边的中间件
app.use(login_token(config.wechat));


//逻辑处理，AS时刻提供有效的access_token
//还有一个WXApi的对象封装，用于微信接口的请求
app.use(api_control(new AS(config.wechat)));



app.listen(80,'0.0.0.0');


