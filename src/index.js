/**
  * @Author: Who am I ?
  * @Time: 2016-09-20
  * @Theme: traffic-light
  * @Get: setTimeout setInterval
  * 
  */

// getDom(selector)
function getDom(selector) {
    return document.querySelectorAll(selector);
}
// 事件监听
function bindEvent(ele,eventType,callback) {
	if (typeof ele.addEventListener==="function") {
		ele.addEventListener(eventType,callback,false);
	} else if (typeof ele.attachEvent==="function") {
		ele.attachEvent("on"+eventType,callback);
	} else {
		ele["on"+eventType]=callback;
	}
}

/** Object: trafficLight对象
  * method: 1. 灯光闪烁  .lightBlink()
  *         2. 初始化 关闭所有灯  .closeAllLight() 
  *         3. 点亮指定灯光  .openLight() 
  *         4. 倒计时  .countDown()
  */
var trafficLight={
    "lightBlink":function (light,color) {
        var ele=light;
        var lightColor=color;
        var flag=false;
    
        clearInterval(ele.timer);
        ele.timer=setInterval(function () {
            if (!flag) {
                ele.className=(ele.className).replace(lightColor,"black");
            } else {
                ele.className=(ele.className).replace("black",lightColor);
            }
            flag=!flag;
        },500);
        return ele.timer;
    },
    "closeAllLight":function (eq) {
        var lightBox=getDom(".lightBox")[eq];
        var lights=eq==="all"?getDom(".light"):lightBox.querySelectorAll(".light");
        // 初始化
        for (var i=0,len=lights.length;i<len;i++) {
            lights[i].className=(lights[i].className).replace(/(red|green|yellow)/g,"black");
        }
    },
    "openLight":function (light,color) {
        var ele=light;
        var lightColor=color;
        // 打开指定灯光
        ele.className=(ele.className).replace("black",lightColor);
    },
    "countDown":function (time,delay,data,timeTable) {
        var timer=data.timer;
        var curTime=time;
        var redLight=data.red;
        var yellowLight=data.yellow;
        var greenLight=data.green;
        var flag=data.flag;
        var eq=data.eq; // 红绿灯组序号
        var logo=1;
        // 初始化
        clearInterval(timer);
        timer=setInterval(function () {
            timeTable.innerHTML=curTime<10?"0"+curTime:curTime;
            if (curTime===0) {
        	    // 停止黄灯闪烁
      		    clearInterval(trafficLight.lightBlink(yellowLight,"yellow"));
      		    // 关闭所有灯，开启绿灯
      		    trafficLight.closeAllLight(eq);
      		    if (flag==="green") {
          		    redLight.className=(redLight.className).replace("black","red");
          		    flag="red";
      		    } else {
          		    greenLight.className=(greenLight.className).replace("black","green");
          		    flag="green";
      		    }
      		    if (logo===1) {
      	 		       curTime=+delay;
      	 		       logo=0;
      	 		   } else if(logo===0) {
      	 		       curTime=+time+1;
      	 		       logo=1;
      	 		   }
      	 	}
      	 	if (curTime===4) {
      	 	    trafficLight.lightBlink(yellowLight,"yellow");
      	 	}
      	 	curTime--;
      	},1000);
      	return timer;
    }
};


function init() {
    var lightBoxs=getDom(".lightBox");
    var redLights=getDom(".red");
    var greenLights=getDom(".green");
    var yellowLights=getDom(".yellow");
    var timeTabs=getDom(".timeTab");
    var data=[];
    var switchBtn=getDom("#switchBtn")[0];
    var yellowBtn=getDom("#yellowBtn")[0];
    var boo1=true,boo2=false;
    var t1=[]; // redgreen timer
    var t2=[]; // yellow timer
	var greenTime=+5; // green lasttimes 10+11+12+1
    var redTime=+greenTime*3+4; // red lasttime 10+10+10+1+2+1
    // 存放灯光信息
    for (var i=0,len=lightBoxs.length;i<len;i++) {
        data[i]={
            "red":redLights[i],
            "yellow":yellowLights[i],
            "green":greenLights[i],
            "flag":"red",
            "timer":0,
            "eq":i
            };
    }
    
    // 初始化灯光
    trafficLight.closeAllLight("all");
    // 主控开关 
    bindEvent(switchBtn,"click",function () {
    	// 关闭所有灯光 
    	trafficLight.closeAllLight("all");
    	// 改变开关文字
		yellowBtn.innerHTML="ON(warning)";
    	// 红绿灯一组
		for (var i=0;i<8;i++) {
			// 停止所有闪烁的灯光
			t2[i]=trafficLight.lightBlink(data[i].yellow,"yellow");
			clearInterval(t2[i]);
			// 默认全开红灯
			trafficLight.openLight(redLights[i],"red");
			if (boo1) {
                // 判断是一组还是二组
                if (i>=4 && i<=7) {
                 	(function (n) {
                		t1[n]=setTimeout(function () {
                 			data[n].timer=trafficLight.countDown(redTime,greenTime,data[n],timeTabs[n]);
                 		},((greenTime+1)*1000*(n-4))); 
                 	})(i);
                } else {
                 	(function (n) {
                		t1[n]=setTimeout(function () {
                 			data[n].timer=trafficLight.countDown(redTime,greenTime,data[n],timeTabs[n]);
                 		},((greenTime+1)*1000*n)); 
                 	})(i);
                }
                // 改变开关文字
                switchBtn.innerHTML="OFF(switch)";
    		} else {
    			clearTimeout(t1[i]);
    			clearInterval(data[i].timer);
    			// 改变开关文字
                switchBtn.innerHTML="ON(switch)";
    		}
		}
    	boo1=!boo1;
    });
    
    // 警告灯
    bindEvent(yellowBtn,"click",function () {
    	// 关闭所有灯光 
    	trafficLight.closeAllLight("all");
    	// 改变开关文字
		switchBtn.innerHTML="ON(switch)";
    	// 红绿灯一组、二组
		for (var i=0;i<8;i++) {
			// 初始化红绿灯
			clearTimeout(t1[i]);
    		clearInterval(data[i].timer);
            timeTabs[i].innerHTML="00"; // 清除计时
			if (!boo2) {
				t2[i]=trafficLight.lightBlink(data[i].yellow,"yellow");
				// 改变开关文字
				yellowBtn.innerHTML="OFF(warning)";
			} else {
				clearInterval(t2[i]);
				// 改变开关文字
				yellowBtn.innerHTML="ON(warning)";
			}
		}
		
    	boo2=!boo2;	
    });
}

bindEvent(window,"load",init);