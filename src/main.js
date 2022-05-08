import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'normalize.css'
import '@/assets/css/global.css'
import './plugins/element.js'
// 导入字体图标样式
import '@/assets/font/iconfont.css'
// 导入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
Vue.prototype.$http = axios // 挂在axios到Vue的原型上

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
