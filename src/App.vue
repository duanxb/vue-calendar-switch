<template>
  <div id="app">
    <h3>calendarSwitch组件：</h3><br/>
    <input type="text" class="datespace" v-model="dateSpace" ref="calendarTigger" placeholder="请选择时间区间">
    </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      dateSpace: '',
    }
  },
  mounted() {
    this.initCalendar()
  },
  methods: {
    initCalendar() {
      this.$calendarSwitch({
          element: this.$refs.calendarTigger,
          monthSize: 2,
          minDate: '2019-12-01',
          maxDate: '2020-05-03',
          onSuccess: (data) => {
             this.dateSpace = data.start_date +'~'+ data.end_date;
             console.log(this.dateSpace);
          },
          onError: function(msg) {
              console.log(msg)
          }
      });
    }
  }
}
</script>

<style lang="scss">
* {padding: 0; margin: 0;}
#app {
  font-family: 'PingFang SC', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding: 20px;
}
.datespace {
  width: 100%; height: 40px; border: #ddd 1px solid; padding-left: 10px;
}
</style>
