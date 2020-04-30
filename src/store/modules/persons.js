import axios from "axios";

const person = {
    state: {
        personList: [],
        personHeader: [
            {
                name: "__sequence",
                title: "#",
                titleClass: "center aligned",
                dataClass: "right aligned"
            },
            {
                name: "name",
                title: '<i class="fas fa-lightbulb"></i>Personel Adı'
            },
            {
                name: "surname",
                title: '<i class="far fa-file-alt"></i> Personel Soyadı'
            },
            {
                name: "tc",
                title: '<i class="far fa-file-alt"></i> Personel TC'
            },
            {
                name: "__slot:actions",
                title: '<i class="fas fa-pen-fancy"></i>İşlemler'
            }
        ]
    },
    mutations: {
        setPersons(state, data) {
            state.personList = data;
        },

    },
    actions: {
        updatePersons({ commit, state }, updatedData) {
            let deferred = new Promise((resolve, reject) => {
                debugger
                axios
                    .put("/persons/" + updatedData.id, updatedData)
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
        deletePersons({ commit, state }, data) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .delete("/persons/" + data.id)
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


        fetchPersons({commit}, data) {
            debugger
            let deferred = new Promise((resolve, reject) => {
                axios
                    .get("/persons", data.opt)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },
        createPersons({commit, state, dispatch}, data) {
            debugger
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/addperson", data)
                    .then(response => {
                        if (response.status === 200) {
                            state.personList = [...state.personList, response.data];
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
        getPersons(state) {
            return state.personList;
        },
        getPersonsHeader(state) {
            return state.personHeader;

        }
    }
};
export default person;