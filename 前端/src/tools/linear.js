function animation(ele, obj = {}, time = 500, cb = () => { }) {
  
    var startValue = {};
    var changeValue = {};
    var firstTime = new Date();
    var val = getStyle(ele);
    for (var key in obj) {
        startValue[key] = Number.isNaN(parseFloat(val[key])) ? 0 : parseFloat(val[key]);
        changeValue[key] = parseFloat(obj[key]) - startValue[key];
    }
    calculation();
    function calculation() {
        window.requestAnimationFrame = window.requestAnimationFrame || function (sb) {
            return setTimeout(sb, 1000 / 60)
        }
        var nowTime = new Date() - firstTime;
        var scale = nowTime / time;
        if (scale >= 1) {
            scale = 1;
        } else {
            requestAnimationFrame(calculation);
        }
        for (var key in obj) {
            ele.style[key] = startValue[key] + changeValue[key] * scale + 'px';
        }
        if (scale === 1) {
            cb();
        }
    }
    //兼容获取内部css函数
    function getStyle(ele) {
        return ele.currentStyle || getComputedStyle(ele)
    }
}
export default animation