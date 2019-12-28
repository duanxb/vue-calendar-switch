import Vue from 'vue'
import calendarSwitch from './calendarSwitch.vue'


const calendarSwitchConstructor = Vue.extend(calendarSwitch);

const instance = new calendarSwitchConstructor({
    el: document.createElement('div')
});

const CalendarSwitch = function(options){

    instance.element = options.element || '';
    instance.monthSize = options.monthSize || 4;                    //展示的月份个数
    instance.showEffect = options.showEffect || 'slideInBottom';    //是否开启动画效果
    instance.limitSection = options.limitSection || 0;              //限制区间选择范围天数 0：不限制，大于0是限制多少天
    instance.weekDisabled = options.weekDisabled || false;          //是否开启周六日禁止点击
    instance.onSuccess = options.onSuccess || function() {};        //成功回调
    instance.onError = options.onError || function() {};            //错误回调
    instance.startDate = options.startDate || '';                   //开始时间
    instance.endDate = options.endDate || '';                       //结束时间
    instance.minDate = options.minDate;                             //选择范围：最小时间
    instance.maxDate = options.maxDate;                             //选择范围：最大时间（最大范围时间要出现在monthSize中）
    instance.disabledDate = options.disabledDate || [];             //手动设置禁用的日期

    document.body.appendChild(instance.$el);
    
    //初始化时间格式
    instance.initDatePicker();
    
    //给对象绑定CLICK事件
    instance.element.addEventListener("click", function() {
        instance.showCalendarFlag = true;
        document.body.className = 'overflow';
    }, false)

};

export default CalendarSwitch;