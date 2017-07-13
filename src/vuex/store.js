import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    salesmanName:"",
    salesmanMobileNumber:"",
    salesmanEmail:"",
    salesmanMobileNumberHref:"",
    salesmanEmailHref:"",
    customerStatus:"",
    companyLogo:"",
    companyInfo:"",
    wechatQrCode:""
};

const mutations = {
    showUserName(state) {
        console.log(state.companyId);
    }
};

export default new Vuex.Store({
    state,
    mutations
})
