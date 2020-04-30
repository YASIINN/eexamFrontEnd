import axios from "axios";
import store from "@/store";
import groupfileModel from "../models/groupfileModel";
export default {
    state: {
        egroupfilelists: [],
        examgroupfile: groupfileModel,
    },
    mutations: {
        setExamGroupFileModelKey(state, payload){
            state.examgroupfile[payload.key] = payload.value;
        },
        setExamGroupFileLists(state, data){
            state.egroupfilelists = data;
        },
        addExamGroupFileLists(state, data){
            state.egroupfilelists = [...state.egroupfilelists, data];
        },
        updateExamGroupFileLists(state, data){
            var index = state.egroupfilelists.indexOf(data);
            if (index > -1) {
                state.egroupfilelists.splice(index, 1);
            }
        },


    },
    actions: {
        async fetchExamGroupFileLists({commit}, payload){
            let result = 0;
            let response = await axios.post("/examgroupfilelists", payload);
            if (response.status === 200) {
                result = 1;
                commit("setExamGroupFileLists", response.data)
            }
            return result;
        },
        async saveGroupFileImage({commit}, formData){
            try {
                const response = await axios.post('/saveExamFile', formData, {headers: {'Content-Type': 'multipart/form-data'}});
                console.log(response);
                if(response.status === 201){
                    commit("setExamGroupFileModelKey",{key: "file_id", value: response.data.id})
                    commit("setExamGroupFileModelKey",{key: "file_path", value: response.data.path})
                } else {
                    store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
                }
            } catch (e) {
                store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
        },
        async downloadGroupFileImage({commit}, payload){
            let result = 0;
            try {
                const response = await axios.post('/filedownload', payload);
                if(response.status === 200){
                    result = 1;
                }
            } catch (e) {
                store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },
        async createExamGroupFile({commit}, payload){
            let result = 0;
            let response = await axios.post("/examgroupfilecreate", payload);
            if(response.status === 201){
                result = 1;
                const partial = {
                    id: response.data.id,
                    file_id: payload.file_id,
                    file_path: payload.file_path,
                    exam_id: response.data.exam_id,
                    group_id:response.data.group_id,
                    group_name: payload.group.name
                }
                commit("addExamGroupFileLists", partial)
                store.commit("setSucMessage", "Kayıt başarıyla eklendi.");
            } else {
                result = 0;
                store.commit("setErrMessage", response.data.message);
            }
            return result;
        },
        async deleteExamGroupFile({commit}, payload){
            let result = 0;
            try {
                let response = await axios.delete("/delexamgroupfile/"+payload.id);
                if(response.status === 200){
                    commit("updateExamGroupFileLists", payload)
                    result = 1;
                } else {
                    store.commit("setErrMessage", response.data.message);
                }
            } catch (e) {
                store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },

    },
    getters: {
        egroupfilelists: (state)=>state.egroupfilelists,
    }
}
