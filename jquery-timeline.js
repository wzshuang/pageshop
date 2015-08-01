;(function($) {
 
    // we need attach the plugin to jQuery's namespace or otherwise it would not be
    // available outside this function's scope
    // "el" should be a jQuery object or a collection of jQuery objects as returned by
    // jQuery's selector engine
    $.fn.timeline = function(options) {
		var that = this;
        // plugin's default options
        // this is private property and is accessible only from inside the plugin
        var defaults = {
 
			list: [],

			//从list中第几个刻度开始
			startPos: 0,

			draggerPos: 0,
			//defaultValue: null,

			//刻度的个数，默认是10个
			size: 10,

            // if your plugin is event-driven, you may provide callback capabilities 
            // for its events. call these functions before or after events of your 
            // plugin, so that users may "hook" custom functions to those particular 
            // events without altering the plugin's code
            onSomeEvent: function() {}
 
        }
 
        // to avoid confusions, use "plugin" to reference the
        // current instance of the  object
        var plugin = this;
 
        // this will hold the merged default, and user-provided options
        // plugin's properties will be accessible like:
        // plugin.settings.propertyName from inside the plugin or
        // myplugin.settings.propertyName from outside the plugin
        // where "myplugin" is an instance of the plugin
        plugin.settings = {}
 
        // the "constructor" method that gets called when the object is created
        // this is a private method, it can be called only from inside the plugin
		var leftWidth = 15, rightWidth = 15, liWidth = 60;
        var init = function() {
 
            // the plugin's final properties are the merged default and 
            // user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);
 
            // make the collection of target elements available throughout the plugin
            // by making it a public property
            plugin.el = that;
 
            // code goes here
			
			var timeline_left = '<div class="timeline-left"></div>';
			var timeline_right = '<div class="timeline-right"></div>';
			var timeline_dragger = '<div class="timeline-dragger"></div>';
			var timeline_list = '<div class="timeline-list">';
			var timeline_scale_start = '<ul class="timeline-scale">';
			var timeline_list_scale_end = '</ul></div>';
			var timeline_player = '<div class="timeline-player"><a class="next"></a><a class="pre"></a></div>';
			var li = '';
			var list_length = plugin.settings.list.length;
			
			if(list_length <= 1){
				 throw new Error("刻度值太少，至少需要2个");
			}

			
			/*for(var i=plugin.settings.startPos;i<plugin.settings.startPos + plugin.settings.size;i++){
				li += '<li>'+ plugin.settings.list[i] +'</li>';
			}*/
			for(var i=0;i<plugin.settings.list.length;i++){
				li += '<li>'+ plugin.settings.list[i] +'</li>';
			}
			plugin.el.append(timeline_left + 
							 timeline_right + 
							 timeline_dragger + 
							 timeline_list + 
							 timeline_scale_start + 
							 li + 
							 timeline_list_scale_end +
							 timeline_player);
			if(plugin.settings.startPos < 0 || plugin.settings.startPos > list_length) {
				plugin.settings.startPos = 0;
			}
			if(plugin.settings.startPos + plugin.settings.size > plugin.settings.list.length) {
				plugin.settings.size = plugin.settings.list.length - plugin.settings.startPos;
			}

			/*var draggerPos;
			var defaultValueIndex = plugin.settings.list.indexOf(plugin.settings.defaultValue);
			if((defaultValueIndex - plugin.settings.startPos) > plugin.settings.size){
				draggerPos = 0;
			}else{
				draggerPos = defaultValueIndex - plugin.settings.startPos;
			}*/
			plugin.el.find('.timeline-list').width(plugin.settings.size * liWidth);
			plugin.el.find('.timeline-scale').width((plugin.settings.list.length) * liWidth);
			plugin.el.find('.timeline-list').scrollLeft((plugin.settings.startPos) * liWidth);
			
			plugin.el.find('.timeline-dragger').css('left', leftWidth + (plugin.settings.draggerPos-1)*liWidth + "px");
			plugin.el.find(".timeline-player").css("left", leftWidth + rightWidth + plugin.settings.size*liWidth + "px");
			plugin.el.find(".timeline-right").css("left", leftWidth + plugin.settings.size*liWidth + "px");
			
			if(plugin.settings.draggerPos < plugin.settings.startPos){
				plugin.settings.draggerPos = plugin.settings.startPos;
				plugin.el.find('.timeline-dragger').css('left', leftWidth + 0*liWidth + "px");
			}else if(plugin.settings.draggerPos > plugin.settings.startPos + (plugin.settings.size-1)){
				plugin.settings.draggerPos = plugin.settings.size;
				plugin.el.find('.timeline-dragger').css('left', leftWidth + plugin.settings.size*liWidth + "px");
			} else {
				plugin.el.find('.timeline-dragger').css('left', leftWidth + (plugin.settings.draggerPos - plugin.settings.startPos)*liWidth + "px");
			}
			_bindEvent();
        }
 
        // public methods
        // these methods can be called like:
        // plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
        // myplugin.publicMethod(arg1, arg2, ... argn) from outside the plugin
        // where "myplugin" is an instance of the plugin
 
        // a public method. for demonstration purposes only - remove it!
		plugin.getScale = function() {
			return plugin.settings.list[plugin.settings.draggerPos];
		}

        // private methods
        // these methods can be called only from inside the plugin like:
        // methodName(arg1, arg2, ... argn)
 
        // a private method. for demonstration purposes only - remove it!
		/** 获取鼠标的坐标 */
		var _getMousePoint = function(ev) {
		   ev = window.event || ev; 
		   var x = y = 0,
		   doc = document.documentElement,
		   body = document.body;
		   x = (doc && doc.scrollLeft || body && body.scrollLeft || 0) 
					- (doc && doc.clientLeft || body && body.clientLeft || 0);
		   y = (doc && doc.scrollTop || body && body.scrollTop || 0) 
					- (doc && doc.clientTop || body && body.clientTop || 0);
		   x += ev.clientX;
		   y += ev.clientY;
		   return {
			  'x': x,
			  'y': y
		   };
		}

		//将滑块移动到某一位置，会触发change事件
		var _moveTo = function(pos) {
				if(pos >= (plugin.settings.list.length-1)){
					pos = plugin.settings.list.length-1
				}
				if(pos <= 0){
					pos = 0;
				}
				if(plugin.settings.draggerPos == pos){
					plugin.el.find('.timeline-dragger').stop().animate({
						"left": (leftWidth + (plugin.settings.draggerPos - plugin.settings.startPos)*liWidth) + "px"
					});
				}
				//左移
				if(plugin.settings.draggerPos > pos){
					if(plugin.settings.draggerPos > plugin.settings.startPos){
						var offset = pos - plugin.settings.startPos;
						plugin.el.find('.timeline-dragger').stop().animate({
							'left': leftWidth + offset*liWidth + "px"
						}, function(){
						});
					}else{
						plugin.el.find('.timeline-list').scrollLeft((pos-1) * liWidth);
						plugin.settings.startPos = pos;
					}
				}
				//右移
				if(plugin.settings.draggerPos < pos){
					//滑块没有到达最右边
					if((plugin.settings.draggerPos - plugin.settings.startPos) < (plugin.settings.size-1)){
						plugin.el.find('.timeline-dragger').stop().animate({
							'left': leftWidth + (pos - plugin.settings.startPos)*liWidth + "px"
						}, function(){
						});
					}else{
						var offset = pos - (plugin.settings.size-1);
						plugin.settings.startPos = offset;
						plugin.el.find('.timeline-list').scrollLeft(offset * liWidth);
					}
				}
				plugin.settings.draggerPos = pos;
				plugin.trigger("change", plugin.getScale());
		}
		var _bindEvent = function() {
			plugin.el.find(".timeline-dragger").on({
				mousedown: function(e){
					var dragger = this;
					var downPos = _getMousePoint(e);
					//鼠标按下时滑块的左偏移量
					var downOffset = parseInt($(dragger).css("left"));
					var leftOffset = parseInt(plugin.el.find('.timeline-left').css('left'));
					$(document).on({
						mousemove: function(e){
							var xy = _getMousePoint(e);
							var moveLength = xy.x - downPos.x;
							if(downOffset+liWidth+moveLength <= parseInt(plugin.el.find('.timeline-right').css('left')) + rightWidth
								&& downOffset+moveLength >= leftOffset ){
								$(dragger).css("left", downOffset + (xy.x- downPos.x) + "px");
							}
						},
						mouseup: function(e){
							$(this).off("mousemove mouseup");
							var movePos = Math.round((parseInt($(dragger).css("left"))-leftOffset-leftWidth)/liWidth);
							plugin.settings.draggerPos = plugin.settings.startPos + movePos;
							_moveTo(plugin.settings.startPos + movePos);
						}
					});
				}
			});
			plugin.el.find(".timeline-scale li").on({
				click: function(){
					_moveTo($(this).index());
				}
			});
			
			var nextInterval = null;
			var moveToNext = function(){
				//if(plugin.settings.draggerPos < plugin.settings.list.length){
					_moveTo(plugin.settings.draggerPos + 1);
				//}
			}
			plugin.el.find(".timeline-player .next").on({
				click: function(){
					moveToNext();
				},
				mousedown: function(){
					//moveToNext();
					//nextInterval = setInterval(function(){
					//	moveToNext();
					//}, 500);
				},
				mouseup: function(){
					//clearInterval(nextInterval);
				}
			});
			
			var preInterval = null;
			var moveToPre = function(){
				_moveTo(plugin.settings.draggerPos -1);
			}
			plugin.el.find(".timeline-player .pre").on({
				click: function(){
					moveToPre();
				},
				mousedown: function(){
					//moveToPre();
					//preInterval = setInterval(function(){
					//	moveToPre();
					//}, 500);
				},
				mouseup: function(){
					//clearInterval(preInterval);
				}
			});
		}
 
        // call the "constructor" method
        init();

		return this;
    }
 
})(jQuery);