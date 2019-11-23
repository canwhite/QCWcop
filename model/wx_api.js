/*
*   用于给controller提供微信相关的数据
*/

var util = require('../utils/util_replay')
var request = require('bluebird').promisify(require('request'));
var fs = require('fs');
var path = require('path');
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var wxapi = {
    //...
    //menu
    menu:{
        create:prefix+'/menu/create?',//access_token=ACCESS_TOKEN 创建菜单
        get:prefix+'/menu/get?', //access_token=ACCESS_TOKE 获取菜单,GET请求
        delete:prefix+'/menu/delete?', //access_token=ACCESS_TOKEN 删除菜单,GET请求
        getInfo:prefix+'get_current_selfmenu_info?' //access_token=ACCESS_TOKEN 获取自定义菜单配置接口
    }

}
function WXApi(access_token){
    
    this.access_token = access_token;
    
    // this.action();//直接默认就执行了

}



/*
    回复信息的封装
*/
WXApi.prototype.replay = (content,message)=>{
    // this.message = message;
    var content = content;
    var message = message;
    return new Promise((resolve,reject)=>{
       var xml = util.tpl(content,message);
       resolve(xml);
    });
}

/*
这部分自定义menu
*/







module.exports = WXApi;

