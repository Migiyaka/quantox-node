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
                url: 'status',
                hideMessage: true,
            }, { root: true });

            context.commit('setList', response.list);
        },
        async load(context, { id }) {
            const response = await context.dispatch('server/http', {
                method: 'get',
                url: `status/${id}`,
                hideMessage: true,
            }, { root: true });

            return Promise.resolve(response.status);
        },
        async create(context, { name, text }) {
            const response = await context.dispatch('server/http', {
                method: 'post',
                url: 'status',
                data: {
                    name,
                    text,
                },
            }, { root: true });

            context.dispatch('loadList');
        },
        async update(context, { id, name, text }) {
            const response = await context.dispatch('server/http', {
                method: 'patch',
                url: `status/${id}`,
                data: {
                    name,
                    text,
                },
            }, { root: true });

            context.dispatch('loadList');
        },
        async delete(context, { id }) {
            const response = await context.dispatch('server/http', {
                method: 'delete',
                url: `status/${id}`,
            }, { root: true });

            context.dispatch('loadList');
        },
    },
};
