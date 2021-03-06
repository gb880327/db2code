import Vue from "vue";
import App from "./App.vue";
import iView from "iview";
import "iview/dist/styles/iview.css";
import {
    success,
    error,
    warning,
    info,
    confirm,
    customConfirm,
    saveData,
    getDataForObject,
    getDataForStr,
    saveToFile,
    readForFile,
    listFileForFolder,
    genId,
    exists,
    loadConfig
} from "@/libs/util";
import { dataTypeList } from "@/libs/dataTypeMapping";
const path = require("path");
import config from "@/libs/config";
import project from "@/views/project/index";
import setting from "@/views/setting/index";
import template from "@/views/template/index";
import dataSource from "@/views/datasource/index";
import VTreeselect from "vue-treeselect";

Vue.component("VTreeselect", VTreeselect);
Vue.component("dataSource", dataSource);
Vue.component("project", project);
Vue.component("setting", setting);
Vue.component("templateManage", template);

Vue.config.productionTip = false;
Vue.use(iView);

Vue.prototype.$genId = genId;
Vue.prototype.$path = path;

Vue.prototype.$success = (vue, msg, callback = () => {}) => {
    vue.$Notice.success({
        title: msg,
        duration: 3,
        onClose: callback
    });
};
Vue.prototype.$error = (vue, msg, callback = () => {}) => {
    vue.$Notice.error({
        title: msg,
        duration: 3,
        onClose: callback
    });
};
Vue.prototype.$warning = (vue, msg, callback = () => {}) => {
    vue.$Notice.warning({
        title: msg,
        duration: 3,
        onClose: callback
    });
};
Vue.prototype.$info = (vue, msg, callback = () => {}) => {
    vue.$Notice.info({
        title: msg,
        duration: 3,
        onClose: callback
    });
};

Vue.prototype.$confirm = confirm;
Vue.prototype.$customConfirm = customConfirm;
Vue.prototype.$saveData = saveData;
Vue.prototype.$getDataForObj = getDataForObject;
Vue.prototype.$getDataForStr = getDataForStr;
Vue.prototype.$saveToFile = saveToFile;
Vue.prototype.$readForFile = readForFile;
Vue.prototype.$listFileForFolder = listFileForFolder;

let loadData = key => {
    let data = getDataForObject(key);
    return !data || data == null ? [] : data;
};

const vue = new Vue({
    data() {
        return {
            projectList: [],
            templateList: [],
            dbList: [],
            dataBaseType: {},
            codeLangType: {}
        };
    },
    created() {
        this.loadConfig();
    },
    computed: {
        getTemplateList() {
            let templateList = [];
            templateList.push({ id: "", text: "请选择" });
            this.templateList.forEach(item => {
                let parent = {
                    id: item.id,
                    text: item.name,
                    disabled: true,
                    opened: true,
                    children: []
                };
                item.template.forEach(it => {
                    parent.children.push({
                        id: it.fileName,
                        text: it.name,
                        icon: "icon-template"
                    });
                });
                templateList.push(parent);
            });
            return templateList;
        }
    },
    methods: {
        loadConfig() {
            if (exists(config.configFile)) {
                let data = loadConfig(config.configFile);
                this.projectList = data ? data.project : [];
                this.templateList = data ? data.template : [];
                this.dbList = data ? data.datasource : [];
            } else {
                if (localStorage.getItem("template")) {
                    this.templateList = JSON.parse(localStorage.getItem("template"));
                    localStorage.removeItem("template");
                }
                if (localStorage.getItem("datasource")) {
                    this.dbList = JSON.parse(localStorage.getItem("datasource"));
                    localStorage.removeItem("datasource");
                }
                if (localStorage.getItem("project")) {
                    this.projectList = JSON.parse(localStorage.getItem("project"));
                    localStorage.removeItem("project");
                }
                this.saveConfig();
            }
            if (!exists(config.dataType)) {
                saveToFile(config.dataType, JSON.stringify(dataTypeList), false);
                this.dataBaseType = dataTypeList.database;
                this.codeLangType = dataTypeList.codeLang;
            } else {
                let data = loadConfig(config.dataType);
                this.dataBaseType = data.database;
                this.codeLangType = data.codeLang;
            }
        },
        saveConfig() {
            let data = {
                project: this.projectList,
                template: this.templateList,
                datasource: this.dbList
            };
            saveToFile(config.configFile, JSON.stringify(data), false);
        }
    },
    render: h => h(App)
}).$mount("#app");
export default vue;