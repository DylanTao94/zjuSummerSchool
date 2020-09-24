import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // state: {
  //   openId:"",
  // },
  // mutations: {
  //   updateOpenId (state, openId) {
  //     state.openId = openId;
  //   }
  // },
  state: {
    openId: "",
  },
  mutations: {
    updateOpenId (state, id) {
      state.openId = id;
    }
  },
  actions: {
  },
  modules: {
  }
})
