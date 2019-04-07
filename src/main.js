import Vue from 'vue'
import App from './App.vue'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import router from './router'
import {
    success,
    error,
    warning,
    info,
    confirm,
    saveData,
    getDataForObject,
    getDataForStr
} from '@/libs/util';


Vue.config.productionTip = false
Vue.use(iView);

Vue.prototype.$success = success;
Vue.prototype.$error = error;
Vue.prototype.$warning = warning;
Vue.prototype.$info = info;
Vue.prototype.$confirm = confirm;
Vue.prototype.$saveData = saveData;
Vue.prototype.$getDataForObj = getDataForObject;
Vue.prototype.$getDataForStr = getDataForStr;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')