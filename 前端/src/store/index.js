import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import api from './api'
Vue.prototype.$api = api
Vue.use(Vuex)
export default new Vuex.Store({
    state,
    mutations,
    actions,
})