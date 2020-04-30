import axios from "axios";

const lessons = {
    state: {
        lessonList: [],
        lessonHeader: [
            {
                name: "Ders Adı",
                display: "name"
            },
            {
                name: "",
                display: ""
            }
        ]
    },
    mutations: {
        setLesson(state, data) {
            state.lessonList = data;
        }
    },
    actions: {
        updateLesson({commit, state}, updatedData) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .put("/lesson/" + updatedData.id, updatedData)
                    .then(response => {
                        if (response.status === 200) {
                            debugger
                            state.lessonList.forEach((item, i) => {
                                if (item.id === response.data.id) {
                                    state.lessonList[i].name = response.data.name
                                }
                            });
                        }
                        resolve(response);
                    })
                    .catch(err => {
                        resolve(err.message);
                    });
            });

            return deferred;
        },
        deleteLesson({commit, state}, data) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .delete("/lesson/" + data.deleted.id)
                    .then(response => {
                        if (response.status === 200) {
                            state.lessonList.splice(data.index, 1);
                        }
                        resolve(response);
                    })
                    .catch(err => {
                        resolve(err.message);
                    });
            });
            return deferred;
        },

        fetchLesson({commit}) {
            debugger
            let deferred = new Promise((resolve, reject) => {
                axios
                    .get("/lesson")
                    .then(res => {
                        commit("setLesson", res.data);
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },

        createLessons({commit, state, dispatch}, data) {
            debugger
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/lesson", data)
                    .then(response => {
                        if (response.status === 200) {
                            state.lessonList = [...state.lessonList, response.data];
                        }
                        resolve(response);
                    })
                    .catch(err => {
                        resolve(err.message);
                    });
            });

            return deferred;
        }
    },
    getters: {
        getLessons(state) {
            return state.lessonList;
        },
        getLessonHeader(state) {
            return state.lessonHeader;
        }
    }
};
export default lessons;
