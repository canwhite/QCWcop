var rawBody = require('raw-body');
var parse_util = require('../utils/parse_xml')
var WXApi = require('../model/wx_api');

module.exports = function(AS){


    /*
        （1）在这里接收客户端POST请求发过来的数据
        （2）所有的请求操作都交给wxApi，结果存在Promise里边并返回，在这里通过async/await获取
    */
    return  async (ctx)=>{
        //AS提供始终有效的access_token
        var access_token = AS.access_token;
        //实际上一进来就应该有一个setmenu的，回头给它加上
       

        //创建一个model对象
        var wxApi = new WXApi(access_token);


        //通过await拿到POST过来异步请求的原始XML数据
        var data = await rawBody(ctx.req,{
            length: ctx.req.length,
            limit: "1mb",
            encoding: ctx.req.charset
        });
        //使用xml工具，将xml解析成我们熟悉的对象模式
        var message = await parse_util.parseXMLAsync(data);
        console.log('~~~~~~~~~~~~',message);
        /*
            ~~~~~~~~~~~~ {  ToUserName: 'gh_4aa55fc55c91',
                            FromUserName: 'oWOpF0mzSt93PDGgMT_muURQ4twk',
                            CreateTime: '1574136143',
                            MsgType: 'text',
                            Content: '你好',
                            MsgId: '22536209720399804' }

        */
        

        //如果别人发送过来的是文本内容
        if(message.MsgType == 'text'){
            var createTime = new Date().getTime();
            
            // ctx.body = '<xml>'+
            //         '<ToUserName><![CDATA['+ message.FromUserName +']]></ToUserName>'+
            //         '<FromUserName><![CDATA['+ message.ToUserName +']]></FromUserName>'+
            //         '<CreateTime>'+createTime+'</CreateTime>'+
            //         '<MsgType><![CDATA[text]]></MsgType>'+
            //         '<Content><![CDATA[我们一起玩耍～]]></Content>'+
            //         '</xml>'

            
            var content = '我们一起玩耍呀';
            var xml =  await wxApi.replay(content,message);

            ctx.body = xml;




        }

        
        



       




    







    }
    


}