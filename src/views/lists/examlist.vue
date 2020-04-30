<template>
  <div>
    <Loading v-if="loading"></Loading>
    <div class="table-responsive">
      <vuetable
              ref="vuetable"
              :append-params="moreParams"
              :fields="fields"
              :http-fetch="onFetchApi"
              pagination-path
              :per-page="5"
              @vuetable:load-success="onSuccess"
              @vuetable:pagination-data="onPaginationData"
              @vuetable:loading="onLoading"
              @vuetable:loaded="onLoaded"
      >
        <template slot="actions" scope="props">
          <div class="custom-actions">
            <div v-if="search == 1" class="custom-actions">
              <base-button outline type="primary" size="sm" @click="detail(props.rowData)">Detay
              </base-button>
            </div>
            <div v-if="search == 0" class="custom-actions">
              <base-button outline type="primary" size="sm" @click="edit(props.rowData)">Düzenle
              </base-button>
              <base-button outline type="danger" size="sm" @click="deleteExam(props.rowData)">Sil</base-button>
            </div>
          </div>
        </template>

      </vuetable>
      <vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
      <div class="dataTables_paginate paging_simple_numbers float-right">
        <vuetable-pagination-bootstrap
                class="float-right"
                ref="pagination"
                @vuetable-pagination:change-page="onChangePage"
        ></vuetable-pagination-bootstrap>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
import appPlugin from "@/plugins/appPlugin";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "@/components/datatable/VuetablePaginationBootstrap";
import VuetablePaginationInfo from "@/components/datatable/VuetablePaginationInfo";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({ studentmodel: "studentmodel", getLang: "getLang" }),
    getLang: {
      get: function() {
        return this.$store.getters.getTitleHeader;
      }
    }
  },
  name: "index",
  props: ["search", "assign"],
  components: {
    Loading,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo
  },
  watch: {
    "search"() {
      this.query.detailSearch = this.search;
      this.$nextTick(function() {
        this.$refs.vuetable.refresh();
      });
    }
  },
  data() {
    return {
      fields: [
        {
          name: "__sequence",
          title: "#",
          titleClass: "center aligned",
          dataClass: "right aligned"
        },
        {
          name: "examtype.name",
          title: '<i class="fas fa-lightbulb"></i>Sınav Türü '
        },
        {
          name: "school.code",
          title: '<i class="fas fa-graduation-cap"></i>Okul'
        },
        {
          name: "class.name",
          title: '<i class="fas fa-building"></i>Sınıf'
        },
        {
          name: "branch.name",
          title: '<i class="fas fa-building"></i>Şube'
        },
        {
          name: "lesson.name",
          title: '<i class="fas fa-building"></i>Ders'
        },
        {
          name: "examDate",
          title: '<i class="fas fa-building"></i>Sınav T.'
        },
        {
          name: "beginHour",
          title: '<i class="fas fa-building"></i>Baş'
        },
        {
          name: "endHour",
          title: '<i class="fas fa-building"></i>Bitiş'
        },
        {
          name: "qCount",
          title: '<i class="fas fa-building"></i>Soru S.'
        },
        {
          name: "optCount",
          title: '<i class="fas fa-building"></i>Seç S.'
        },
        {
          name: "__slot:actions",
          title: '<i class="fas fa-graduation-cap"></i>İşlemler'
        }
      ],
      currentData: [],
      moreParams: {},
      txt: "",
      query: {
        detailSearch: 1
      },
      loading: false,
      dataselected: false,
      titleData: {
        name: "",
        code: ""
      },
      selectedData: {}
    };
  },
  created() {},
  methods: {
    edit(data){
      this.$emit("getExam", data, "edit", this.$refs);
    },
    detail(data) {
      this.$emit("getExam", data, "detail");
    },
    deleteExam(data){
      appPlugin.showConfirm("Bu işlemi onaylarsanız, sınavı ve ilişkili verilerini kaybedeceksiniz. Yine de onaylıyor musunuz ?").then(async res=>{
        if(res.value){
          this.$emit("getExam", data, "delete", this.$refs);
        }
      })
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
      this.$refs.paginationInfo.setPaginationData(paginationData);
    },
    onLoading() {
      this.loading = true;
    },
    onLoaded() {
      this.loading = false;
    },
    onSearchHandler(txt) {
      this.txt = txt;
      this.$nextTick(function() {
        this.$refs.vuetable.refresh();
      });
    },
    onResetData() {},
    onError() {
      this.loading = false;
    },
    onSuccess() {
      /* succesFetchDataApi */
    },
    async onFetchApi(apiUrl, httpOptions) {
      var data;
      data = this.$store.dispatch("fetchExams", {
        httpOpt: httpOptions,
        ...this.query
      });
      return data;
    }
  }
};
</script>

<style scoped></style>
