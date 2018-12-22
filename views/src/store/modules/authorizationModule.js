export default {
    namespaced: true,
    state: {
        data: {},
        token: '',
    },
    getters: {
        getData(state) {
            return state.data;
        },
        getToken(state) {
            return state.token;
        },
        isLoggedIn(state) {
            return state.token !== '';
        },
    },
    mutations: {
        setData(state, data) {
            state.data = data;
        },
    },
    actions: {
        loadToken(context) {
            if (document.cookie && document.cookie.indexOf('quantox_node_userToken') >= 0) {
                context.state.token = document.cookie.split('quantox_node_userToken=')[1].split(';')[0];
                context.commit('server/setAuthorization', context.state.token, { root: true });
            }
        },
        setToken(context, token) {
            context.state.token = token;
            document.cookie = `quantox_node_userToken=${token}; path=/;`;
            context.commit('server/setAuthorization', token, { root: true });
        },
        removeToken(context) {
            context.state.token = '';
            document.cookie = `quantox_node_userToken=; path=/; expires=${new Date(0)}`;
            context.commit('server/setAuthorization', null, { root: true });
        },
        async login(context, { username, password }) {
            const response = await context.dispatch('server/http', {
                method: 'post',
                url: 'authorization/login',
                data: {
                    username,
                    password,
                },
            }, { root: true });

            await context.dispatch('setToken', response.token);

            try {
                await context.dispatch('loadData');
            } catch (err) {
                throw err;
            }
        },
        async logout(context) {
            await context.dispatch('removeToken');
        },
        async register(context, { firstName, lastName, email, username, password }) {
            return context.dispatch('server/http', {
                method: 'post',
                url: 'authorization/register',
                data: {
                    firstName,
                    lastName,
                    email,
                    username,
                    password,
                },
            }, { root: true });
        },
        async activate(context, { id }) {
            const response = await context.dispatch('server/http', {
                method: 'patch',
                url: `authorization/activate/${id}`,
            }, { root: true });

            context.dispatch('user/loadList', {}, { root: true });
        },
        async loadData(context) {
            const response = await context.dispatch('server/http', {
                method: 'get',
                url: `authorization/${context.getters.getToken}`,
                hideMessage: true,
            }, { root: true });

            context.commit('setData', response.user);
        },
    },
};
