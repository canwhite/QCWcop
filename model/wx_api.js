/*
*   用于给controller提供微信相关的数据
*/

var util = require('../utils/util_replay')
var request = require('bluebird').promisify(require('request'));
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
function WXApi(AS){
    
    this.AS = AS;
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
自定义menu部分
*/
//创建菜单
WXApi.prototype.createMenu = function(menu){
    var that = this;
	return new Promise(function(resolve,reject){
		that.AS.fetchAccessToken().then(function(data){
			var url = wxapi.menu.create + 'access_token=' + data.access_token;
			request({url:url,method:'POST',body:menu,json:true}).then(function(response){
				var _data = response.body;
				if(_data.errcode === 0){
					resolve(_data.errmsg);
				}else{
					resolve('err');
				}
			}).catch(function(err){
				reject('err');
			});
		});
	});
}
//获取菜单
WXApi.prototype.getMenu = function(){
	console.log('~~~~~~1');
	var that = this;
	return new Promise(function(resolve,reject){
		console.log('~~~~~~2');
		that.AS.fetchAccessToken().then(function(data){
			console.log('~~~~~~3');
			var url = wxapi.menu.get + 'access_token=' + data.access_token;
			request({url:url,json:true}).then(function(response){
				var _data = response.body;
				if(_data.menu){
					console.log('~~~~~~4');
					resolve(_data.menu);
				}else{
					console.log('~~~~~~5');
					resolve('err')
				}
			}).catch(function(err){
				console.log('~~~~~~6');
				reject('err');
			});
		});
	});
}

//删除菜单
WXApi.prototype.deleteMenu = function(){
	var that = this;
	return new Promise(function(resolve,reject){
		that.AS.fetchAccessToken().then(function(data){
			var url = wxapi.menu.delete + 'access_token=' + data.access_token;
			request({url:url,json:true}).then(function(response){
				var _data = response.body;
				if(_data.errcode === 0){
					resolve(_data.errmsg);
				}else{
					resolve('err');
				}
			}).catch(function(err){
				reject('err');
			});
		});
	});
}

module.exports = WXApi;

