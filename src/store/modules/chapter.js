import axios from "axios";

const chapter = {
  state: {
    chapterList: [],
    chapterHeader: [
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
    setChapter(state, data) {
      state.chapterList = data;
    }
  },
  actions: {
    updateChapters({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/chapter/" + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.chapterList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.chapterList[i].name = response.data.name;
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
    deleteChapter({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/chapter/" + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              state.chapterList.splice(data.index, 1);
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },

        fetchChapter({commit}) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .get("/chapter")
                    .then(res => {
                        commit("setChapter", res.data);
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    });
            });
            return deferred;
        },

        createChapter({commit, state, dispatch}, data) {
            let deferred = new Promise((resolve, reject) => {
                axios
                    .post("/chapter", data)
                    .then(response => {
                        if (response.status === 200) {
                            state.chapterList = [...state.chapterList, response.data];
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
    getChapter(state) {
      return state.chapterList;
    },
    getChapterHeader(state) {
      return state.chapterHeader;
    }
  }
};
export default chapter;
