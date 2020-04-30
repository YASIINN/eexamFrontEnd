<template>
    <div>
        <Loading v-if="loading"/>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <card>
                <slot name="header">
                    <p>Seçenek Ekle</p>
                </slot>
                <div class="row">
                    <div class="col-md-9">
                        <base-input placeholder="Seçenek Adı Giriniz" v-model="optionsData.name"></base-input>
                    </div>
                    <div class="col-md-3">
                        <base-button outline type="success" v-if="!updateMode" @click="createOptions">Ekle</base-button>
                        <base-button outline type="warning" v-if="updateMode" @click="updateOptions">Güncelle
                        </base-button>
                        <base-button outline type="danger" v-if="updateMode" @click="onCancelUpdate">Vazgeç
                        </base-button>
                    </div>
                </div>
            </card>
        </base-header>

        <div class="container-fluid mt--7">
            <card>
                <slot name="header">
                    <p>Seçenek Listesi</p>
                </slot>
                <div class="row">
                    <div class="col">
                        <v-table
                                :detailVisible="false"
                                :edit-visible="true"
                                :del-visible="true"
                                @edClick="editClick($event)"
                                @delClick="deleteClick($event)"
                                :columns="$store.getters.getOptionsHeader"
                                :rows="$store.getters.getOptions"
                                :table-title="$store.getters.getOptionsHeader"
                        ></v-table>
                    </div>
                </div>
            </card>
        </div>
    </div>
</template>
<script>
    import VTable from "@/components/Table";
    import Loading from "@/components/Loading";
    import Swal from "sweetalert2";
    import appPlugin from "../plugins/appPlugin";

    export default {
        name: "Options",
        created() {
            this.loading = true;

            this.$store
                .dispatch("fetchOptions")
                .then(res => {
                    this.loading = false;
                })
                .catch(err => {
                    appPlugin.showalert(
                        "Uyarı",
                        "Seçenek Kayıtları Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                        "error",
                        "Tamam"
                    );
                    this.loading = false;
                });
        },
        data() {
            return {
                optionsData: {
                    id: "",
                    name: ""
                },
                updateMode: false,
                loading: false
            };
        },
        methods: {
            resetData() {
                this.optionsData.name = "";
                this.optionsData.id = "";
            },
            updateOptions() {
                if (this.optionsData.name.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Seçenek Adı Giriniz",
                        "info",
                        "Tamam"
                    );
                } else {
                    this.loading = true;
                    this.$store
                        .dispatch("updateOptionss", {
                            name: this.optionsData.name,
                            id: this.optionsData.id
                        })
                        .then(res => {
                            if (res.status === 200) {
                                this.loading = false;
                                this.updateMode = false;
                                this.resetData();
                                appPlugin.showalert(
                                    "Bilgilendirme",
                                    "Seçenek Güncelleme İşlemi Başarılı",
                                    "success",
                                    "Tamam"
                                );
                            } else if (res.status == 204) {
                                this.loading = false;
                                appPlugin.showalert(
                                    "Uyarı",
                                    "Seçenek Daha Önce Eklendi",
                                    "warning",
                                    "Tamam"
                                );
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            appPlugin.showalert(
                                "Uyarı",
                                "Seçenek Güncellenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                                "error",
                                "Tamam"
                            );
                        });
                }
            },
            createOptions() {
                if (this.optionsData.name.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Seçenek Adı Giriniz",
                        "info",
                        "Tamam"
                    );
                } else {
                    this.loading = true;
                    this.$store
                        .dispatch("createOptions", {name: this.optionsData.name})
                        .then(res => {
                            if (res.status === 200) {
                                this.loading = false;
                                this.resetData();
                                appPlugin.showalert(
                                    "Bilgilendirme",
                                    "Seçenek Ekleme İşlemi Başarılı",
                                    "success",
                                    "Tamam"
                                );
                            } else if (res.status == 204) {
                                this.loading = false;
                                appPlugin.showalert(
                                    "Uyarı",
                                    "Seçenek Daha Önce Eklendi",
                                    "warning",
                                    "Tamam"
                                );
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            appPlugin.showalert(
                                "Uyarı",
                                "Seçenek Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                                "error",
                                "Tamam"
                            );
                        });
                }
            },
            onCancelUpdate() {
                this.updateMode = false;
                this.resetData();
            },
            editClick(row) {
                this.updateMode = true;
                this.optionsData.name = row.item.name;
                this.optionsData.id = row.item.id;
            },
            deleteClick(row) {
                Swal.fire({
                    title: "Uyarı",
                    text:
                        row.item.name +
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
                            .dispatch("deleteOptions", {
                                deleted: row.item,
                                index: row.i
                            })
                            .then(res => {
                                if (res.status) {
                                    if (res.status === 200) {
                                        appPlugin.showalert(
                                            "Bilgilendirme",
                                            "Seçenek Silme İşlemi Başarılı",
                                            "success",
                                            "Tamam"
                                        );
                                    }
                                } else {
                                    appPlugin.showalert(
                                        "Uyarı",
                                        "Seçenek Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                                        "error",
                                        "Tamam"
                                    );
                                }
                                this.loading = false;
                            });
                    }
                });
            }
        },
        components: {
            VTable,
            Loading
        }
    };
</script>
<style></style>
