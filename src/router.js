import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Main from './views/Main.vue'
import DBManage from './views/DBManage.vue'
import TemplateManage from './views/TemplateManage.vue'

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
            path: "/DBManage",
            name: "DBManage",
            component: DBManage
        }, {
            path: "/TemplateManage",
            name: "TemplateManage",
            component: TemplateManage
        }]
    }]
})