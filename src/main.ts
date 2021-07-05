// import "core-js/stable"
// import "regenerator-runtime/runtime"
import Vue from 'vue'
import App from './App.vue'
import elementui from './elementui/index'
import SvgIcon from 'vue-svgicon'

// import '@/styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import '@/styles/index-hs.scss'
import '@/icons/components'

import Hs from '@/packages/index'

Vue.use(elementui)

Hs.install(Vue)

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})
Vue.config.productionTip = false

new Vue({
  render: (h) => h(App)
}).$mount('#app')
