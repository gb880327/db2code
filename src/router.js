import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'

import Templage from '@/views/template/index';
import DataSources from "@/views/datasource/index";
import Project from "@/views/project/index";
import Setting from "@/views/setting/index";

Vue.use(Router)

export default new Router({
    mode: "hash",
    routes: [{
        path: "/",
        redirect: "/Main",
        name: "Index"
    }, {
        path: '/',
        component: Index,
        children: [{
            path: "/TemplateManage",
            name: "TemplateManage",
            component: Templage
        }, {
            path: "/DataSource",
            name: "datasoruce",
            component: DataSources
        }, {
            path: "/ProjectManage",
            name: "ProjectManage",
            component: Project
        }, {
            path: "/Setting",
            name: "Setting",
            component: Setting
        }]
    }]
})