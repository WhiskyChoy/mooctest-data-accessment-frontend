import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import api from '@/requests/api'
import draggable from '@/directives/draggable'
import {scrollableNew} from '@/directives/scrollable'

Vue.use(Element);
Vue.use(api);
Vue.use(draggable);
Vue.use(scrollableNew);