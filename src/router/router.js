import Vue from 'vue'
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 定义组件
import index from '../component/index/index.vue';
import invite from '../component/invite/invite.vue';
import inviteAppraise from '../component/invite/inviteAppraise.vue';
import login from '../component/public/login.vue';
import view from '../component/view/view.vue';
import viewCompare from '../component/view/viewCompare.vue';
import model from '../component/model/model.vue';
import modelView from '../component/model/modelView.vue';
import inviteModel from '../component/invite/inviteModel.vue';
import changePass from '../component/public/changePass.vue';
import modelInfo from '../component/model/modelInfo.vue';
import companyInfo from '../component/public/companyInfo.vue';
import forgetPass from '../component/public/forgetPass.vue';


// 创建一个路由器实例，并且配置路由规则
const routes = [{
        path: '/',
        name: 'index',
        component: index
    },
    {
        path: '/invite',
        name: "invite",
        component: invite
    },
    {
        path: '/view',
        component: view
    },
    {
        path: '/model',
        component: model
    },
    {
        path: '/login',
        component: login
    },
    {
        path: '/inviteAppraise',
        component: inviteAppraise
    },
    {
        path: '/inviteModel',
        component: inviteModel
    },
    {
        path: '/viewCompare',
        component: viewCompare
    },
    {
        path: '/modelView',
        component: modelView
    },
    {
        path: '/changePass',
        component: changePass
    },
    {
        path: '/modelInfo',
        component: modelInfo
    },
    {
        path: '/companyInfo',
        component: companyInfo
    },
    {
        path: '/forgetPass',
        component: forgetPass
    }
];

export default new VueRouter({
    mode: 'hash',
    base: __dirname,
    routes
});
