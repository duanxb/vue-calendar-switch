/*
 * @Author: DuanXiBao
 * @Date: 2018-07-02 16:43:39
 * @LastEditors: DuanXiBao
 * @LastEditTime: 2019-03-14 14:23:07
 * @Description: LCalendarSwitch 日期选择控件-基于Vue开发
 * @Company: doctorgroup.com.cn
 */

!function () {

    if(!Vue) return;

    var calendarSwitch = Vue.component('calendar-switch', {
        template: '<transition name="calendarfade">\
                    <div class="calendarSwitchWrap" v-show="showCalendarFlag"  @click.self="close">\
                    <transition name="calendarshowinBottom">\
                        <div class="calendarSwitchContent" v-show="showCalendarFlag">\
                            <div class="header">选择日期 <span class="close" @click="close">关闭</span></div>\
                            <table class="dateTable"><tr><td v-for="we in week">{{we}}</td></tr></table>\
                            <div class="content">\
                                <div v-for="dates in renderData">\
                                <div class="ymonth">{{dates.title}}</div>\
                                <ul class="days">\
                                <li v-for="day in dates.days" @click="selectDay(day, $event)" :class="{week: day.week, disabled: day.disabled, sectioned: day.sectioned, selected: day.selected}">\
                                    <span :data-str="_formatDateStr(dates.year,dates.month,day.value)">{{day.value}}</span>\
                                    <template v-if="day.selected_str"><em>{{day.selected_str}}</em></template>\
                                    <template v-if="day.tooltip"><div class="tooltip" :class="{show: tooltipshow}" v-text="day.tooltip"></div></template>\
                                </li>\
                                </ul>\
                                </div>\
                            </div>\
                    </div></transition>\
                    </div></transition>',
        data: function() {
            return {
                week: ["日", "一", "二", "三", "四", "五", "六"],
                showCalendarFlag: false,
                showStartDate: '',
                showEndDate: '',
                monthSize: 4,
                minDate: '',
                maxDate: '',
                tooltipshow: false
            }
        },
        computed: {
            renderData: function() {
                var currentDate = new Date(), 
                    currentYear = currentDate.getFullYear(), 
                    currentMonth = currentDate.getMonth() + 1;

                //用于临时存储日期数组
                var tempArr = [];

                for(var j=1; j <= this.monthSize; j++) {

                    var months = (new Date(currentYear, currentMonth, 0)).getDate();
                    var result = [];
                    var weekValue;
                    var yearMonth = {
                        year: currentYear,
                        month: currentMonth
                    }
                    // 按照星期分组
                    for (var i = 1; i <= months; i += 1) {

                        // 根据日期获取星期，并让开头是1，而非0
                        weekValue = (new Date(currentYear, currentMonth - 1, i)).getDay() + 1;

                        // 判断月第一天在星期几，并填充前面的空白区域
                        if (i === 1 && weekValue !== 1) {
                            this.addRowEmptyValue(result, weekValue);
                            this.addRowDayValue(result, yearMonth, i, weekValue);
                        } else {
                            this.addRowDayValue(result, yearMonth, i, weekValue);

                            // 判断月最后一天在星期几，并填充后面的空白区域
                            if (i === months && weekValue !== 7) {
                                this.addRowEmptyValue(result, (7 - weekValue) + 1);
                            }
                        }
                    }

                    var monthFormat = this._formatNumber(currentMonth);

                    tempArr.push({
                        title: currentYear +'年'+ monthFormat + '月',
                        year: currentYear,
                        month: currentMonth,
                        days: result
                    })

                    if(currentMonth < 12) {
                        currentMonth++;
                    }else {
                        currentYear++;
                        currentMonth = 1;
                    }
                    
                }

                return tempArr;
                
            },
        },
        methods: {
            /**
             * 初始化参数
             */
            initDatePicker: function() {
                this.showStartDate = this.startDate;
                this.showEndDate = this.endDate;
            },
            /**
             * 填充前面的空白区域
             */
            addRowEmptyValue: function(row, count) {
                for (var w = 1; w < count; w += 1) {
                    row.push({
                        value: '',
                    });
                }
            },
            /**
             * 集中处理日期
             * @pamas row: 当月日期数组
             * @pamas yearMonth: 当日年月对象，用于数据对比
             * @pamas i: 日期
             * @pamas weekValue: 星期
             */
            addRowDayValue: function(row, yearMonth, i, weekValue) {
                var value = { value: i };
                
                var startDate = this._getDateObject(this.showStartDate),
                    endDate = this._getDateObject(this.showEndDate),
                    startDate_format = this.showStartDate,
                    endDate_format = this.showEndDate,
                    current_this_date = this._formatDateStr(yearMonth.year, yearMonth.month, i);
                    

                //判断已经选择的区间
                if(startDate) {
                    
                    if (startDate.year == yearMonth.year && startDate.month == yearMonth.month && startDate.day == i) {
                        value.selected = true;
                        value.selected_str = '开始';
                        value.tooltip = '请选择结束时间';
                    }
                    if(endDate.year == yearMonth.year && endDate.month == yearMonth.month && endDate.day == i) {
                        value.selected = true;
                        value.selected_str = '结束';
                    }
                    
                    if(endDate && this._compareDate(current_this_date, startDate_format)===false && this._compareDate(current_this_date, endDate_format)===true) {
                        value.sectioned = true;
                    }
                }
                

                // 当日期在最小值之外，禁止点击
                if( this._compareDate(current_this_date, this.minDate) === true) {
                    value.disabled = true;
                }
                // 当日期在最大值之外，禁止点击
                if( this._compareDate(current_this_date, this.maxDate) === false) {
                    if(this.maxDate !== current_this_date){
                        value.disabled = true;
                    }
                } 

                // 周六日处理
                weekValue = weekValue - 1; 
                if (weekValue % 7 === 0 || weekValue % 6 === 0) {
                    value.week = true;
                    if(this.weekDisabled){
                        value.disabled = true;
                    }
                }

                //当设置了禁用日期
                if ( this.disabledDate && this.disabledDate.length > 0) {
                    if( this.disabledDate.indexOf(current_this_date) > -1) {
                        value.disabled = true;
                    }
                }

                row.push(value);
            },
            /**
             * 获取日期字符串转为对象
             * @return Object {year, month, day}
             */
            _getDateObject: function(dateString){ 
                if(!dateString) {
                    return '';
                }
		        var ArrDate = dateString.split("-");
		        return {
                    year: Number(ArrDate[0]),
                    month: Number(ArrDate[1]),
                    day: Number(ArrDate[2])
                };
            },
            /**
             * 两个日期相差几天
             * @return iDays Number 
             */
            _dateDiff: function (sDate1,  sDate2){  
                var aDate, oDate1, oDate2, iDays; 
                aDate  =  this._getTimeByTimeStr(sDate1);
                oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
                aDate  =  this._getTimeByTimeStr(sDate2);
                oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);  
                iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24); 
 
                return  iDays  
            },
            /**
             * 日期格式化，小于10的前面补0
             */
            _formatNumber: function(num) {
                return num < 10 ? '0' + num : num;
            },
            /**
             * 日期对象再转为字符串类型
             * @return 格式 yyyy-MM-dd
             */
            _formatDateStr: function(y, m, d) {
                return y + '-' + this._formatNumber(m) + '-' + this._formatNumber(d);
            },
            /**
             * 两个日期比较大小
             * @return true/false
             */
            _compareDate: function (sDate1, sDate2){
		        var d1 = new Date(sDate1.replace(/\-/g, "\/"));  
		        var d2 = new Date(sDate2.replace(/\-/g, "\/"));  

		        if(d1 >= d2){  
		            return false;  
		        }else{
		            return true;
		        }
            },
            /**
             * 点击选择日期
             * @param day: 当前日期对象
             * @param event: 节点Dom对象
             */
            selectDay: function(day, event) {
                if (day.disabled || day.selected || !day.value) {
                    return;
                }
                var currentDateStr = event.target.getAttribute('data-str');

                if(this.showStartDate && this.limitSection > 0) {
                    var diffDays = this._dateDiff(this.showStartDate, currentDateStr);
                    if(diffDays > this.limitSection) {
                        this.onError('选择区间做多为'+this.limitSection+'天');
                    }
                }
                this.resetSelectDate(currentDateStr);
                
            },
            /**
             * 根据条件重新赋值
             */
            resetSelectDate: function(currentDateStr) {
                if(this.showStartDate) {
                    if(this.showEndDate){
                        this.tooltipshow = true;
                        this.showStartDate = currentDateStr;
                        this.showEndDate = '';
                    }else{
                        if(this._compareDate(currentDateStr,this.showStartDate)){
                            this.tooltipshow = true;
                            this.showStartDate = currentDateStr;
                        }else{
                            this.showEndDate = currentDateStr;
                            this.tooltipshow = false;

                            var resDate = {
                                start_date: this.showStartDate,
                                end_date: this.showEndDate
                            }
                            this.onSuccess(resDate);
                            var $this = this;
                            setTimeout(function() {
                                $this.close();
                            }, 500)
                        }
                    }
                }else{
                    this.showStartDate = currentDateStr;
                    this.tooltipshow = true;
                }
            },
            close: function() {
                this.showCalendarFlag = false;
                document.body.className = '';
            }
        }

    })

    var calendarSwitchConstructor = Vue.extend(calendarSwitch);

    var instance = new calendarSwitchConstructor({
        el: document.createElement('div')
    });
    
    // var hashChange = function () {
    //     var el = instance.$el;
    //     el.parentNode && el.parentNode.removeChild(el);
    // };

    var CalendarSwitch = function(options){

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

        //window.addEventListener("hashchange", hashChange);

        document.body.appendChild(instance.$el);
        
        //初始化时间格式
        instance.initDatePicker();
        
        //给对象绑定CLICK事件
        instance.element.addEventListener("click", function() {
            instance.showCalendarFlag = true;
            document.body.className = 'overflow';
        }, false)

    };

    Vue.prototype.$calendarSwitch = CalendarSwitch;
    
}();