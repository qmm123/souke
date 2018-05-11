/**
 * 模块--单选和复选框
 */

/**
 * [setCheckBoxStyle 模拟多选--不代理]
 * @param  {[object]} 配置对象 [配置对象]
 *   1.unbind: 有两个参数--过滤不希望绑定click事件的元素
 *     attr：过滤元素的属性
 *     boo：过滤元素的特定属性值-true是过滤点击事件
 *   2.call: 设置完状态后的回调函数--设置完状态后的回调
 * @return {[null]} [null]
 */
function setCheckBoxStyle(opt){
	var opt = opt || {}; //配置对象
	var defaul = {
		unbind: {
			attr: "data-unbind",
			boo: "true"
		}
	};
	var config = $.extend({}, defaul, opt);
	
	var aCheck = $("[data-role='checkbox']");
	var aInput = aCheck.find("input.check_box[type='checkbox']");

	aInput.each(function(i) {
		if(aInput.eq(i).attr("checked") == "checked"){
			aCheck.eq(i).addClass("on");
		};
	});
	aCheck.click(function(){
		var aInput = $(this).find('input.check_box');

		if($(this).attr(config.unbind.attr) == config.unbind.boo){ //过滤不希望绑定click事件的元素
			return false;
		}
		if(aInput.attr("checked") === undefined){
			aInput.attr("checked", "checked");
			$(this).addClass("on");
		}
		else if(aInput.attr("checked") === "checked"){
			aInput.attr("checked", false);
			$(this).removeClass("on");
		}
		config.call && config.call($(this));
	});
}

/**
 * [setCheckboxStyleDelegate 模拟单选选(radio框样式)--代理模式]
 * @param  {[string]} group [分组名称]
 * @param  {[object]} opt [配置项]
 *    opt有以下参数
 *    delegate_ele 事件代理外层元素--冒泡阻止元素
 *    call 发生点击事件元素状态变化后的回调函数
 * @return {[null]} [null]
 */
function setRadioStyleDelegate (group, opt) {
	var opt = opt || {};
	var sDeleEle = opt.delegate_ele ? opt.delegate_ele : document; //代理元素
	var aRadio = $("[data-role='radio'][data-group='"+ group +"']");
	var aInput = aRadio.find("input.radio");

	aInput.each(function(i) {
		if(aInput.eq(i).attr("checked") == "checked"){
			aRadio.eq(i).addClass("on");
		};
	});
	$(sDeleEle).on("click", "[data-role='radio'][data-group='"+ group +"']", function (ev) {
		var oEv = ev || window.event;
		oEv.stopPropagation();
		// if(aRadio.length == 0 && aInput.length == 0){ //修复被代理元素还没有渲染出来的情况
			aRadio = $("[data-role='radio'][data-group='"+ group +"']");
			aInput = aRadio.find("input.radio");
		// }

		aRadio.removeClass("on");
		$(this).addClass("on");
		aRadio.find('input.radio').attr("checked", "");
		$(this).find('input.radio').attr("checked", "checked");
		opt.call && opt.call($(this));
	})
}