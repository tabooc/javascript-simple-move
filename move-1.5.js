/*
  javascript简易运动框架
  
  Move.action(dom对象,json格式属性值对，缓动参考值，回调方法)

  示例：
  Move.action(box,{width:500,height:200,left:200,top:100,marginLeft:10,opacity:.5},5,function(){
          console.log('end');
  });

*/


var Move = {

  version: '1.5',

  //判断是否空对象
  isEmptyObject: function(obj) {
    for (var attr in obj) {
      return false;
    }
    return true;
  },
  //取CSS样式值
  getStyle: function(obj, attr) {
    if (obj.currentStyle) { //IE
      return obj.currentStyle[attr];
    } else {
      return getComputedStyle(obj, null)[attr];
    }
  },
  //运动
  action: function(obj, json, sv, callback) {

    var _this = this;

    //obj是否为空
    if (_this.isEmptyObject(obj)) {
      return false;
    }

    //运动开始      
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
      var isAllCompleted = true, //假设全部运动都完成了
        speed, //速度
        attrValue, //当前值
        targetV; //目标值
      for (attr in json) {
        attrValue = _this.getStyle(obj, attr);
        switch (attr) {
          case 'opacity':
            attrValue = Math.round((isNaN(parseFloat(attrValue)) ? 1 : parseFloat(attrValue)) * 100);
            speed = (json[attr] * 100 - attrValue) / (sv || 4);
            targetV = json[attr] * 100;
            break;
          default:
            attrValue = isNaN(parseInt(attrValue)) ? 0 : parseInt(attrValue);
            speed = (json[attr] - attrValue) / (sv || 4);
            targetV = json[attr];
        }

        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
        //如果循环过程中存在尚未结束的运动，isAllCompleted为假
        if (attrValue != targetV) {
          isAllCompleted = false;
        }

        switch (attr) {
          case 'opacity':
            {
              obj.style.filter = "alpha(opacity=" + (attrValue + speed) + ")";
              obj.style.opacity = (attrValue + speed) / 100;
            };
            break;
          default:
            obj.style[attr] = attrValue + speed + 'px';
        }
      }

      //所有循环结束后，只有当全部运动结束后（isAllCompleted=true）时才关闭定时器
      if (isAllCompleted) {
        clearInterval(obj.timer);

        if (typeof callback === 'function') {
          callback();
        }

      }
    }, 30);
  }

};
