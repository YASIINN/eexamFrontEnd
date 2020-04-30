import axios from "axios";

const branches = {
  state: {
    branchesList: [],
    branchesHeader: [
      {
        name: "Şube Adı",
        display: "name"
      },
      {
        name: "Şube Kodu",
        display: "code"
      },
      {
        name: "",
        display: ""
      }
    ]
  },
  mutations: {
    setBranches(state, data) {
      state.branchesList = data;
    }
  },
  actions: {
    updateBranches({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/branch/" + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.branchesList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.branchesList[i].name = response.data.name;
                  state.branchesList[i].code = response.data.code;
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
    deleteBranches({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/branch/" + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              state.branchesList.splice(data.index, 1);
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },

        fetchBranches({commit}) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .get("/branch")
                    .then(res => {
                        commit("setBranches", res.data);
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },

        createBranches({commit, state, dispatch}, data) {

            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/branch", data)
                    .then(response => {
                        if (response.status === 200) {
                            state.branchesList = [...state.branchesList, response.data];
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
    getBranches(state) {
      return state.branchesList;
    },
    getBranchesHeader(state) {
      return state.branchesHeader;
    }
  }
};
export default branches;
