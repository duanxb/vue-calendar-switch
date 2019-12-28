<template>
    <transition name="calendarfade">
        <div class="calendarSwitchWrap" v-show="showCalendarFlag"  @click.self="close">
        <transition name="calendarshowinBottom">
            <div class="calendarSwitchContent" v-show="showCalendarFlag">
                <div class="header">选择日期 <span class="close" @click="close">关闭</span></div>
                <table class="dateTable"><tr><td v-for="we in week" :key="we">{{we}}</td></tr></table>
                <div class="content">
                    <div v-for="(dates, month) in renderData" :key="month">
                        <div class="ymonth">{{dates.title}}</div>
                        <ul class="days">
                        <li v-for="(day, index) in dates.days" :key="index" @click="selectDay(day, $event)" :class="{week: day.week, disabled: day.disabled, sectioned: day.sectioned, selected: day.selected}">
                            <span :data-str="_formatDateStr(dates.year,dates.month,day.value)">{{day.value}}</span>
                            <template v-if="day.selected_str"><em>{{day.selected_str}}</em></template>
                            <template v-if="day.tooltip"><div class="tooltip" :class="{show: tooltipshow}" v-text="day.tooltip"></div></template>
                        </li>
                        </ul>
                    </div>
                </div>
        </div>
        </transition>
        </div>
    </transition>
</template>

<script>
export default {
    data() {
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
}
</script>

<style lang="scss">
.calendarSwitchWrap{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9;
}
.calendarSwitchContent{
    background-color: #fff;
    width: 100%;
    & .header{
        height: 50px;
        line-height: 50px;
        background-color: #f7f7f9;
        text-align: center;
        color: #333;
        font-size: 16px;
        position: relative;

        & .close{
            font-size: 14px;
            position: absolute;
            right: 10px;
        }
    }

    & .dateTable{
        width: 100%;
        border: none;
        border-collapse: collapse;

        & td{
            border: none;
            width: 14.285%;
            height: 45px;
            line-height: 45px;
            text-align: center;
            color: #333;
        }
    }

    & .content{
        overflow: hidden;
        height: 330px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: relative;

        & .ymonth{
            height: 27px;
            line-height: 27px;
            padding-left: 15px;
            font-size: 14px;
            color: #666;
            background-color: #f9f9f9;
        }

        & .days{
            display: flex;
            flex-wrap: wrap;

            & li{
                display: block;
                height: 50px;
                width: 14.285%;
                line-height: 50px;
                text-align: center;
                color: #333;
                margin-bottom: 0.50px;
                transition: all 0.3s linear;

                & .tooltip{
                    background: rgba(0,0,0,0.6);
                    bottom: 93%;
                    border-radius: 4px;
                    color: #fff;
                    display: block;
                    left: -50%;
                    margin-bottom: 15px;
                    opacity: 0;
                    padding: 10px;
                    font-size: 12px;
                    pointer-events: none;
                    position: absolute;
                    width: 200%;
                    transform: translateY(10px);
                    transition: all .25s ease-out;
                    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);

                    &:before {
                        bottom: -20px;
                        content: " ";
                        display: block;
                        height: 20px;
                        left: 0;
                        position: absolute;
                        width: 100%;
                    }
                    &:after {
                        border-left: solid transparent .50px;
                        border-right: solid transparent .50px;
                        border-top: solid rgba(0,0,0,0.5) .50px;
                        bottom: -.50px;
                        content: "";
                        height: 0;
                        left: 50%;
                        position: absolute;
                        width: 0;
                        transform: translateX(-50%);
                    }
                }

                & .show {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateY(0px);
                }
                & span{
                    display: block;
                }
                &.week{
                    color: #666;
                }
                &.disabled{
                    color: #ccc;
                }
                &.sectioned{
                    color: #000;
                    background-color: #e5fafa;
                }
                &.selected{
                    color: #000;
                    background-color: #00cbcb;
                    line-height: 1;
                    padding-top: 10px;
                    box-sizing: border-box;
                    position: relative;

                    & span{
                        display: inline;
                    }
                    & em{
                        font-size: 12px;
                        font-style: normal;
                        display: block;
                        text-align: center;
                        margin-top: 0.50px;
                    }
                }
            }
        }
    }
}

/* show effect */
.calendarshowinBottom-enter-active, .calendarshowinBottom-leave-active{
	opacity: 1;
	-webkit-transform: translateY(0);
  	transform: translateY(0);
  	-webkit-transition: transform 0.5s ease;
  	-webkit-transition: -webkit-transform 0.5s ease;
  	transition: -webkit-transform 0.5s ease;
  	transition: transform 0.5s ease;
  	transition: transform 0.5s ease, -webkit-transform 0.5s ease;
}
.calendarshowinBottom-enter, .calendarshowinBottom-leave-active{
  	opacity: 0;
  	-webkit-transform: translateY(100%);
  	transform: translateY(100%);
}
.calendarfade-enter-active, .calendarfade-leave-active{
	opacity: 1;
  	transition: opacity 0.3s ease;
  	transition: opacity 0.3s ease, -webkit-transform 0.3s ease;
}
.calendarfade-enter, .calendarfade-leave-active{
  	opacity: 0;
}
</style>