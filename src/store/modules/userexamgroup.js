import axios from "axios";
import store from "@/store";
export default {
    state: {
    },
    mutations: {
    },
    actions: {
        async createUserExamGroup({commit}, payload){
            let result = 0;
            let response = await axios.post("/createexamusergroup", payload);
            console.log(response);
            if(response.status === 201){
                result = 1;
                store.commit("setSucMessage", response.data.message);
            } else {
                result = 0;
                store.commit("setErrMessage", response.data.message);
            }
            return result;
        },

    },
    getters: {
    }
}
