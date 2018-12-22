export default {
    namespaced: true,
    state: {
        list: [],
    },
    getters: {
        getList(state) {
            return state.list;
        },
    },
    mutations: {
        setList(state, list) {
            state.list = list;
        },
    },
    actions: {
        async loadList(context) {
            const response = await context.dispatch('server/http', {
                method: 'get',
                url: 'user',
                hideMessage: true,
            }, { root: true });

            context.commit('setList', response.list);
        },
        async delete(context, { id }) {
            const response = await context.dispatch('server/http', {
                method: 'delete',
                url: `user/${id}`,
            }, { root: true });

            context.dispatch('loadList');
        },
    },
};
