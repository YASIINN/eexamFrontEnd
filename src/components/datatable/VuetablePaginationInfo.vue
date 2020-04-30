<template>
  <div
    class="dataTables_info"
    id="datatable-buttons_info"
    role="status"
    aria-live="polite"
    v-html="paginationInfo"
  ></div>
</template>

<script>
import PaginationInfoMixin from "./VuetablePaginationInfoMixin.vue";

export default {
  mixins: [PaginationInfoMixin]
};
</script>
