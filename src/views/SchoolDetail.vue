<template>
  <div>
    <Loading v-if="loading" />
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <card>
        <slot name="header">
          <p>Okul'a Sınıf ve Şube Ekle</p>
        </slot>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <multiselect
                      v-model="selectedClass"
                      track-by="name"
                      :allow-empty="false"
                      label="name"
                      selectedLabel="Seçili"
                      selectLabel="Seç"
                      :hide-selected="false"
                      :multiple="false"
                      deselectLabel
                      :options="$store.getters.getClases"
                      :searchable="true"
                      :close-on-select="true"
                      :show-labels="true"
                      placeholder="Sınıf Seçiniz"
              ></multiselect>
            </div>
            <div class="form-group">
              <multiselect
                      v-model="selectedBranch"
                      track-by="name"
                      :allow-empty="false"
                      label="name"
                      selectedLabel="Seçili"
                      selectLabel="Seç"
                      :hide-selected="false"
                      :multiple="true"
                      deselectLabel
                      :options="$store.getters.getBranches"
                      :searchable="true"
                      :close-on-select="false"
                      :show-labels="true"
                      placeholder="Şube Seçiniz"
              ></multiselect>
            </div>
            <div class="form-group">
              <base-button outline type="success" class="float-right" @click="onValidate">Ekle</base-button>
            </div>
          </div>
        </div>
      </card>
    </base-header>
    <div class="container-fluid mt&#45;&#45;7">
      <card>
        <div class="row">
          <div class="col">
            <tabs fill class="flex-column flex-md-row">
              <card shadow>
                <tab-pane>
                  <span slot="title">
                    <i class="ni ni-cloud-upload-96" />
                    Okul Sınıf ve Şube Listesi
                  </span>
                  <v-table
                          :detailVisible="false"
                          :edit-visible="false"
                          :del-visible="true"
                          @delClick="deleteClick($event)"
                          :columns="$store.getters.getSchoolClassBrancHeader"
                          :rows="$store.getters.getSchoolClassBranch"
                          :table-title="$store.getters.getSchoolClassBrancHeader"
                  ></v-table>
                </tab-pane>
              </card>
            </tabs>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
  import appPlugin from "../plugins/appPlugin";
  import VTable from "@/components/Table";
  import Loading from "@/components/Loading";
  import Multiselect from "vue-multiselect";
  import Swal from "sweetalert2";

  export default {
    components: {
      VTable,
      Loading,
      Multiselect
    },
    created() {
      this.fetchSCB();
      this.fetchClas();
      this.fetchBranch();
    },
    data() {
      return {
        selectedBranch: "",
        selectedClass: "",
        loading: false
      };
    },
    methods: {
      deleteClick(row) {
        Swal.fire({
          title: "Uyarı",
          text:
                  row.item.schoolname +
                  " " +
                  row.item.classname +
                  " " +
                  " " +
                  row.item.branchname +
                  " " +
                  "Kaydını Silmek İstediğinize Emin Misiniz ? Bu İşlem Geri Alınamaz",
          confirmButtonText: "Evet",
          icon: "info",
          confirmButtonColor: "red",
          cancelButtonText: "Hayır",
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.loading = true;
            this.$store
                    .dispatch("deleteSchoolClassBranch", {
                      schoolid: this.$route.params.id,
                      branchid: row.item.branchid,
                      classid: row.item.classid,
                      index: row.i
                    })
                    .then(res => {
                      if (res.status) {
                        if (res.status === 200) {
                          appPlugin.showalert(
                                  "Bilgilendirme",
                                  "Okula Ait Sınıf Ve Şube Silme İşlemi Başarılı",
                                  "success",
                                  "Tamam"
                          );
                        }
                      } else {
                        appPlugin.showalert(
                                "Uyarı",
                                "Okula Ait Sınıf Ve Şube Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                                "error",
                                "Tamam"
                        );
                      }
                      this.loading = false;
                    });
          }
        });
      },
      onValidate() {
        if (this.selectedClass == "") {
          appPlugin.showalert("Uyarı", "Lütfen Sınıf Seçiniz", "info", "Tamam");
        } else if (this.selectedBranch == "") {
          appPlugin.showalert("Uyarı", "Lütfen Şube Seçiniz", "info", "Tamam");
        } else {
          this.onCreateSCB();
        }
      },
      onCreateSCB() {
        let data = [];
        this.selectedBranch.forEach(item => {
          data.push({
            schoolid: this.$route.params.id,
            classid: this.selectedClass.id,
            branchid: item.id
          });
        });
        this.loading = true;
        this.$store
                .dispatch("createSchoolClassBranch", { scblist: data })
                .then(res => {
                  this.loading = false;
                  if (res.status === 200) {
                    appPlugin.showalert(
                            "Bilgilendirme",
                            "Okula Sınıf Ve Şube Ataması Başarıyla Gerçekleşti",
                            "success",
                            "Tamam"
                    );
                    this.fetchSCB();
                  }
                })
                .catch(err => {
                  this.loading = false;
                  appPlugin.showalert(
                          "Uyarı",
                          "Okula Sınıf Ve Şube Ataması Gerçekleştirilirken Hata Gerçeklelti",
                          "error",
                          "Tamam"
                  );
                });
      },
      fetchClas() {
        this.loading = true;

        this.$store
                .dispatch("fetchClases")
                .then(res => {
                  this.loading = false;
                })
                .catch(err => {
                  appPlugin.showalert(
                          "Uyarı",
                          "Sınıf Kayıtları Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                          "error",
                          "Tamam"
                  );
                  this.loading = false;
                });
      },
      fetchBranch() {
        this.loading = true;

        this.$store
                .dispatch("fetchBranches")
                .then(res => {
                  this.loading = false;
                })
                .catch(err => {
                  appPlugin.showalert(
                          "Uyarı",
                          "Şube Kayıtları Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                          "error",
                          "Tamam"
                  );
                  this.loading = false;
                });
      },
      fetchSCB() {
        debugger;
        this.loading = true;
        this.$store
                .dispatch("fetchSchoolClassBranch", { schoolid: this.$route.params.id })
                .then(res => {
                  this.loading = false;
                  /*        if (res.status == 204) {
                    this.$router.replace("/schools");
                  }*/
                })
                .catch(err => {
                  this.loading = false;
                  appPlugin.showalert(
                          "Uyarı",
                          "Okula Ait Sınıf ve Şubeler Getirilirken Hata Gerçekleşti",
                          "error",
                          "Tamam"
                  );
                });
      }
    },
    name: "SchoolDetail"
  };
</script>

<style scoped></style>