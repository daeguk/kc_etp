import Vue from 'vue';
import Vuex from 'vuex';
import Constant from './store_constant.js';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: [{ user_email: "", 
                user_name: "", 
                user_type_cd: "", 
                user_type_name: "", 
                user_type_cd: "", 
                user_type_name: ""}],
    },
    mutations: {
        [Constant.ADD_USER]: (state, payload) => {
            state.user.user_email = payload.user_email;
            state.user.user_name = payload.user_name;
            state.user.user_type_cd = payload.user_type_cd;
            state.user.user_type_name = payload.user_type_name;
            state.user.user_inst_cd = payload.user_inst_cd;
            state.user.user_inst_name = payload.user_inst_name;
        },
        [Constant.DELETE_USER]: (state) => {
          state.user.user_email = "";
          state.user.user_name = "";
          state.user.user_type_cd = "";
          state.user.user_type_name = "";
          state.user.user_inst_cd = "";
          state.user.user_inst_name = "";
      },
    }
});

export default store;