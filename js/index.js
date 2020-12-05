// 接收参数根据页面元素渲染出一个日历

// 创建一个公共元素存放点,存储所有元素
let ElementAll = [];
// 公共 年 月 日
const date = new Date();
let Year = date.getFullYear();
let Month = date.getMonth() + 1;
let Day = date.getDate();
let Week = date.getDay();
// 记录当前单击的element
let ElementOn;

//先根据单击者的class获取到元素信息
for (const Element of document.getElementsByClassName("dateui")) {
    Element.onclick = function(Element) {
        // Element.stopPropagation();
        //初始化获取input中的日期
        Year = Element.toElement.value.substring(0, 4);
        Month = isNaN(Element.toElement.value.substring(5, 7)) ? Element.toElement.value.substring(5, 6) : Element.toElement.value.substring(5, 7);
        Day = isNaN(Element.toElement.value.substring(8, 10)) ? Element.toElement.value.substring(8, 10) : Element.toElement.value.substring(8, 11);
        console.log(Year, Month, Day);
        console.log(Element.toElement.value);
        // 在被单击元素上方或下方浮动一个div默认为下方,如果空间不够移动至上方
        createdDateBox(Element);
        // 渲染日历头部
        createdDateTop(Element);
        // 渲染日历中间日期已经放入头部处理

        // 渲染日历底部    目前不渲染 放入hr占位

        // 存储当前渲染的Element
        ElementOn = Element.toElement;
    }

    // 初始化显示当前日期
    currentDate(Element);
}

function createdDateTop() {
    let dateUI = document.getElementById("dateUI");
    // 创建头部div并绑定class
    dateTopBox = document.createElement("div");
    // 创建4个按钮 两个一组,中间插入当前年份 和 月份
    dateTopBox.innerHTML = `    
    <input type="button" value="<<">
    <input type="button" value="<">
    <span></span>
    <input type="button" value=">">
    <input type="button" value=">>">`;
    dateTopBox.setAttribute("class", "dateTop")
        // 为4个按钮绑定点击事件 ,获取4个input,首尾绑定切换年份,第二个绑定切换月份
    addTabYearOrMonth(dateTopBox, );
    // 创建显示创建日历
    refreshDateTopBoxAndDateBodyBox(dateTopBox);
    // 向头部添加内容
    dateUI.prepend(dateTopBox)
}


// 创建日历
function createdDateBodyBox() {
    // 先创建周日到周六的条
    createdWeekBox();
    /**
     * 首先
     *     获取当前月份第一天是周几
     *      获取前一月最后一天是多少号
     *  然后判断当前月份第一周前方渲染几个
     * 每个日期被点击是会蓝色,当前日期淡蓝,但淡蓝色优先级没有蓝色高
     * 一共渲染35个方格 5行 7列
     * 
     */
    // 获取月份第一天周几
    let firstDayOnWeek = getFirstDayOnWeek();
    // 获取上个月最后一天是几号   大小月 平闰年
    let lastMonthDays = getLastMonthDays();
    // 调用循环渲染函数 //如果点击前半部分灰色和后半部分灰色待处理
    // 创建一个容器存储日期,追加到星期后
    addDaysBox();
    // firstDayOnWeek为上个月(灰色)渲染个数 
    for (let i = lastMonthDays - firstDayOnWeek + 1; i <= lastMonthDays; i++) {
        loopAddElementDays("#c2c2a3", i, -1)
    }
    //渲染当前月份
    for (let i = 1; i <= (new Date(Year, Month, 0).getDate()); i++) {
        // 判断是否是今天,如果是传入淡蓝色,否则背景为白色
        if (i == (new Date().getDate()) && Month == (new Date().getMonth() + 1) && Year == (new Date().getFullYear())) {
            loopAddElementDays("#80bfff", i, 0)
        } else {
            loopAddElementDays("#fff", i, 0)
        }

    }
    // 渲染下月日期
    for (let i = 1; i <= 7 - ((new Date(Year, Month, 0).getDate()) + firstDayOnWeek) % 7; i++) {
        loopAddElementDays("#c2c2a3", i, 1)
    }



}

//循环渲染函数 接收参数: 渲染颜色,绑定函数等级 例如:上月绑定反馈函数 -1 当月 0 下月 1
//传入的Element用来向input反馈数据
function loopAddElementDays(color, number, grade) {
    // 默认向Day子元素追加span
    // 获取daysBox
    let daysBox = document.getElementById("daysBox");
    // 创建span
    let dayBox = document.createElement("span");
    //设置span颜色
    // 如果number和Day相同修改为选中颜色 #007f80 条件为grade为0
    color = number == Day && grade == 0 ? "#1a8cff" : color;
    dayBox.style.backgroundColor = color;
    dayBox.innerText = number;
    // 追加到daysBox
    daysBox.appendChild(dayBox);
    // 绑定元素
    if (grade == -1) {
        // 点击完成直接反馈,月份减一取点击元素值
        dayBox.onclick = function() {
            // 反馈:直接填入input ,关闭div
            ElementOn.value = (Month == 1 ? Year - 1 : Year) + '-' + (Month == 1 ? 12 : Month - 1) + '-' + dayBox.innerText;
            removeDateBox();

        }
    } else if (grade == 0) {
        dayBox.onclick = function() {
            // 反馈:直接填入input ,关闭div
            ElementOn.value = Year + '-' + Month + '-' + dayBox.innerText;
            removeDateBox();

        }
    } else if (grade == 1) {
        //月份加一取元素值
        dayBox.onclick = function() {
            // 反馈:直接填入input ,关闭div
            ElementOn.value = (Month == 12 ? Year + 1 : Year) + '-' + (Month == 12 ? 1 : Month + 1) + '-' + dayBox.innerText;
            removeDateBox();
        }
    }

}


