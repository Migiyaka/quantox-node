import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/views/Home.vue';
import Authorization from '@/views/Authorization.vue';
import Tickets from '@/views/Tickets.vue';
import Users from '@/views/Users.vue';
import Statuses from '@/views/Statuses.vue';

import routeGuards from './routeGuards.js';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '',
            name: 'home',
            component: Home,
            children: [
                {
                    path: '/',
                    name: 'tickets',
                    component: Tickets,
                },
                {
                    path: '/users',
                    name: 'users',
                    component: Users,
                },
                {
                    path: '/statuses',
                    name: 'statuses',
                    component: Statuses,
                }
            ],
        },
        {
            path: '/login',
            name: 'login',
            component: Authorization,
        },
        {
            path: '*',
            redirect: '/',
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    await routeGuards.init(to, from, next);
});

export default router;
