import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载vant核心组件库
import Vant from 'vant'

// 加载vant全局样式
import 'vant/lib/index.css'

// 导入全局样式表
import './styles/index.less'

// 动态设置 REM 基准值
import 'amfe-flexible'

Vue.config.productionTip = false

Vue.use(Vant)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
