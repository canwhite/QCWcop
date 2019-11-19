/*
access_token的管理，封装成对象，启动起来全局可用
保证始终有最新的access_token可以使用
*/
var request = require('bluebird').promisify(require('request'));
var fs = require('fs');
var path = require('path');
// var access_token_file = path.join(__dirname,'./access_token_file/wechat.txt');
var access_token_file = path.resolve(__dirname, '..')+'/access_token_file/wechat.txt';  


var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
    accessToken:prefix+'token?grant_type=client_credential'
}

function AS(opts){
    this.access_token = '';
    this.expires_in = '';//有效时间
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    
	this.fetchAccessToken();//取来access_token
}

//获取存储的内容
AS.prototype.getAccessToken = function(){
	return new Promise( 
        (resolve,reject)=>{
		fs.readFile(access_token_file,function(err,content){
			if(err) {reject('err')}
			else {resolve(content)};
		});
    })
};
 
//存内容
AS.prototype.saveAccessToken = function(content){
	return new Promise(function(resolve,reject){
		fs.writeFile(access_token_file,content,function(err){
			if(err) reject('err');
			else resolve();
		});
	});
}


//获取access_token的控制函数
AS.prototype.fetchAccessToken = async function(){

    //进来之后，直接先读
    var data = await this.getAccessToken();
    if(data !='err' && data!='' && data != null && data != undefined){
        if(!this.isvalidAccessToken(data)){
            var data = await this.updateAccessToken();
            //判断data
            if(data == 'err'){
                return;
            }
            if(data!='' && data !=null && data !=undefined){
                this.expires_in = data.expires_in;
                this.accessToken = data.access_token;
                
            }
            this.saveAccessToken(JSON.stringify(data));
        }
    }
    

   //如果有这两个值了看看是不是过期了
   if(this.access_token && this.expires_in){
        //如果无效就去请求
        if(!this.isvalidAccessToken(this)){
            var data = await this.updateAccessToken();
            //判断data
            if(data == 'err'){
                return 'update err';
            }
            if(data!='' && data !=null && data !=undefined){
                this.expires_in = data.expires_in;
                this.accessToken = data.access_token;
            }
            this.saveAccessToken(JSON.stringify(data));
        
        }
   }else{
        //如果这倆值直接为空
        var data = await this.updateAccessToken();
        //判断data
        if(data == 'err'){
            return;
        }
        if(data!='' && data !=null && data !=undefined){
            this.expires_in = data.expires_in;
            this.accessToken = data.access_token;
            this.saveAccessToken(JSON.stringify(data));
                
        }

   }

}

//判断access_token是否有效的函数
AS.prototype.isvalidAccessToken = function(data){
	if(!data || !data.access_token || !data.expires_in) return false;
	var expires_in = data.expires_in;
    var now = new Date().getTime();
    //如果时间还没有到有效时间，说明现在的access还是有效
	return (now < expires_in) ? true : false;
}



//更新access_token的方法
AS.prototype.updateAccessToken = function(){
    //这里边就要去完成请求了
    var appID = this.appID;
    var appSecret = this.appSecret;
    //请求链接拼出来
    var url = api.accessToken + '&appid='+ appID +'&secret='+ appSecret;
    return new Promise((resolve,reject)=>{
		request({url:url,json:true}).then((response)=>{
            var data = response.body;
            //当前时间
            var now = new Date().getTime();
            //计算出有效时间
			var expires_in = now + (data.expires_in - 20) * 1000;   //考虑到网络延迟、服务器计算时间,故提前20秒发起请求
            //将有效时间给当前对象
            data.expires_in = expires_in;
			resolve(data);
		},(err)=>{
            reject('err');
        });
	});
}

module.exports = AS;





