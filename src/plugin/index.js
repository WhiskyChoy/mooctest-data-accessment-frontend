import Vue from 'vue'
import Element from 'element-ui'
import api from '@/requests/api'
import draggable from '@/directives/draggable'
import {scrollableNew} from '@/directives/scrollable'
import safeFetch from '@/plugin/safeFetch'


if (process.env.NODE_ENV !== 'production') {
    import('element-ui/lib/theme-chalk/index.css');

}

Vue.use(Element);
Vue.use(api);
Vue.use(draggable);
Vue.use(scrollableNew);
Vue.use(safeFetch);