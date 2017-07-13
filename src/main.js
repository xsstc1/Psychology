import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css';
import App from './App.vue'
import router from "./router/router";//引入路由

import * as psyFun from './assets/js/psy.js'; //引入自定义函数
import store from './vuex/store';//引入vuex

require('./assets/css/normalize.css');//引入normalize
require('./assets/css/base.css');//引入基础css

Vue.use(ElementUI);


//遍历方法，从而在过滤器中调用
Object.keys(psyFun).forEach(k => Vue.filter(k, psyFun[k]));
//将自定义方法赋给 prototype,实现全局调用
Vue.prototype.publicFun = psyFun;


// 创建一个路由器实例
// 并且配置路由规则


const app = new Vue({
    store,
    router: router,
    render: h => h(App)
}).$mount('#app')
