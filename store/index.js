import Vuex from 'vuex';

const createStore = () => {
    return new Vuex.Store({
        state: {
            user: null
        },
        mutations: {
            setUser(state, user) {
                localStorage.setItem("RaspiFaceUser", JSON.stringify(user));
                state.user = user;
            },
            logoutUser(state) {
                state.user = null;
            }
        },
        actions: {
            setUser({ commit }, user) {
                commit("setUser", user);
            },
            logoutUser({ commit }) {
                commit('logoutUser');
            }
        },
        getters: {
            getUser(state) {
                return state.user;
            }
        }
    })
}

export default createStore;