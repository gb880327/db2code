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
import config from '@/libs/config';
import project from '@/views/project/index';
import setting from '@/views/setting/index';
import template from '@/views/template/index';
import dataSource from '@/views/datasource/index';

Vue.component('dataSource', dataSource);
Vue.component('project', project);
Vue.component('setting', setting);
Vue.component('templateManage', template);

Vue.config.productionTip = false
Vue.use(iView);

Vue.prototype.$TEMPLATE = config.storePath.template;
Vue.prototype.$DATASOURCE = config.storePath.datasource;
Vue.prototype.$PROJECT = config.storePath.project;

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
    // router,
    render: h => h(App)
}).$mount('#app');
export default vue;