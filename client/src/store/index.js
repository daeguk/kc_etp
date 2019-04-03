import Vue from 'vue';
import Vuex from 'vuex';
import Constant from './store_constant.js';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: [{ userid: "test", username: "test", user_level: "1", comp_no: 0, comp_name: "" }],
    },
    mutations: {
        [Constant.ADD_USER]: (state, payload) => {
            state.user.userid = payload.userid;
            state.user.username = payload.username;
            state.user.user_level = payload.user_level;
            state.user.comp_no = payload.comp_no;
            state.user.comp_name = payload.comp_name;
        },
        [Constant.DELETE_USER]: (state) => {
            state.user.userid = "";
            state.user.username = "";
            state.user.user_level = "";
            state.user.comp_no = "";
            state.user.comp_name = "";
        },
    }
});

export default store;