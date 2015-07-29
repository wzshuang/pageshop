window.console = window.console || (function(){  
    var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile  
    = c.clear = c.exception = c.trace = c.assert = function(){};  
    return c;  
})();

//获取查询参数
var getQueryString = function(key){
    var url = location.search;
    var therequest = new Object();
    if(url.indexOf("?")!= -1){
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0;i<strs.length;i++){
            therequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    
    if(key){
    	return therequest[key];
    } else {
    	return therequest;
    }
}

//根据请求的参数，自动勾选相应的菜单
var selectMenu = function(menuIds){
	if(!!menuIds){
		var ids = menuIds.split(",");
		$(ids).each(function(){
			$("#" + this).prop("checked", true).change();
		});
	}
};

//清除指定的覆盖物
var clearOverlay = function(){
	map.clearOverlays();
	$(distanceTool.getAllOverlays()).each(function(){
		map.addOverlay(this);
	});
	$(markerTool._overlays).each(function(){
		map.addOverlay(this);
	});
};

$.ajaxSetup({
	type: "GET",
	dataType: "JSON",
	beforeSend: function(){
		this._methodName = this.url;
		this.url = Config().path + "/api/" + this.url;
	},
	dataFilter: function(data){
		return data;
	}
});

/*
//调用接口举例。url是接口名
$.ajax({
	url: "getAllSwdByHdpk",
	success: function(data){
	},
	error: function(data){
	}
});
*/

//全部清除
$(".clear-condition").click(function(){
	$(".dzhdt").find("span").each(function(){
		var id=$(this).attr("id").substring("condition_".length);
		$("#"+id).removeAttr("checked");
		$(this).remove();
	});
	$(".ul_list li").children(":checkbox").removeAttr("checked");
	clearOverlay();
	$(".hide-add-sp").hide();
});

//阻止事件冒泡
$(".ul_3 li").on({
	click: function(e){
		e.stopPropagation();
	}
});

//测距
$("#range").click(function(){
	markerTool.close();
	distanceTool.open();
});
//标记
$("#mark").click(function(){
	distanceTool.close();
	markerTool.open();
});
//添加视频
$(".hide-add-sp").click(function(){
	enableSp();
	//spaddTool.open();
});

//父checkbox是否全选
var selectAllOrNot = function(li){
	if(li.find("ul:first").children("li").children(":checkbox").not(":checked").size() > 0){
		li.children(":checkbox").prop("checked", false);
	} else {
		li.children(":checkbox").prop("checked", true);
	}
}

//获取选中的航道id
var getSelectedHd = function(){
	var array = [];
	$("#hd").parent().find("ul :checkbox").each(function(){
		if($(this).is(":checked")){
			array.push($(this).attr("id"));
		}
	})
	return array.join(",");
}
var getSelectMenuId = function(id){
	var array = [];
	$("#"+id).parent().find(".second_menu").each(function(){
		var third = $(this).parent().find(".third_menu");
		if(third.size() > 0){
			$(third).each(function(){
				if($(this).is(":checked")){
					array.push($(this).attr("id"));
				}
			});
		} else {
			if($(this).is(":checked")){
				array.push($(this).attr("id"));
			}
		}
	});
	return array.join(",");
}

var addConditionSpan = function(id, text, type){
	if($("#condition_" + id).size() == 0){
		var img = $("<img style='width:12px;height:12px;margin-left:3px;margin-bottom:3px;cursor:pointer;' src='"+Config().path+"/themes/default/images/dzdt/clear.png'>");
		var span = $("<span id='condition_"+id+"' for='"+id+"'>"+ text +"</span>");
		span.append(img);
		span.data("menu-type", type || 1);
		$(".clear-condition").before(span);
		img.on({
			click: function(){
				removeConditionSpan(id);
				$("#" + id).prop("checked", false).change();
				 if ($("#spjk").is(':checked')) {
		              $(".hide-add-sp").show();
		          }else{
		        	  $(".hide-add-sp").hide();
		          }
			}
		});
	}
}
var removeConditionSpan = function(id){
	$("#condition_" + id).remove();
}

function reloadMenu(){//动态获取子菜单（暂定二级、三级）
	//一级菜单
	$(".ul_list").children("li").each(function(){
		var li = $(this);
		li.children(":checkbox").on({
			change: function(){
				//console.log("一级菜单change事件=========");
				li.find(":checkbox").prop("checked", $(this).is(":checked"));
				var id = $(this).attr("id");
				if($(this).is(":checked")){
					//移除掉所有的子菜单， 然后添加一级菜单
					li.find(":checkbox").each(function(){
						removeConditionSpan($(this).attr("id"));
					});
					var text = li.children("label").text();
					addConditionSpan(id, text);
				}else{
					//移除掉所有的子菜单和一级菜单
					li.find(":checkbox").each(function(){
						removeConditionSpan($(this).attr("id"));
					});
				}
				$("body").trigger("conditionChange");
			}
		});
	});
	//二级菜单
	$(".ul_list").on("change", ".second_menu", function(){
		//console.log("二级菜单change事件=========");
		var li = $(this).parent();
		li.find(":checkbox").prop("checked", $(this).is(":checked"));
		var li_first = li.parent("ul").parent("li");
		selectAllOrNot(li_first);
		//先判断一级菜单选中状态
		var flag_first = li_first.children(":checkbox").is(":checked");
		if(flag_first) {
			li_first.find(":checkbox").each(function(){
				var id = $(this).attr("id");
				removeConditionSpan(id);
			})
			var label = li_first.children("label");
			var id = label.attr("for");
			var text = label.text();
			addConditionSpan(id, text);
		} else {
			//把一级菜单去掉
			removeConditionSpan(li_first.children(":checkbox").attr("id"));
			
			li_first.find(".second_menu").each(function(){
				var label = $(this).parent().children("label");
				//如果二级菜单选中，把三级菜单去掉，然后添加二级菜单
				if($(this).is(":checked")){
					var thirdMenus = $(this).parent().find(".third_menu");
					$(thirdMenus).each(function(){
						removeConditionSpan($(this).attr("id"));
					});
					addConditionSpan(label.attr("for"), label.text(), 2);
				} else {
					//如果二级菜单没有选中，从条件中删除二级菜单，添加三级菜单
					removeConditionSpan(label.attr("for"));
				}
			})
		}
		$("body").trigger("conditionChange");
	});
	//三级菜单
	$(".ul_list").on("change", ".third_menu", function(){
		//console.log("三级菜单change事件=========");
		var li = $(this).parent();
		var li_second = li.parent("ul").parent("li");
		selectAllOrNot(li_second);
		var li_first = li_second.parent("ul").parent("li");
		selectAllOrNot(li_first);
		//先判断一级菜单选中状态
		var flag_first=li_first.children(":checkbox").is(":checked");
		if(flag_first){
			li_first.find(":checkbox").each(function(){
				var id = $(this).attr("id");
				removeConditionSpan(id);
			})
			var label = li_first.children("label");
			var id = label.attr("for");
			var text = label.text();
			addConditionSpan(id, text);
		} else {
			//把一级菜单去掉
			removeConditionSpan(li_first.children(":checkbox").attr("id"));
			
			li_first.find(".second_menu").each(function(){
				var second_menu = $(this);
				var label = second_menu.parent().children("label");
				var thirdMenus = second_menu.parent().find(".third_menu");
				//如果二级菜单选中，把三级菜单去掉，然后添加二级菜单
				if(second_menu.is(":checked")){
					$(thirdMenus).each(function(){
						removeConditionSpan($(this).attr("id"));
					});
					addConditionSpan(label.attr("for"), label.text(), 2);
				} else {
					//如果二级菜单没有选中，从条件中删除二级菜单，添加三级菜单
					removeConditionSpan(label.attr("for"));
					$(thirdMenus).each(function(){
						var label = $(this).parent().children("label");
						if($(this).is(":checked")){
							addConditionSpan(label.attr("for"), label.text(), 3);
						} else {
							removeConditionSpan(label.attr("for"));
						}
					});
				}
			})
		}
		$("body").trigger("conditionChange");
	});
	
	var ajax1 = $.ajax({
		url:"getAllHd",
		success: function(data){
			if(data==null){
				return false;
			}
			$(data).each(function(){
				var id=this.hdpk;
				var name=this.hdmc;
				$("#hd").parent().children("ul").append("<li><input class='second_menu' type='checkbox' id=\""+id+"\"/><label for="+id+">"+name+"</label></li>");
			});
			
			//默认选中所有的航道
			if(!getQueryString("menuId")){
				$("#" + FirstMenuId.HD).prop("checked", true).change();
				$("#" + FirstMenuId.DM).prop("checked", true).change();
			}
			
			var hdIds = getSelectedHd();
			
			$.when(
				$.ajax({
					url:"getHbBySjId?hdpk=" + hdIds,
					data:{
						"hbId":"hb"
					}
				}),
				$.ajax({
					url:"getAllShss?hdpk=" + hdIds,
					data:{
						"ssId":"shss"
					}
				})
			).then(function(data1, data2){
				$(data1[0]).each(function(){
					var id=this.hbId;
					var name=this.hbmc;
					$("#hb").parent().children("ul").append("<li><input class='second_menu' type='checkbox' id=\""+id+"\"/><label for="+id+">"+name+"</label><ul class='ul_3 ul_k3'></ul></li>")
					$.ajax({
						url:"getHbBySjId?hdpk=" + hdIds,//获取三级
						data:{
							"hbId":id
						},
						success:function(data11){
							$(data11).each(function(){
								var id_1=this.hbId;
								var name_1=this.hbmc;
								$("#"+id).parent().children("ul").append("<li><input class='third_menu' type='checkbox' id=\""+id_1+"\"/><label for="+id_1+">"+name_1+"</label></li>")
							});
							$("body").trigger("thirdMenuReady");
						}
					});
				});
				
				$(data2[0]).each(function(){
					var id=this.sjssId;
					var name=this.sjssmc;
					$("#shss").parent().children("ul").append("<li><input class='second_menu' type='checkbox' id=\""+id+"\"/><label for="+id+">"+name+"</label><ul class='ul_3 ul_k3'></ul></li>")
					$.ajax({
						url:"getAllShss?hdpk=" + hdIds,//获取三级
						data:{
							"ssId":id
						},
						success:function(data21){
							$(data21).each(function(){
								var id_1=this.sjssId;
								var name_1=this.sjssmc;
								$("#"+id).parent().children("ul").append("<li><input class='third_menu' type='checkbox' id=\""+id_1+"\"/><label for="+id_1+">"+name_1+"</label></li>");
							});
							$("body").trigger("thirdMenuReady");
						}
					});
				});
			});
		}
	});
}
$(function(){
	reloadMenu();
});

var thirdMenuReadyCount = 0;

$("body").on({
	conditionChange: function(){
		console.log("======condition change");
		clearOverlay();
		$(".dzhdt").find("span").each(function(){
			var id = $(this).attr("id").substring("condition_".length);
			
			if(!$("#"+id).hasClass("first_menu")){
				var firstLi = $("#"+id).parents(".ul_2").parent();
				id = $(firstLi).children(":checkbox").attr("id");
			}
			
			switch(id){
			case FirstMenuId.HD: //航道
				break;
			case FirstMenuId.SW: //水位
				getAllSwd();
				break;
			case FirstMenuId.DM: //断面
				//debugger;
				getDM();
				break;
			case FirstMenuId.HB: //航标
				getAllHb(id);
				break;
			case FirstMenuId.SHSS: //三河设施
				getShss(id);
				break;
			case FirstMenuId.JTL: //交通量
				getAllGcd();
				break;
			case FirstMenuId.LEDP: //led屏
				getAllLed();
				break;
			case FirstMenuId.GZC: //工作船
				getAllGzc();
				break;
			case FirstMenuId.SPJK: //视频监控
				getAllSpjk();
				break;
			case FirstMenuId.ZJXMJG: //在建项目监管
				getAllZjxm();
				break;
			default: //二级三级菜单
				break;
			}
		});
	},
	thirdMenuReady: function(){ //三级菜单加载完成事件
		thirdMenuReadyCount++;
		if(thirdMenuReadyCount == 2){
			selectMenu(getQueryString("menuId"));
		}
	}
});

//由于一级菜单的id开发阶段不能确定，所以写到一个配置项里
var FirstMenuId = {
	HD: "hd", //航道
	SW: "sw", //水位
	DM: "dm", //断面
	HB: "hb", //航标
	SHSS: "shss", //三河设施
	JTL: "jtl", //交通量
	LEDP: "ledp", //LED屏
	GZC: "gzc", //工作船
	SPJK: "spjk", //视频监控
	ZJXMJG: "zjxmjg" //在建项目监管
}


var LinkAddress = {
	
}
