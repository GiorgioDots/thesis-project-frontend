import Vuex from 'vuex';
import axios from 'axios';

const createStore = () => {
    return new Vuex.Store({
        state: {
            token: localStorage.getItem('token'),
            user: {}
        },
        mutations: {
            setUserId(state, userId) {
                state.user.id = userId;
            },
            setToken(state, token) {
                state.token = token;
            },
            clearUser(state) {
                state.user = {}
            },
            clearToken(state) {
                state.token = null;
            }
        },
        actions: {
            setUserId({ commit }, userId) {
                commit('setUserId', userId);
            },
            setToken({ commit }, token) {
                commit('setToken', token);
            },
            onLogin({ commit }, formData) {
                return axios.post(`${process.env.baseUrl}/auth/login`, {
                    ...formData
                }).then(res => {
                    commit('setUserId', res.data.userId);
                    commit('setToken', res.data.token);
                    return Promise.resolve(res.data);
                }).catch(error => {
                    return Promise.reject(error.response);
                });
            },
            onSignup({ commit }, formData) {
                return axios.put(`${process.env.baseUrl}/auth/signup`, {
                    ...formData
                }).then(res => {
                    commit('setUserId', res.data.userId);
                    commit('setToken', res.data.token);
                    return Promise.resolve(res.data);
                }).catch(error => {
                    return Promise.reject(error.response);
                });
            },
            onLogout({ commit }) {
                commit('clearUser');
                commit('clearToken');
            }
        },
        getters: {
            getUser(state) {
                return state.user;
            },
            getToken(state) {
                return state.token
            }
        }
    })
}

export default createStore;