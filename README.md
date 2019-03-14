# vue-lCalendar-switch

移动端区间日期选择器


## 描述
次组件可以选择起始日期，第一次点击为开始时间，第二次点击为结束时间。可以跨月份选择，跨年分选择。
支持个性化配置如：
	最大选择区间、
	是否开启动画效果、
	限制区间选择范围天数、
	是否开启周六日禁止点击、
	禁用的日期

 ## 演示

![vue-lCalendar-switch]()

#### Code DEMO
```html
<input type="text" placeholder="请选择日期区间" ref="calendar" unselectable="on" onfocus="this.blur()" readonly="readonly" class="inputstyle" v-model="appoint_datetime">
```
```javascript
//this -> vue
this.$calendarSwitch({
	element: this.$refs.calendar,
	monthSize: monthSizeArr.length || 4,
	minDate: minDate,
	maxDate: maxDate,
	onSuccess: function(res) {
		$vm.fileds.appoint_start = res.start_date;
		$vm.fileds.appoint_end = res.end_date;
	},
	onError: function(msg) {
		$vm._validFormTip(msg);
	}
});
```

## 参数
| 参数        	| 说明           |
| ------------- |-------------|
| element		|[Object], 文本框对象		|
| monthSize          | [Number]，展示的月份个数，默认4个 |
| showEffect       | [String]：开启动画效果，默认'slideInBottom' | 
| limitSection       | [Number] 限制区间选择范围天数 0：不限制，大于0是限制多少天    | 
| weekDisabled  | [Boolean] 是否开启周六日禁止点击, 默认false 关闭 | 
| startDate  | [String] 开始时间 | 
| endDate  | [String] 结束时间 | 
| minDate  | [String] 选择范围：最小时间 | 
| maxDate  | [String] 选择范围：最大时间（最大范围时间要出现在monthSize月份之中） | 
| disabledDate  | [Array] 手动设置禁用的日期 | 


## 回调

| 参数            | 说明          |
| -------------   |-------------|
| onSuccess   | [Function] 成功回调 |
| onError | [Function] 错误回调 |
