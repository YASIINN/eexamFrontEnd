import axios from "axios";
import store from "@/store";
import examModel from "../models/examModel";
export default {
    state: {
        scblists: [],
        exam: examModel,
        examstudents: [],
        dbexam: {},
    },
    mutations: {
        setExamModelKey(state, payload){
            state.exam[payload.key] = payload.value;
        },
        setExamModel(state, payload){
            state.exam = payload;
        },
        setDbExam(state, payload){
            state.dbexam = payload;
        },
        setSCBLists(state, data){
            state.scblists = data;
        },
        setExamStudents(state, data){
            state.examstudents = data;
        }

    },
    actions: {
        async fetchExams({commit}, payload){
            let response = await axios.post("/exams", payload, payload.httpOpt);
            return response;
        },
        async fetchDbExam({commit}, payload){
            let result = 0;
            let response = await axios.post("/getexam", payload);
            if (response.status === 200) {
                result = 1;
                commit("setDbExam", response.data)
            } else {
                store.commit("setErrMessage", response.data.message);
            }
            return result;
        },
        async fetchStudentsExamList({commit}, payload){
            let result = 0;
            let response = await axios.post("/examstudents", payload);
            if (response.status === 200) {
                result = 1;
                commit("setExamStudents", response.data)
            } else {
                store.commit("setErrMessage", response.data.message);
            }
            return result;
        },
        async fetchSCBLists({commit}){
            let result = 0;
            let response = await axios.get("/scblists");
            if (response.status === 200) {
                result = 1;
                commit("setSCBLists", response.data)
            }
            return result;
        },
        async createExam({commit}, payload){
            let result = 0;
            let response = await axios.post("/examcreate", payload);
            if(response.status === 201){
                result = 1;
               commit("setExamModelKey", { key: "id", value: response.data.id})
                store.commit("setSucMessage", "Kayıt başarıyla eklendi.");
            } else {
                result = 0;
                store.commit("setErrMessage", response.data.message);
            }
            return result;
        },
        async updateExam({commit}, payload){
            let result = 0;
            let response = await axios.post("/examupdate", payload);
            if(response.status === 201){
                result = 1;
                store.commit("setSucMessage", "Kayıt başarıyla güncellendi.");
            } else {
                result = 0;
                store.commit("setErrMessage", response.data.message);
            }
            return result;
        },
        async deleteExam({commit}, payload){
            let result = 0;
            try {
                let response = await axios.delete("/delexam/"+payload.id);
                if(response.status === 200){
                    store.commit("setSucMessage", response.data.message);
                    result = 1;
                } else if(response.status === 202){
                    store.commit("setErrMessage", response.data.message);
                }
            } catch (e) {
                store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },

    },
    getters: {
        scblists: (state)=>state.scblists,
        exam: (state)=>state.exam,
        dbexam: (state)=>state.dbexam,
        examstudents: (state)=>state.examstudents,
    }
}
