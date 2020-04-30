import axios from "axios";

const studentexam = {
    state: {
        studentExam: [],
    },
    mutations: {
        setStudentExam(state, data) {
            state.studentExam = data;
        },

    },
    actions: {
        fetchExam({commit}, data) {
            debugger
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/exam", data)
                    .then(res => {
                        debugger
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },
        checkExamDate({commit}, data) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/checkExamDate", data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },
        createStudentExam({commit}, data) {
            debugger
            let deferred = new Promise((resolve, reject) => {
                debugger
                axios
                    .post("/createStudentExam", data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },
        fetchStudentExam({commit}, data) {
            debugger
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/getStudentExam", data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },
    },
    getters: {}
};
export default studentexam;
