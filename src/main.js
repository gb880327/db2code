import Vue from "vue";
import App from "./App.vue";
import iView from "iview";
import "iview/dist/styles/iview.css";
import router from "./router";
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
} from "@/libs/util";
const path = require("path");
import config from "@/libs/config";
import project from "@/views/project/index";
import setting from "@/views/setting/index";
import template from "@/views/template/index";
import dataSource from "@/views/datasource/index";
import VTreeselect from 'vue-treeselect';

Vue.component('VTreeselect', VTreeselect);
Vue.component("dataSource", dataSource);
Vue.component("project", project);
Vue.component("setting", setting);
Vue.component("templateManage", template);

Vue.config.productionTip = false;
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

let loadData = (key) => {
    let data = getDataForObject(key);
    return !data || data == null ? [] : data;
};
const vue = new Vue({
    data() {
        return {
            projectList: loadData(config.storePath.project),
            templateList: loadData(config.storePath.template),
            dbList: loadData(config.storePath.datasource)
        };
    },
    computed: {
        getTemplateList() {
            let templateList = [];
            templateList.push({ id: "", text: "请选择" });
            this.templateList.forEach(item => {
                let parent = { id: item.id, text: item.name, disabled: true, opened: true, children: [] };
                item.template.forEach(it => {
                    parent.children.push({
                        id: it.fileName,
                        text: it.name,
                        icon: 'icon-template'
                    });
                });
                templateList.push(parent);
            });
            return templateList;
        }
    },
    methods: {

    },
    // router,
    render: h => h(App)
}).$mount("#app");
export default vue;