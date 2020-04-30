import Vuetable from "./components/datatable/Vuetable.vue";
import VuetablePagination from "./components/datatable/VuetablePagination.vue";
import VuetablePaginationDropDown from "./components/datatable/VuetablePaginationDropdown.vue";
import VuetablePaginationInfo from "./components/datatable/VuetablePaginationInfo.vue";
import VuetablePaginationMixin from "./components/datatable/VuetablePaginationMixin.vue";
import VuetablePaginationInfoMixin from "./components/datatable/VuetablePaginationInfoMixin.vue";
import Promise from "promise-polyfill";
if (!window.Promise) {
    window.Promise = Promise;
}

function install(Vue) {
    Vue.component("vuetable", Vuetable);
    Vue.component("vuetable-pagination", VuetablePagination);
    Vue.component("vuetable-pagination-dropdown", VuetablePaginationDropDown);
    Vue.component("vuetable-pagination-info", VuetablePaginationInfo);
}
export {
    Vuetable,
    VuetablePagination,
    VuetablePaginationDropDown,
    VuetablePaginationInfo,
    VuetablePaginationMixin,
    VuetablePaginationInfoMixin,
    install
};

export default Vuetable;
