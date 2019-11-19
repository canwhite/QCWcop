/*
*   用于给controller提供微信相关的数据
*/

var util = require('../utils/util_replay')
var wxapi = {

}
function WXApi(access_token){
    
    this.message ={};
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


module.exports = WXApi;

