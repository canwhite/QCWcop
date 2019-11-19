/*
接入微信公众号的过程
1. 将token、timestamp和nonce三个参数进行字典排序；
2. 将三个字符串拼接成一个字符串进行sha1加密；
3. 将加密后的字符串与signature进行比较，如果相同，表示这个请求来自微信，我们直接原样返回echostr的内容，接入验证成功。
*/
var sha1 = require('sha1');
//把定义的中间件放回，在app.js中，通过app.use来push,
module.exports = function(opts){
    //实际上这里不用写generato，因为就没有yield
    return async (ctx,next)=>{
        var token = opts.token;
        var signature = ctx.request.query.signature;
        var nonce = ctx.request.query.nonce;
        var timestamp =ctx.request.query.timestamp;
        var echostr = ctx.request.query.echostr;

        //进行字典排序，所谓字典排序，也就是按照字典的字母顺序排序
        var str = [token,timestamp,nonce].sort().join('');
        //进行hash加密
        var hashCode = 　sha1(str);
        //如果是get发过来的请求，说明是验证服务token
        if(ctx.request.method==='GET'){
            ctx.body = ( hashCode===signature) ? echostr+'':'failed';
        }
        //否则就是功能请求
        else if(ctx.request.method === 'POST'){
            if(hashCode != signature) {return 'token failed'}
            //赚到接口控制中间件
            await next();
        }

    }
}
