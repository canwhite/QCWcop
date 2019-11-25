var rawBody = require('raw-body');
var parse_util = require('../utils/util_parse_xml')
var WXApi = require('../model/wx_api');
var menu = require('../view_json/menu');
var obj_eq = require('../utils/util_obj_equal');

module.exports = function(AS){
    /*
        （1）在这里接收客户端POST请求发过来的数据
        （2）所有的请求操作都交给wxApi，结果存在Promise里边并返回，在这里通过async/await获取
    */
    return  async (ctx)=>{
        //AS提供始终有效的access_token
        //实际上一进来就应该有一个setmenu的，回头给它加上
        //创建一个model对象
        var wxApi = new WXApi(AS);
        
        //通过await拿到POST过来异步请求的原始XML数据
        var data = await rawBody(ctx.req,{
            length: ctx.req.length,
            limit: "1mb",
            encoding: ctx.req.charset
        });
        //使用xml工具，将xml解析成我们熟悉的对象模式
        var message = await parse_util.parseXMLAsync(data);
        console.log('~~~~~~~~~~~~',message);


       //先获取菜单
       var menuData = await wxApi.getMenu();
       console.log('~~~~~~~',menuData);

       //如果前比对不一致
       if(!obj_eq.isObjectValueEqual(menuData,menu)){
           var delete_data = await wxApi.deleteMenu();
           console.log('~~~~~~~',delete_data);
           if(delete_data == 'err'){
               var create_data = await wxApi.createMenu(menu);
               console.log('~~~~~~~',create_data);
               if(create_data && create_data != 'err'){
                   console.log('创建菜单成功');
               }else{
                   console.log('创建菜单失败,注意个人订阅号没有自定义菜单功能');
               }
           }
       }
        


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