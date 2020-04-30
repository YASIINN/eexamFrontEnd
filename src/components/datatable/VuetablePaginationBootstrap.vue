<template>
  <ul class="pagination">
    <li
      id="datatable-buttons_previous"
      :class="{ disabled: isOnFirstPage }"
      class="paginate_button page-item previous "
    >
      <a
        href=""
        style="cursor:pointer"
        aria-controls="datatable-buttons"
        class="page-link"
        @click.prevent="loadPage('prev')"
      >
        <i class="fas fa-angle-left"> </i>
      </a>
    </li>

    <template v-if="notEnoughPages">
      <li
        v-for="n in totalPage"
        :class="{ active: isCurrentPage(n) }"
        class="paginate_button page-item "
      >
        <a
          style="cursor:pointer"
          @click.prevent="loadPage(n)"
          class="page-link"
          aria-controls="datatable-buttons"
          v-html="n"
        ></a>
      </li>
    </template>
    <template v-else>
      <li
        class="paginate_button page-item "
        v-for="n in windowSize"
        :class="{ active: isCurrentPage(windowStart + n - 1) }"
      >
        <a
          style="cursor:pointer"
          class="page-link"
          aria-controls="datatable-buttons"
          @click.prevent="loadPage(windowStart + n - 1)"
          v-html="windowStart + n - 1"
        ></a>
      </li>
    </template>

    <li
      :class="{ disabled: isOnLastPage }"
      class="paginate_button page-item next "
      id="datatable-buttons_next"
    >
      <a
        style="cursor:pointer"
        href=""
        class="page-link"
        @click.prevent="loadPage('next')"
        aria-controls="datatable-buttons"
      >
        <i class="fas fa-angle-right"></i>
      </a>
    </li>
  </ul>
</template>

<script>
import VuetablePaginationMixin from "vuetable-2/src/components/VuetablePaginationMixin";
export default {
  mixins: [VuetablePaginationMixin]
};
</script>
