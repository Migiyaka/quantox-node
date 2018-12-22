import store from '../store/store';

export default {
    async init(to, from, next) {
        store.commit('server/createInstance');
        await store.dispatch('authorization/loadToken');

        if (!store.getters['authorization/isLoggedIn']) {
            if (to.path !== '/login') {
                next('/login');
            } else {
                next();
            }
        } else {
            await store.dispatch('authorization/loadData');

            if (to.path === '/login') {
                next('/');
            } else {
                next();
            }
        }
    },
};
