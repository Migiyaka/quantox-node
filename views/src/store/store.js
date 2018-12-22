import Vue from 'vue';
import Vuex from 'vuex';

import server from './modules/serverModule.js';
import notification from './modules/notificationModule.js';
import authorization from './modules/authorizationModule.js';
import ticket from './modules/ticketModule.js';
import status from './modules/statusModule.js';
import user from './modules/userModule.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        server,
        notification,
        authorization,
        ticket,
        status,
        user,
    },
});
