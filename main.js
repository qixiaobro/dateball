import App from './App'
import globalMixins from '@/utils/globalMixins.js'

// #ifndef VUE3
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
Vue.mixin(globalMixins)
Vue.use(uView)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
require('@/utils/request.js')(app)
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif