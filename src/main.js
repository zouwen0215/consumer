// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import store from './store';
import router from './router'
import  VueResource  from 'vue-resource'
import Element from 'element-ui';
import ElementUI from 'element-ui';
import echarts from 'echarts';
import routerBefore from './utils/beforeEach.js';
import * as filters from './filters/filters';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/public.css';
import '@/assets/css/rule.css';
import '@/assets/font/iconfont.css';
import '@/assets/css/replenishCss.css';
import '@/assets/css/stream.css';

import imgBox from './components/imgBox/index';
Vue.use(imgBox);

Vue.use(VueResource) 
Vue.use(Element, { size: 'small', zIndex: 3000 });
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;

Object.keys(filters).forEach(key => {  
    Vue.filter(key, filters[key])  
}) 
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
