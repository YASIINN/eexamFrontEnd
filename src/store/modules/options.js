import axios from "axios";

const options = {
  state: {
    optionList: [],
    optionsHeader: [
      {
        name: "Seçenek Adı",
        display: "name"
      },
      {
        name: "",
        display: ""
      }
    ]
  },
  mutations: {
    setOptions(state, data) {
      state.optionList = data;
    }
  },
  actions: {
    updateOptionss({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/options/" + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.optionList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.optionList[i].name = response.data.name;
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
    deleteOptions({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/options/" + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              state.optionList.splice(data.index, 1);
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },

        fetchOptions({commit}) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .get("/options")
                    .then(res => {
                        commit("setOptions", res.data);
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },

        createOptions({commit, state, dispatch}, data) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/options", data)
                    .then(response => {
                        if (response.status === 200) {
                            state.optionList = [...state.optionList, response.data];
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
    getOptions(state) {
      return state.optionList;
    },
    getOptionsHeader(state) {
      return state.optionsHeader;
    }
  }
};
export default options;
