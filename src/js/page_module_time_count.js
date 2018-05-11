/**
 * [timeCount 倒计时]
 * @param  {[string]} sEle  [盛放时间的元素]
 * @param  {[number]} iTime [总倒计时秒数]
 * @param  {[function]} call  [秒数 <= 0 时的回调]
 * @return {[null]}       [null]
 */
function timeCount(sEle, iTime, call){
    var iTime = iTime;
    $(sEle).html(iTime);
    var timer = setInterval(function(){
        iTime -= 1;
        $(sEle).html(iTime);
        if(iTime <= 0){
            clearInterval(timer);
            call && call();
        }
    }, 1000);
}