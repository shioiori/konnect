import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

import CKEditor from '@ckeditor/ckeditor5-vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import LoadScript from 'vue-plugin-load-script'
import hub from './hubs/chathub.js'
import VueTribute from 'vue-tribute'

const emitter = mitt()
const app = createApp(App)
app.config.globalProperties.emitter = emitter
app.use(router)
app.use(CKEditor)
app.use(ElementPlus)
app.use(LoadScript)
app.use(hub)
app.use(VueTribute)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
