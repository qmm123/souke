/**
 * [sideBarRight 右侧固定侧边栏]
 * @return {[type]} [description]
 */
function sideBarRight(){
  $(".fixedMenu .tel, .fixedMenu .erwei").on("mouseover", function(){
    $(this).find(".show").show();
  }).on("mouseout", function(){
    $(this).find(".show").hide();
  });

  $(".fixedMenu .qq").on("click", function(){
    window.location.href = "tencent://message/?uin=1278230143&Site=&menu=yes";
  });

  $(".fixedMenu .totop").on("click", function(){
    $("body,html").animate({"scrollTop":0})
  });
}