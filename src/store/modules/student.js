import axios from "axios";

const student = {
    state: {
        studentList: [],
        studentHeader: [
            {
                name: "__sequence",
                title: "#",
                titleClass: "center aligned",
                dataClass: "right aligned"
            },
            {
                name: "name",
                title: '<i class="fas fa-lightbulb"></i>Öğrenci Adı'
            },
            {
                name: "surname",
                title: '<i class="far fa-file-alt"></i> Öğrenci Soyadı'
            },
            {
                name: "tc",
                title: '<i class="far fa-file-alt"></i> Öğrenci TC'
            },
            {
                name: "schoolNo",
                title: '<i class="far fa-file-alt"></i> Öğrenci Okul No'
            },
            {
                name: "school.name",
                title: '<i class="far fa-file-alt"></i> Okulu'
            },
            {
                name: "class.name",
                title: '<i class="far fa-file-alt"></i> Sınıfı'
            },
            {
                name: "branch.name",
                title: '<i class="far fa-file-alt"></i> Şubesi'
            },
            {
                name: "__slot:actions",
                title: '<i class="fas fa-pen-fancy"></i>İşlemler'
            }
        ]
    },
    mutations: {
        setStudents(state, data) {
            state.studentList = data;
        },

    },
    actions: {
        updateStudent({commit, state}, updatedData) {
            let deferred = new Promise((resolve, reject) => {
                debugger
                axios
                    .put("/student/" + updatedData.id, updatedData)
                    .then(response => {
                        debugger
                        if (response.status === 200) {

                        }
                        resolve(response);
                    })
                    .catch(err => {
                        resolve(err.message);
                    });
            });

            return deferred;
        },
        deleteStudent({commit, state}, data) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .delete("/student/" + data.id)
                    .then(response => {
                        if (response.status === 200) {
                        }
                        resolve(response);
                    })
                    .catch(err => {
                        resolve(err.message);
                    });
            });
            return deferred;
        },
        fetchCBStudent({commit}, data) {
            let deferred = new Promise(((resolve, reject) => {
                debugger
                axios
                    .post("/getcbstudent", {clasid: data.clasid, branchid: data.branchid}, data.opt)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            }))
            return deferred

        },
        fetchStudent({commit}, data) {
            debugger
            let deferred = new Promise((resolve, reject) => {
                if (data.fullname == "") {
                    axios
                        .post("/getstudent", {fullname: ""}, data.opt)
                        .then(res => {
                            resolve(res);
                        })
                        .catch(err => {
                            resolve(err);
                        });
                } else {
                    axios
                        .post("/getstudent", {fullname: data.fullname}, data.opt)
                        .then(res => {
                            resolve(res);
                        })
                        .catch(err => {
                            resolve(err);
                        });
                }

            });
            return deferred;
        },
        createStudent({commit, state, dispatch}, data) {
            debugger
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/student", data)
                    .then(response => {
                        if (response.status === 200) {
                            state.studentList = [...state.studentList, response.data];
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
        getStudents(state) {
            return state.studentList;
        },
        getStudentHeader(state) {
            return state.studentHeader;

        }
    }
};
export default student;