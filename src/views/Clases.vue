<template>
    <div>
        <Loading v-if="loading"/>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <card>
                <slot name="header">
                    <p>Sınıf Ekle</p>
                </slot>
                <div class="row">
                    <div class="col-md-3">
                        <base-input placeholder="Sınıf Kodu Giriniz" v-model="clasesData.code"></base-input>
                    </div>
                    <div class="col-md-6">
                        <base-input placeholder="Sınıf Adı Giriniz" v-model="clasesData.name"></base-input>
                    </div>
                    <div class="col-md-3">
                        <base-button outline type="success" v-if="!updateMode" @click="createClases">Ekle</base-button>
                        <base-button outline type="warning" v-if="updateMode" @click="updateClases">Güncelle
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
                                :columns="$store.getters.getClasesHeader"
                                :rows="$store.getters.getClases"
                                :table-title="$store.getters.getClasesHeader"
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
        name: "Clases",
        created() {
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
        data() {
            return {
                clasesData: {
                    id: "",
                    name: "",
                    code: ""
                },
                updateMode: false,
                loading: false
            };
        },
        methods: {
            resetData() {
                this.clasesData.name = "";
                this.clasesData.id = "";
                this.clasesData.code = ""
            },
            updateClases() {
                if (this.clasesData.name.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Sınıf Adı Giriniz",
                        "info",
                        "Tamam"
                    );
                } else if (this.clasesData.code.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Sınıf Kodu Giriniz",
                        "info",
                        "Tamam"
                    );
                } else {
                    this.loading = true;
                    this.$store
                        .dispatch("updateClases", {
                            name: this.clasesData.name,
                            id: this.clasesData.id,
                            code: this.clasesData.code
                        })
                        .then(res => {
                            if (res.status === 200) {
                                this.loading = false;
                                this.updateMode = false;
                                this.resetData();
                                appPlugin.showalert(
                                    "Bilgilendirme",
                                    "Sınıf Güncelleme İşlemi Başarılı",
                                    "success",
                                    "Tamam"
                                );
                            } else if (res.status == 204) {
                                this.loading = false;
                                appPlugin.showalert(
                                    "Uyarı",
                                    "Sınıf Adı veya Sınıf Kodu Daha Önce Eklendi",
                                    "warning",
                                    "Tamam"
                                );
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            appPlugin.showalert(
                                "Uyarı",
                                "Sınıf Güncellenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                                "error",
                                "Tamam"
                            );
                        });
                }
            },
            createClases() {
                if (this.clasesData.name.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Sınıf Adı Giriniz",
                        "info",
                        "Tamam"
                    );
                } else if (this.clasesData.code.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Sınıf Kodu Giriniz",
                        "info",
                        "Tamam"
                    )
                } else {
                    this.loading = true;
                    this.$store
                        .dispatch("createClases", {name: this.clasesData.name, code: this.clasesData.code})
                        .then(res => {
                            if (res.status === 200) {
                                this.loading = false;
                                this.resetData();
                                appPlugin.showalert(
                                    "Bilgilendirme",
                                    "Sınıf Ekleme İşlemi Başarılı",
                                    "success",
                                    "Tamam"
                                );
                            } else if (res.status == 204) {
                                this.loading = false;
                                appPlugin.showalert(
                                    "Uyarı",
                                    "Sınıf Adı veya Sınıf Kodu Daha Önce Eklendi",
                                    "warning",
                                    "Tamam"
                                );
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            appPlugin.showalert(
                                "Uyarı",
                                "Sınıf Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
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
                this.clasesData.name = row.item.name;
                this.clasesData.id = row.item.id;
                this.clasesData.code = row.item.code;
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
                            .dispatch("deleteClases", {
                                deleted: row.item,
                                index: row.i
                            })
                            .then(res => {
                                if (res.status) {
                                    if (res.status === 200) {
                                        appPlugin.showalert(
                                            "Bilgilendirme",
                                            "Sınıf Silme İşlemi Başarılı",
                                            "success",
                                            "Tamam"
                                        );
                                    }
                                } else {
                                    appPlugin.showalert(
                                        "Uyarı",
                                        "Sınıf Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
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
