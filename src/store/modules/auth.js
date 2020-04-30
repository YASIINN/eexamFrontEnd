import axios from "axios";
import router from "../../router";

const auth = {
    state: {
        user: "",
        token: ""
    },
    mutations: {
        setUser(state, data) {
            localStorage.setItem("user", data)
            state.user = data;
        },
        setToken(state, data) {
            localStorage.setItem("token", data)
            state.token = data
        },
        clearToken(state) {
            localStorage.removeItem("token")
            state.token = ""

        },
        clearUser(state) {
            localStorage.removeItem("user")
            state.user = ""
        }
    },
    actions: {
        changePass({commit, state, dispatch}, data) {
            let deferred = new Promise(((resolve, reject) => {
                axios.post("/changepass", data).then((res) => {
                    resolve(res)
                }).catch((err) => {
                    resolve(err)
                })
            }))
            return deferred;
        },
        initAuth({commit, state, dispatch}, data) {
            return new Promise((resolve, reject) => {
                let token = localStorage.getItem("token");
                let user = localStorage.getItem("user");
                if (token && user) {
                    commit("setToken", token);
                    commit("setUser", user);
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        },
        logout({commit, state, dispatch}, data) {
            commit("clearToken")
            commit("clearUser");
            localStorage.clear()
            router.replace("/Login");
        },
        login({commit, state, dispatch}, data) {
            debugger
            return new Promise((resolve, reject) => {
                axios.post("/login", data).then((res) => {
                    if (res.status == 200) {
                        commit("setToken", res.data.token)
                        commit("setUser", JSON.stringify(res.data.user))
                    } else if (res.status == 204) {
                    }
                    resolve(res)
                }).catch((err) => {
                    resolve(err)
                })
            });
        }
    },
    getters: {
        getUser(state) {
            return JSON.parse(state.user);
        },
        getToken(state) {
            return state.token;
        },

    }
};
export default auth;
