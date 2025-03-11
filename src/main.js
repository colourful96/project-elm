import '@/utils/rem.js'
import '@/style/common.scss'

import { createApp } from 'vue'
import {createPinia} from "pinia"
import App from './App.vue'
import router from './router/router.js'
import { vLoadMore } from '@/directive/loadMore.js'

// 可以使用.directive()注册全局指令
createApp(App).directive('loadMore', vLoadMore).use(createPinia()).use(router).mount('#app')
