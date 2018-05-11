// 头部-搜索区域
var HeaderSearch = {
  init: function (opt) {
    this.config(opt);
    this.selectCityEvent();
  },
  config: function (opt) {
    var defaults = {
      selectCity: "selectCity",//选择城市id
      tplCity: "tplCity",//城市模板id
      callClick: ""//点击事件回调
    }
    this.option = $.extend({}, defaults, opt);
    this.selectCity = $("#" + this.option.selectCity);
  },
  // 选择城市
  selectCityEvent: function () {
    var _this = this;
    this.selectCity.click(function () {
      _this.option.callClick && _this.option.callClick();
    });
  },
  // 弹窗
  openLayer: function (data) {
    layer.open({
      type: 1,
      title: "欢迎来到小禾教育，请您选择合适的校区以方便您的孩子报读学习",
      content: $("#" + this.option.tplCity).html(),
      area: ["760px", "350px"],
      skin: "select_city"
    });
  }
}