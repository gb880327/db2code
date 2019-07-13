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
    getDataForStr,
    saveToFile,
    readForFile,
    listFileForFolder,
    genId
} from '@/libs/util';
const path = require("path");


Vue.config.productionTip = false
Vue.use(iView);

Vue.prototype.$TEMPLATE = "template";
Vue.prototype.$DATASOURCE = "datasorce";
Vue.prototype.$PROJECT = "project";

Vue.prototype.$genId = genId;
Vue.prototype.$path = path;
Vue.prototype.$success = success;
Vue.prototype.$error = error;
Vue.prototype.$warning = warning;
Vue.prototype.$info = info;
Vue.prototype.$confirm = confirm;
Vue.prototype.$saveData = saveData;
Vue.prototype.$getDataForObj = getDataForObject;
Vue.prototype.$getDataForStr = getDataForStr;
Vue.prototype.$saveToFile = saveToFile;
Vue.prototype.$readForFile = readForFile;
Vue.prototype.$listFileForFolder = listFileForFolder;


const vue = new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
export default vue;