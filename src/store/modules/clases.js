import axios from "axios";

const clases = {
  state: {
    clasesList: [],
    clasesHeader: [
      {
        name: "Sınıf Adı",
        display: "name"
      },
      {
        name: "Sınıf Kodu",
        display: "code"
      },
      {
        name: "",
        display: ""
      }
    ]
  },
  mutations: {
    setClases(state, data) {
      state.clasesList = data;
    }
  },
  actions: {
    updateClases({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/clases/" + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.clasesList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.clasesList[i].name = response.data.name;
                  state.clasesList[i].code = response.data.code;
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
    deleteClases({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/clases/" + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              state.clasesList.splice(data.index, 1);
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },

        fetchClases({commit}) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .get("/clases")
                    .then(res => {
                        commit("setClases", res.data);
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },

        createClases({commit, state, dispatch}, data) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/clases", data)
                    .then(response => {
                        if (response.status === 200) {
                            state.clasesList = [...state.clasesList, response.data];
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
    getClases(state) {
      return state.clasesList;
    },
    getClasesHeader(state) {
      return state.clasesHeader;
    }
  }
};
export default clases;
