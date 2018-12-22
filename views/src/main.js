import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import VeeValidate from 'vee-validate';

import App from './App.vue';
import Filters from './filters/filters';

import router from './router/router';
import store from './store/store';

const env = process.env.NODE_ENV || 'development';

Vue.config.productionTip = false;

Vue.use(VeeValidate);
Vue.use(Filters);

Vue.use(new VueSocketIO({
    connection: env === 'development' ? 'http://localhost:3000/' : '',
}));

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
