import axios from "axios";
import store from "@/store";
export default {
    state: {
        examchapterlists: [],
    },
    mutations: {
        setExamChapterLists(state, data){
            state.examchapterlists = data;
        },
        addExamChapterLists(state, data){
            state.examchapterlists = [...state.examchapterlists, data];
        },
        updateExamChapterLists(state, data){
            var index = state.examchapterlists.indexOf(data);
            if (index > -1) {
                state.examchapterlists.splice(index, 1);
            }
        },


    },
    actions: {
        async fetchExamChapterLists({commit}, payload){
            let result = 0;
            let response = await axios.post("/exampartials", payload);
            if (response.status === 200) {
                result = 1;
                console.log(response);
                const partials = response.data.map(p=>({
                    id: p.id,
                    startQ: p.startQ,
                    endQ: p.endQ,
                    exam_id: p.exam_id,
                    chapter_id:p.chapter_id,
                    chapter_name: p.chapter.name
                }));
                commit("setExamChapterLists", partials)
            }
            return result;
        },
        async saveImage({commit}, formData){
            console.log(formData);
            try {
                const response = await axios.post('/saveimage', formData, {headers: {'Content-Type': 'multipart/form-data'}});
                if(response.status === 201){
                    commit("setStudentModelKey",{key: "file_id", value: response.data.id})
                    commit("setStudentModelKey",{key: "file_path", value: response.data.path})
                }
            } catch (e) {
                store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
        },

        async createExamPartial({commit}, payload){
            let result = 0;
            let response = await axios.post("/exampartialcreate", payload);
            if(response.status === 201){
                result = 1;
                const partial = {
                    id: response.data.id,
                    startQ: response.data.startQ,
                    endQ:response.data.endQ,
                    exam_id: response.data.exam_id,
                    chapter_id:response.data.chapter_id,
                    chapter_name: payload.chapter.name
                }
                commit("addExamChapterLists", partial)
                store.commit("setSucMessage", "Kayıt başarıyla eklendi.");
            } else {
                result = 0;
                store.commit("setErrMessage", response.data.message);
            }
            return result;
        },
        async deleteExamPartial({commit}, payload){
            let result = 0;
            try {
                let response = await axios.delete("/delexampartial/"+payload.id);
                if(response.status === 200){
                    commit("updateExamChapterLists", payload)
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
        examchapterlists: (state)=>state.examchapterlists,
    }
}
