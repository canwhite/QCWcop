var rawBody = require('raw-body');
var parse_util = require('../utils/parse_xml')
var WXApi = require('../model/wx_api');
var menu = require('../view_json/menu');

/*
判断两个对象是否一致
*/

function isObjectValueEqual(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
  
    if (aProps.length != bProps.length) {
      return false;
    }
  
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
  
      if(a[propName] instanceof Object ){
              if(!isObjectValueEqual(a[propName],b[propName])) return false;
      }
      else if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
}

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
        /*
            ~~~~~~~~~~~~ {  ToUserName: 'gh_4aa55fc55c91',
                            FromUserName: 'oWOpF0mzSt93PDGgMT_muURQ4twk',
                            CreateTime: '1574136143',
                            MsgType: 'text',
                            Content: '你好',
                            MsgId: '22536209720399804' }

        */
               /*
            先去获取菜单
        */
       var menuData = await wxApi.getMenu();
       //如果前比对不一致
    //    if(!isObjectValueEqual(menuData,menu)){
    //        var delete_data = await wxApi.deleteMenu();
    //        if(delete_data != 'err' && delete_data){
    //            var create_data = await wxApi.createMenu(menu);
    //            if(create_data && create_data != 'err'){
    //                console.log('创建菜单成功');
    //            }else{
    //                console.log('创建菜单失败');
    //            }
    //        }
    //    }
        var create_data = await wxApi.createMenu(menu);

        


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