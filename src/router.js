import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Main from './views/Main.vue'
import TemplateManage from './views/TemplateManage.vue'
import ProjectManage from './views/ProjectManage'

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
            path: "/Main",
            name: "Main",
            component: Main
        }, {
            path: "/TemplateManage",
            name: "TemplateManage",
            component: TemplateManage
        }, {
            path: "/ProjectManage",
            name: "ProjectManage",
            component: ProjectManage
        }]
    }]
})