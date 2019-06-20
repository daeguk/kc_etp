import Vue from 'vue';
import Vuex from 'vuex';
import Constant from './store_constant.js';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: {
      email: "", 
      password: "", 
      name: "", 
      type_cd: "", 
      type_name: "", 
      inst_cd: "",                 
      inst_name: "",
      krx_cd: "",
      hp_no: "",
      tel_no: "",
    },
    befDates: {
      bef1Week: "",
      bef1Month: "",
      befYtd: "",
      bef1Year: "",
      bef3Year: "",
      bef5Year: "",
      bef10Year: "",
    },
    etpmast: [],    
    etfmast: [],
    etnmast: [],
    indexmast: [],  // 지수전체
    domindexmast: [],  // 국내지수
    forindexmast: [],  // 해외지수
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
      state.user.krx_cd = payload.krx_cd;
      state.user.hp_no = payload.hp_no;
      state.user.tel_no = payload.tel_no;
    },
    [Constant.SET_BEF_DATES]: (state, payload) => {
      state.befDates.bef1Week = payload.bef1Week;
      state.befDates.bef1Month = payload.bef1Month;
      state.befDates.befYtd = payload.befYtd;
      state.befDates.bef1Year = payload.bef1Year;
      state.befDates.bef3Year = payload.bef3Year;
      state.befDates.bef5Year = payload.bef5Year;
      state.befDates.bef10Year = payload.bef10Year;
    },
    [Constant.DELETE_USER]: (state) => {
      state.user.email = "";
      state.user.password = "";
      state.user.name = "";
      state.user.type_cd = "";
      state.user.type_name = "";
      state.user.inst_cd = "";
      state.user.inst_name = "";
      state.user.krx_cd = "";
      state.user.hp_no = "";
      state.user.tel_no = "";
    },
    [Constant.SET_INDEX]: (state, payload) => {
      for(let i=0; i < payload.length; i++) {
        if(payload[i].F16002 == null) continue;
        let tmp = JSON.parse(JSON.stringify(payload[i]));
        state.indexmast.push(tmp);
        if(tmp.large_type == 'KRX' || tmp.large_type == 'FNGUIDE') {
          state.domindexmast.push(tmp);
        }else {
          state.forindexmast.push(tmp);
        }
      }
      state.indexmast.sort(function(a, b) {
        if(a.F16002 > b.F16002) return 1;
        else return -1;
      });
      state.domindexmast.sort(function(a, b) {
        if(a.F16002 > b.F16002) return 1;
        else return -1;
      });
      state.forindexmast.sort(function(a, b) {
        if(a.F16002 > b.F16002) return 1;
        else return -1;
      });
  },
    [Constant.SET_ETP]: (state, payload) => {
      for(let i=0; i < payload.length; i++) {
        let tmp = JSON.parse(JSON.stringify(payload[i]));
        state.etpmast.push(tmp);
        if(tmp.F16493 == '1' || tmp.F16493 == '2') {
          state.etfmast.push(tmp);
        }else {
          state.etnmast.push(tmp);
        }
      }
    },
  }
});

export default store;