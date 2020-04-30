import axios from "axios";

const schools = {
    state: {
        schoolsList: [],
        schoolClassBranchList: [],
        schoolHeader: [
            {
                name: "Okul Adı",
                display: "name"
            },
            {
                name: "Okul Kodu",
                display: "code"
            },
            {
                name: "",
                display: ""
            }
        ],
        schoolClassBranchHeader: [
            {
                name: "Okul Adı",
                display: "schoolname"
            },
            {
                name: "Sınıf Adı",
                display: "classname"
            },
            {
                name: "Şube Adı",
                display: "branchname"
            },
            {
                name: "",
                display: ""
            }
        ]
    },
    mutations: {
        setSchools(state, data) {
            state.schoolsList = data;
        },
        setSchoolClassBranchList(state, data) {
            state.schoolClassBranchList = data;
        }
    },
    actions: {
        updateSchools({ commit, state }, updatedData) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .put("/schools/" + updatedData.id, updatedData)
                    .then(response => {
                        if (response.status === 200) {
                            debugger;
                            state.schoolsList.forEach((item, i) => {
                                if (item.id === response.data.id) {
                                    state.schoolsList[i].name = response.data.name;
                                    state.schoolsList[i].code = response.data.code;
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
        deleteSchools({ commit, state }, data) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .delete("/schools/" + data.deleted.id)
                    .then(response => {
                        if (response.status === 200) {
                            state.schoolsList.splice(data.index, 1);
                        }
                        resolve(response);
                    })
                    .catch(err => {
                        resolve(err.message);
                    });
            });
            return deferred;
        },
        deleteSchoolClassBranch({ commit, state }, data) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/deleteSCB", data)
                    .then(response => {
                        if (response.status === 200) {
                            state.schoolClassBranchList.splice(data.index, 1);
                        }
                        resolve(response);
                    })
                    .catch(err => {
                        resolve(err.message);
                    });
            });
            return deferred;
        },
        fetchSchools({ commit }) {
            debugger;
            let deferred = new Promise((resolve, reject) => {
                axios
                    .get("/schools")
                    .then(res => {
                        commit("setSchools", res.data);
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },
        fetchSchoolClassBranch({ commit, state, dispatch }, data) {
            debugger;
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/getSCB", data)
                    .then(res => {
                        if (res.status === 200) {

                            debugger;
                            commit("setSchoolClassBranchList", res.data);
                        } else if (res.status == 204) {
                            commit("setSchoolClassBranchList", []);
                        }
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err.message);
                    });
            });
            return deferred;
        },
        createSchoolClassBranch({ commit, state, dispatch }, data) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/addSCB", data)
                    .then(res => {
                        if (res.status == 200) {
                        }
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err.message);
                    });
            });
            return deferred;
        },
        createSchools({ commit, state, dispatch }, data) {
            debugger;
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/schools", data)
                    .then(response => {
                        if (response.status === 200) {
                            state.schoolsList = [...state.schoolsList, response.data];
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
        getSchools(state) {
            return state.schoolsList;
        },
        getSchoolHeader(state) {
            return state.schoolHeader;
        },
        getSchoolClassBranch(state) {
            return state.schoolClassBranchList;
        },
        getSchoolClassBrancHeader(state) {
            return state.schoolClassBranchHeader;
        }
    }
};
export default schools;