import Vue from 'vue'
// Vue Router
import VueRouter  from 'vue-router'
import { routes } from './routes'
import store      from './store'
import App        from './App.vue'
import VueResource from 'vue-resource'
import Vuetify from 'vuetify'
import 'date-input-polyfill'
import 'vuetify/dist/vuetify.min.css'
// import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'vue-awesome/icons';
// import Icon from 'vue-awesome/components/Icon';

// axios.defaults.withCredentials = true;

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuetify);

// Vue.component('icon', Icon);


const router = new VueRouter({
    routes,
    // get rid of #
    mode: 'history'
});



// Event Bus
Vue.prototype.$EventBus = new Vue();

new Vue({
    store,
    el: '#app',
    router,
    render: h => h(App)
})

// 메뉴에서 레벨 체크해서 갈 수 있는 URL 만 표시
// 강제로 URL 입력했을 경우, 경고창 띄우고 현재 페이지 그대로 있슴
router.beforeEach((to, _from, next) => {
  // console.log("test store.........");
  // console.log(store);
    var type_cd = store.state.user.type_cd;

    if(to.meta.requiresAuth) {
      console.log("type_cd : " + type_cd);
      // console.log(record.meta.requiresType);
      if(type_cd == "") {
        alert("접근할 수 없는 페이지 입니다.");
        next(_from);
      }else if(type_cd == "9998" || type_cd == "9999") {
        next();
      }else {
        console.log("to.meta.requiresType...........");
        console.log(to.meta.requiresType);
        if(to.meta.requiresType.includes(type_cd)) {
          next();
        }else {
          alert("접근할 수 없는 페이지 입니다.");
          next(_from);
        }
      }
    } else {
      next();
    }
})