// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入 ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vGanttChart from 'v-gantt-chart';
Vue.use(vGanttChart);
import axios from 'axios'
import VueAxios from 'vue-axios'

import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype._GLOBAL = {
    userID: 1,
    projectID: 1,
    imgBaseUrl: 'http://localhost:8080/imgs/',
    baseUrl: '/api', // 'http://39.97.175.119:8801'
    userObj: {
        ID: 0,
        name: '',
        avatar: './assets/logo.png',
        mail: '',
    },
    ProjectList: [],
    projectIndex: 0
}

Vue.prototype.$eventBus = new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})