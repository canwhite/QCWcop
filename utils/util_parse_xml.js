var xml2js = require('xml2js');
//直接通过这一步之后，已经可以看到键值对了，但是值还是数组格式，所以还需要再格式化一下
exports.parseXMLAsync = function(xml){
	return new Promise((resolve,reject)=>{
		xml2js.parseString(xml,{trim:true},function(err,content){
			err ? reject('err') : resolve(formatMessage(content.xml));
		})
	});
}
//然后我们我们格式化一下
function formatMessage(result){
    var message = {};
    if(typeof result === 'object'){
        var keys = Object.keys(result);
        for(var i=0;i<keys.length;i++){
            var key = keys[i];
            var item = result[key];
            if(!(item instanceof Array) || item.length === 0) continue;
            if (item.length === 1){
                var val = item[0];
                if (typeof val === 'object') message[key] = formatMessage(val);
                else message[key] = (val || '').trim();
            }else{
                message[key] = [];
                for(var j=0,k=item.length;j<k;j++) message[key].push(formatMessage(item[j]));
            }
        }
    }
    return message;
}
