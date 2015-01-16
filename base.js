var Util = {
  //获取请求参数
  getParam: function(url, options) {
  	options = options || {};
  	url = (url === null || url === undefined) ? window.location.href : url;
  	var paramsString = "";
  	if (url.indexOf("?")>-1) {
  		var start = url.indexOf("?") + 1;
  		var end = url.indexOf("#")>-1 ? url.indexOf("#") : url.length;
  		paramsString = url.substring(start, end)
  	}
  	var parameters = {};
  	var pairs = paramsString.split(/[&;]/);
  	for (var i = 0, len = pairs.length; i < len; ++i) {
  		var keyValue = pairs[i].split("=");
  		if (keyValue[0]) {
  			var key = keyValue[0];
  			try {
  				key = decodeURIComponent(key)
  			} catch (err) {
  				key = unescape(key)
  			}
  			var value = (keyValue[1] || "").replace(/\+/g, " ");
  			try {
  				value = decodeURIComponent(value)
  			} catch (err) {
  				value = unescape(value)
  			}
  			if (options.splitArgs !== false) {
  				value = value.split(",")
  			}
  			if (value.length == 1) {
  				value = value[0]
  			}
  			parameters[key] = value
  		}
  	}
  	return parameters
  };
}