function addDaysBox() {
    // 获取dateBox 追加内容
    let daysBox = document.getElementById("daysBox");
    daysBox ? daysBox.parentNode.removeChild(daysBox) : 0;
    let dateBox = document.getElementById("dateUI");
    daysBox = document.createElement("div");
    daysBox.id = "daysBox";
    dateBox.appendChild(daysBox);
}



// 获取上个月一共多少天
function getLastMonthDays() {
    let year = Month == 1 ? Year - 1 : Year;
    let month = Month == 1 ? 12 : Month - 1;
    let d = new Date(year, month, 0);
    return d.getDate();
}

// 获取月份第一天是周几
function getFirstDayOnWeek() { 
    var  d  =  new  Date();    
    d.setYear(Year);    
    d.setMonth(Month - 1);    
    d.setDate(1);
    return d.getDay();
}






// 添加周显示
function createdWeekBox() {
    // 获取dateBox 追加内容
    let weekBox = document.getElementById("weekBox");
    weekBox ? weekBox.parentNode.removeChild(weekBox) : 0;
    let dateBox = document.getElementById("dateUI");
    weekBox = document.createElement("div");
    weekBox.id = "weekBox";
    weekBox.innerHTML = ` 
    <span>日</span>
    <span>一</span>
    <span>二</span>
    <span>三</span>
    <span>四</span>
    <span>五</span>
    <span>六</span>
    `;
    dateBox.appendChild(weekBox);
    // console.log(dateBox);
}






function addTabYearOrMonth(dateTopBox, Element) {
    // 获取4个input
    let inputAll = dateTopBox.children;
    // 触发任意函数都连带出日历的刷新即重新更新日
    // 年份减少
    inputAll[0].onclick = function() {
        Year--;
        refreshDateTopBoxAndDateBodyBox(Element)
    };
    // 月份减少
    inputAll[1].onclick = function() {
        Month--;
        if (Month == 0) {
            Year--;
            Month = 12;
        }
        refreshDateTopBoxAndDateBodyBox(Element)
    };
    // 月份增加
    inputAll[3].onclick = function() {
        Month++;
        if (Month == 13) {
            Year++;
            Month = 1;
        }
        refreshDateTopBoxAndDateBodyBox(Element)
    };
    // 年份增加
    inputAll[4].onclick = function() {
        Year++;
        refreshDateTopBoxAndDateBodyBox(Element)
    };

    // // 只要日历头部被单击   刷新头部显示和日历显示
    // dateTopBox.onclick = function() {
    //     refreshDateTopBoxAndDateBodyBox(Element)
    // }

}

// 修改头部,重新创建日历 首次调用和刷新都ok
function refreshDateTopBoxAndDateBodyBox(Element) {
    // 修改头部
    dateTopBox.children[2].innerText = Year + "年" + Month + "月";
    // 创建日历
    createdDateBodyBox();
}

// 在合适的位置创建view
function createdDateBox(Element) {
    //如果dateUI存在就先干掉
    document.getElementById("dateUI") != undefined ? removeDateBox() : 0;

    let DateBox = document.createElement("div");
    //将内容添加到body
    document.body.appendChild(DateBox);
    // 设置ID方便渲染
    DateBox.id = 'dateUI';
    // 当DateBox被创建时监听body鼠标事件,如果不在DateBox中关闭DateBox
    mask(DateBox);
    // 为创建的盒子绑定一个class,定位到指定位置
    // 传入被点击元素的鼠标事件
    locateBox(Element);
    // 接收DateBox渲染内容赋值给box
    // DateBox.innerHTML = renderTheCalendar();
}
//鼠标遮罩功能
function mask(DateBox) {
    // 为HTML添加点击事件
    setTimeout(function() {
        document.getElementsByTagName("html")[0].onclick = function() {
            // 判断是否在DateBox中
            // let DateBox = document.getElementById("dateUI");
            // console.log(DateBox);
            // console.log("aaa");
            // setTimeout(function() {
            //     removeDateBox();

            // }, 20000)
        }
    }, 500)

}

//暂时不用
// // 渲染DateBox内容
// function renderTheCalendar() {
//     //此函数只需要渲染日历内容无需引入值

// }

//创建一个钩子移除(关闭)日历控件
function removeDateBox() {
    document.getElementById("dateUI").parentNode.removeChild(document.getElementById("dateUI"));
    //移除html的click事件
    document.getElementsByTagName("html")[0].onclick = '';
}

// 日历控件定位函数
function locateBox(Element) {
    let dateUI = document.getElementById("dateUI");
    // 设置日历控件位置和input框左侧对齐
    dateUI.style.left = Element.toElement.offsetLeft + 'px';
    // 设置日历控件位置和input框顶端对齐
    dateUI.style.top = (Element.toElement.offsetHeight + 10) + "px";
    /**
     *  遗留问题
     *  1.底部位置不足,顶部位置不足.....
     */
}



// 只要挂载日历渲染初始化日历内容为今日
//  初始化渲染输入框都在此处理
function currentDate(Element) {
    Element.value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    //允许手动输入,但是每次单击触发默认返回当前日期或选择日期
}

//接收到每个date element抛到公共点,如果需要对比元素ID即可
//此函数为开发者配置函数
function dateUI(Element) {
    ElementAll.push(Element);
}