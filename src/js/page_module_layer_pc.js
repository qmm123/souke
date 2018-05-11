/**
 * 模块--layer弹窗二次封装
 */

var layerPc = {
 	msg: function (opt) { //弱提示层--限制字符 <=20
 		var opt = opt || {};
 		var defaults = {
 			offset: "160px",
 			define_type: 0, //弹窗状态 0-成功 1-失败
 			contents: "操作失败",
 			time: 3000
 		}
 		var config = $.extend({}, defaults, opt);
 		config.skin = "msg_style_define"; //默认的最外侧layui-layer 的扩展样式，该样式很关键直接影响后面弹窗的样式
 		var sTpl = "<p class='content_icon_zone {define_type}'>" + 
 						"<span class='content_icon {define_type}'>{content}</span>" + 
 					"</p>";

 		if(config.define_type === 0){
 			sTpl = sTpl.replace(/{define_type}/g, "success");
 		}else if(config.define_type == 1){
 			sTpl = sTpl.replace(/{define_type}/g, "fail");
 		}
 		sTpl = sTpl.replace(/{content}/g, config.contents);

 		layer.msg(sTpl, config, function () {
 			config.call && config.call(); //层销毁后的回调函数
 		});
 	}
}