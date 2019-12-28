import Vue from 'vue'
import App from './App.vue'
import calendarSwitch from './plugin/calendarSwitch'

Vue.config.productionTip = false

Vue.prototype.$calendarSwitch = calendarSwitch;

new Vue({
  render: h => h(App),
}).$mount('#app')
