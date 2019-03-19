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
