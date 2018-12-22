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
                url: 'ticket',
                hideMessage: true,
            }, { root: true });

            context.commit('setList', response.list);
        },
        async load(context, { id }) {
            const response = await context.dispatch('server/http', {
                method: 'get',
                url: `ticket/${id}`,
                hideMessage: true,
            }, { root: true });

            return Promise.resolve(response.ticket);
        },
        async create(context, { title, content, assigneeId }) {
            const response = await context.dispatch('server/http', {
                method: 'post',
                url: 'ticket',
                data: {
                    title,
                    content,
                    assigneeId,
                },
            }, { root: true });

            context.dispatch('loadList');
        },
        async update(context, { id, title, content, assigneeId }) {
            const response = await context.dispatch('server/http', {
                method: 'patch',
                url: `ticket/${id}`,
                data: {
                    title,
                    content,
                    assigneeId,
                },
            }, { root: true });

            context.dispatch('loadList');
        },
        async updateStatus(context, { id, statusId }) {
            const response = await context.dispatch('server/http', {
                method: 'patch',
                url: `ticket/${id}/status`,
                data: {
                    statusId,
                },
            }, { root: true });

            context.dispatch('loadList');
        },
        async delete(context, { id }) {
            const response = await context.dispatch('server/http', {
                method: 'delete',
                url: `ticket/${id}`,
            }, { root: true });

            context.dispatch('loadList');
        },
        async getHistory(context, { id }) {
            const response = await context.dispatch('server/http', {
                method: 'get',
                url: `ticket/${id}/history`,
                hideMessage: true,
            }, { root: true });

            return Promise.resolve(response.history);
        },
    },
};
