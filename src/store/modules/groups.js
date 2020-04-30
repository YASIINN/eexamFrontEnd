import axios from "axios";

const groups = {
  state: {
    groupsList: [],
    groupsHeader: [
      {
        name: "Grup Adı",
        display: "name"
      },
      {
        name: "",
        display: ""
      }
    ]
  },
  mutations: {
    setGroups(state, data) {
      state.groupsList = data;
    }
  },
  actions: {
    updateGroups({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/group/" + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.groupsList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.groupsList[i].name = response.data.name;
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
    deleteGroups({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/group/" + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              state.groupsList.splice(data.index, 1);
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },

        fetchGroups({commit}) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .get("/group")
                    .then(res => {
                        commit("setGroups", res.data);
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },

        createGroups({commit, state, dispatch}, data) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/group", data)
                    .then(response => {
                        if (response.status === 200) {
                            state.groupsList = [...state.groupsList, response.data];
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
    getGroups(state) {
      return state.groupsList;
    },
    getGroupsHeader(state) {
      return state.groupsHeader;
    }
  }
};
export default groups;
