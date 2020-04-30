import axios from "axios";

const examtype = {
    state: {
        examtypeList: [],
        examtypeHeader: [
            {
                name: "Sınav Türü",
                display: "name"
            },
            {
                name: "",
                display: ""
            }
        ]
    },
    mutations: {
        setExamType(state, data) {
            state.examtypeList = data;
        }
    },
    actions: {
        updateExamType({commit, state}, updatedData) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .put("/etype/" + updatedData.id, updatedData)
                    .then(response => {
                        if (response.status === 200) {
                            debugger
                            state.examtypeList.forEach((item, i) => {
                                if (item.id === response.data.id) {
                                    state.examtypeList[i].name = response.data.name
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
            deleteExamType({commit, state}, data) {
                let deferred = new Promise((resolve, reject) => {
                    axios
                        .delete("/etype/" + data.deleted.id)
                        .then(response => {
                            if (response.status === 200) {
                                state.examtypeList.splice(data.index, 1);
                            }
                            resolve(response);
                        })
                        .catch(err => {
                            resolve(err.message);
                        });
                });
                return deferred;
            },

        fetchExamType({commit}) {
            debugger
            let deferred = new Promise((resolve, reject) => {
                axios
                    .get("/etype")
                    .then(res => {
                        commit("setExamType", res.data);
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },

        createExamType({commit, state, dispatch}, data) {
            debugger
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/etype", data)
                    .then(response => {
                        if (response.status === 200) {
                            state.examtypeList = [...state.examtypeList, response.data];
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
        getExamType(state) {
            return state.examtypeList;
        },
        getExamTypeHeader(state) {
            return state.examtypeHeader;
        }
    }
};
export default examtype;
