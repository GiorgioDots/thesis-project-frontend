import Vuex from 'vuex';
import axios from 'axios';

const createStore = () => {
    return new Vuex.Store({
        state: {
            token: null
        },
        mutations: {
            setToken(state, token){
                state.token = token
            },
            removeToken(state){
                state.token = null;
            }
        },
        actions: {
            onLogin({commit}, authData){
                return axios.post(`${process.env.baseAuthUrl}accounts:signInWithPassword?key=${process.env.fbAPIKey}`, {
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true
                }).then(res => {
                    localStorage.setItem('token', res.data.idToken);
                    commit('setToken', res.data.idToken);
                }).catch(error => {
                    return true;
                })
            },
            onSignUp({commit}, formData){
                return axios.post(`${process.env.baseAuthUrl}accounts:signUp?key=${process.env.fbAPIKey}`, {
                    email: formData.email,
                    password: formData.password,
                    returnSecureToken: true
                }).then(res => {
                    localStorage.setItem('token', res.data.idToken);
                    commit('setToken', res.data.idToken);
                })
            },
            initToken({commit}){
                commit('setToken', localStorage.getItem('token'));
            },
            onLogout({commit}){
                localStorage.removeItem('token');
                commit('removeToken')
            }
        },
        getters: {
            getToken(state) {
                return state.token;
            }
        }
    })
}

export default createStore;