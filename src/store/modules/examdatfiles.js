import axios from "axios";
import store from "@/store";
export default {
    state: {
        edatfiles: [],
    },
    mutations: {
     setExamDatFiles(state, data){
         state.edatfiles = data;
     }

    },
    actions: {
        async createExamDatFiles({commit}, payload){
            let result = 0;
            let response = await axios.post("/createdatfile", payload);
            if(response.status === 201){
                result = 1;
            } else {
                result = 0;
                store.commit("setErrMessage", response.data.message);
            }
            return result;
        },
        async removeExamDatFiles({commit}, payload){
            let result = 0;
            let response = await axios.post("/removedatfile", payload);
            if(response.status === 200){
                result = 1;
            } else {
                result = 0;
                store.commit("setErrMessage", response.data.message);
            }
            return result;
        },

    },
    getters: {
        edatfiles: (state)=>state.edatfiles,
    }
}
