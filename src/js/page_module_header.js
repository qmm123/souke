/**
 * [headFn 头部下拉菜单]
 * @return {[type]} [description]
 */
function headDrap(){
  $("#showtoplist").on("mouseover", function(){
    $(this).find("ul").show();
  }).on("mouseout", function(){
    $(this).find("ul").hide();
  });

  var timer = null;

  $("#nav").on("mouseenter", ".jg", function(){
    clearTimeout(timer);
    $(this).find("a").addClass("active");
    $(this).parents("#nav").find(".navcontent").show();
  }).on("mouseleave", ".jg", function(){
    var $this = $(this);
    // console.log($this.find("ul"))
    timer = setTimeout(function(){
      $this.find("a").removeClass("active");
      $this.parents("#nav").find(".navcontent").hide();
    }, 300);
    
  });

  $(".navcontent").on("mouseenter", function(){
    clearTimeout(timer);
    $(this).parents("#nav").find(".navcontent").show();
  }).on("mouseleave", function(){
    $(this).parents("#nav").find(".navcontent").hide();
    $(this).parents("#nav").find(".active").removeClass("active");
  });
}
