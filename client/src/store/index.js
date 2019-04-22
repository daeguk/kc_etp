import Vue from 'vue';
import Vuex from 'vuex';
import Constant from './store_constant.js';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: [{ email: "", 
                password: "", 
                name: "", 
                type_cd: "", 
                type_name: "", 
                inst_cd: "", 
                inst_name: "",
                hp_no: "",
                tel_no: "",
              }],
    },
    mutations: {
        [Constant.ADD_USER]: (state, payload) => {
            state.user.email = payload.email;
            state.user.password = payload.password;
            state.user.name = payload.name;
            state.user.type_cd = payload.type_cd;
            state.user.type_name = payload.type_name;
            state.user.inst_cd = payload.inst_cd;
            state.user.inst_name = payload.inst_name;
            state.user.hp_no = payload.hp_no;
            state.user.tel_no = payload.tel_no;
        },
        [Constant.DELETE_USER]: (state) => {
          state.user.email = "";
          state.user.password = "";
          state.user.name = "";
          state.user.type_cd = "";
          state.user.type_name = "";
          state.user.inst_cd = "";
          state.user.inst_name = "";
          state.user.hp_no = "";
          state.user.tel_no = "";
    },
    }
});

export default store;