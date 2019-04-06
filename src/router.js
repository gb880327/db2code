import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import DBManage from './views/DBManage.vue'

Vue.use(Router)

export default new Router({
    mode: "hash",
    routes: [{
        path: '/',
        name: 'index',
        component: Index,
        children: [{
            path: "/DBManage",
            name: "DBManage",
            component: DBManage
        }]
    }]
})