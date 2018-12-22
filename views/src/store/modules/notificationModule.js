const messageModule = {
    namespaced: true,
    state: {
        list: [],
        order: 'reversed',
    },
    getters: {
        getList(state) {
            return state.list;
        },
    },
    mutations: {
        add(state, notification) {
            if (state.order === 'reversed') {
                state.list.unshift(notification);
            } else {
                state.list.push(notification);
            }
        },
        remove(state) {
            if (state.order === 'reversed') {
                state.list.pop();
            } else {
                state.list.shift();
            }
        },
        setOrder(state, order) {
            state.order = order;
        },
    },
    actions: {
        calculateOrder(context, position) {
            if (position.indexOf('top-') >= 0) {
                context.commit('setOrder', 'reversed');
            } else {
                context.commit('setOrder', 'normal');
            }
        },
        show(context, notification) {
            setTimeout(() => {
                context.commit('remove');
            }, 3000);

            context.commit('add', notification);
        },
    },
};

export default messageModule;
