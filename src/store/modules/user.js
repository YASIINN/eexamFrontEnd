import axios from "axios";
import store from "@/store";
export default {
  state: {},
  mutations: {},
  actions: {
    async userImport({ commit }, formData) {
      let result = 0;
      try {
        const response = await axios.post("/user/import", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (response.status === 200) {
          result = 1;
          store.commit("setSucMessage", "Veri başarıyla import edildi.");
        } else {
          store.commit("setErrMessage", response.data.message);
        }
      } catch (e) {
        store.commit(
          "setErrMessage",
          "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz."
        );
      }
      return result;
    }
  },
  getters: {}
};
