exports.isObjectValueEqual = function(a,b){

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