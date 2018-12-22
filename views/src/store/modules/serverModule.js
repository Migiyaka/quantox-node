import axios from 'axios';

const env = process.env.NODE_ENV || 'development';

export default {
    namespaced: true,
    state: {
        instance: null,
    },
    getters: {
        getInstance(state) {
            return state.instance;
        },
    },
    mutations: {
        createInstance(state) {
            if (!state.instance) {
                state.instance = axios.create({
                    baseURL: `${env === 'development' ? 'http://localhost:3000/' : ''}api/`,
                });   
            }
        },
        setAuthorization(state, token) {
            if (state.instance) {
                state.instance.defaults.headers.authorization = token ? `Basic ${token}` : null;
            }
        }
    },
    actions: {
        async http(context, { url, method, data, hideMessage, hideErrMessage } = {}) {
            try {
                const response = await context.getters.getInstance.request({
                    url,
                    method,
                    data,
                });

                if (!hideMessage) {
                    context.dispatch('notification/show', {
                        type: 'success',
                        text: response.data.message,
                    }, { root: true });
                }

                return response.data;
            } catch (err) {
                console.log(err.response);

                if (!hideErrMessage) {
                    context.dispatch('notification/show', {
                        type: 'error',
                        text: err.response.data.error,
                    }, { root: true });
                }

                return Promise.reject(err.response.data);
            }
        },
    },
};
