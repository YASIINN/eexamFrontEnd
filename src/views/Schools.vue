<template>
    <div>
        <Loading v-if="loading"/>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <card>
                <slot name="header">
                    <p>Okul Ekle</p>
                </slot>
                <div class="row">
                    <div class="col-md-3">
                        <base-input placeholder="Okul Kodu Giriniz" v-model="schoolData.code"></base-input>
                    </div>
                    <div class="col-md-6">
                        <base-input placeholder="Okul Adı Giriniz" v-model="schoolData.name"></base-input>
                    </div>
                    <div class="col-md-3">
                        <base-button outline type="success" v-if="!updateMode" @click="createSchools">Ekle</base-button>
                        <base-button outline type="warning" v-if="updateMode" @click="updateSchools">Güncelle
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
                    <p>Okul Listesi</p>
                </slot>
                <div class="row">
                    <div class="col">

                        <v-table
                                :detailVisible="true"
                                :edit-visible="true"
                                :del-visible="true"
                                @detClick="detailClick($event)"
                                @edClick="editClick($event)"
                                @delClick="deleteClick($event)"
                                :columns="$store.getters.getSchoolHeader"
                                :rows="$store.getters.getSchools"
                                :table-title="$store.getters.getSchoolHeader"
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

    import Vuetable from 'vuetable-2'

    export default {
        name: "Schools",
        created() {
            this.loading = true;

            this.$store
                .dispatch("fetchSchools")
                .then(res => {
                    this.loading = false;
                })
                .catch(err => {
                    appPlugin.showalert(
                        "Uyarı",
                        "Okul Kayıtları Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                        "error",
                        "Tamam"
                    );
                    this.loading = false;
                });
        },
        data() {
            return {
                schoolData: {
                    id: "",
                    name: "",
                    code: ""
                },
                updateMode: false,
                loading: false
            };
        },
        methods: {
            detailClick(data) {
                this.$router.push("/schooldetail/" + data.item.id)
            },
            resetData() {
                this.schoolData.name = "";
                this.schoolData.id = "";
                this.schoolData.code = ""
            },
            updateSchools() {
                if (this.schoolData.name.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Okul Adı Giriniz",
                        "info",
                        "Tamam"
                    );
                } else if (this.schoolData.code.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Okul Kodu Giriniz",
                        "info",
                        "Tamam"
                    );
                } else {
                    this.loading = true;
                    this.$store
                        .dispatch("updateSchools", {
                            name: this.schoolData.name,
                            id: this.schoolData.id,
                            code: this.schoolData.code
                        })
                        .then(res => {
                            if (res.status === 200) {
                                this.loading = false;
                                this.updateMode = false;
                                this.resetData();
                                appPlugin.showalert(
                                    "Bilgilendirme",
                                    "Okul Güncelleme İşlemi Başarılı",
                                    "success",
                                    "Tamam"
                                );
                            } else if (res.status == 204) {
                                this.loading = false;
                                appPlugin.showalert(
                                    "Uyarı",
                                    "Okul Adı veya Okul Kodu Daha Önce Eklendi",
                                    "warning",
                                    "Tamam"
                                );
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            appPlugin.showalert(
                                "Uyarı",
                                "Okul Güncellenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                                "error",
                                "Tamam"
                            );
                        });
                }
            },
            createSchools() {
                if (this.schoolData.name.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Okul Adı Giriniz",
                        "info",
                        "Tamam"
                    );
                } else if (this.schoolData.code.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Okul Kodu Giriniz",
                        "info",
                        "Tamam"
                    )
                } else {
                    this.loading = true;
                    this.$store
                        .dispatch("createSchools", {name: this.schoolData.name, code: this.schoolData.code})
                        .then(res => {
                            if (res.status === 200) {
                                this.loading = false;
                                this.resetData();
                                appPlugin.showalert(
                                    "Bilgilendirme",
                                    "Okul Ekleme İşlemi Başarılı",
                                    "success",
                                    "Tamam"
                                );
                            } else if (res.status == 204) {
                                this.loading = false;
                                appPlugin.showalert(
                                    "Uyarı",
                                    "Okul Adı veya Okul Kodu Daha Önce Eklendi",
                                    "warning",
                                    "Tamam"
                                );
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            appPlugin.showalert(
                                "Uyarı",
                                "Okul Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
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
                this.schoolData.name = row.item.name;
                this.schoolData.id = row.item.id;
                this.schoolData.code = row.item.code;
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
                            .dispatch("deleteSchools", {
                                deleted: row.item,
                                index: row.i
                            })
                            .then(res => {
                                if (res.status) {
                                    if (res.status === 200) {
                                        appPlugin.showalert(
                                            "Bilgilendirme",
                                            "Okul Silme İşlemi Başarılı",
                                            "success",
                                            "Tamam"
                                        );
                                    }
                                } else {
                                    appPlugin.showalert(
                                        "Uyarı",
                                        "Okul Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
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
            Vuetable,
            Loading
        }
    };
</script>
<style></style>
