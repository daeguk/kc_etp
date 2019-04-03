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

/*
// Routing전 로그인 체크 
router.beforeEach(function (to, from, next) {
    //alert(store.state.user.user_level);
    console.log("store="+ JSON.stringify(store.state.user));
    console.log(store.state.user[0].user_level);

    // to: 이동할 url에 해당하는 라우팅 객체
    console.log(to.path);

    if (to.path != '/login') {
        if (store.state.user[0].user_level < 2) {        
        // 이동할 페이지에 인증 정보가 필요하면 경고 창을 띄우고 페이지 전환은 하지 않음
            
            alert('로그인 후 사용 하시기 바랍니다.');
            next('/login');   
        } else {
            console.log("routing success : '" + to.path + "'");
            next(); // 페이지 전환
        }; 
    } else {
        next();
    }
  });
*/