function mousewheel(dom, cb, bool) {
    /*
    e.wheelDetail 的值是正值方向向上，负值向下；
    */
    var type = "mousewheel";
    if (dom.onmousewheel === undefined) {
        type = "DOMMouseScroll"
    }
    //真正的事件函数
    function typeFn(e) {
        e = e || window.event;
        //把滚轮的方向处理成一致
        e.wheelDetail = e.wheelDelta / 120 || e.detail / -3;
        // 阻止默认行为
        if (!!bool) {
            if (e.preventDefault) {
                e.preventDefault()
            } else {
                e.returnValue = false;
            }
        }
        cb.call(this, e)
    }
    if (dom.addEventListener) {
        dom.addEventListener(type, typeFn)
    } else {
        dom.attachEvent("on" + type, typeFn)
    }
}
export default mousewheel