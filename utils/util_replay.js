var tpl = require('./util_replay_wrapper');
exports.tpl = function(content,message){
	var info = {};
	var type = 'text';
	var fromUserName = message.FromUserName;
	var toUserName = message.ToUserName;

	if(Array.isArray(content)) type = 'news';
	type = content.type || type;
	info.content = content;
	info.createTime = new Date().getTime();
	info.msgType = type;
	info.fromUserName = toUserName;
	info.toUserName = fromUserName;

	return tpl.compiled(info);
}