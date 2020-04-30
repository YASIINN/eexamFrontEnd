<template>
    <div>
        <Loading v-if="loading"/>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <card>
                <slot name="header">
                    <p>Şube Ekle</p>
                </slot>
                <div class="row">
                    <div class="col-md-3">
                        <base-input placeholder="Şube Kodu Giriniz" v-model="branchesData.code"></base-input>
                    </div>
                    <div class="col-md-6">
                        <base-input placeholder="Şube Adı Giriniz" v-model="branchesData.name"></base-input>
                    </div>
                    <div class="col-md-3">
                        <base-button outline type="success" v-if="!updateMode" @click="createBranches">Ekle</base-button>
                        <base-button outline type="warning" v-if="updateMode" @click="updateBranches">Güncelle
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
                    <p>Şube Listesi</p>
                </slot>
                <div class="row">
                    <div class="col">
                        <v-table
                                :detailVisible="false"
                                :edit-visible="true"
                                :del-visible="true"
                                @edClick="editClick($event)"
                                @delClick="deleteClick($event)"
                                :columns="$store.getters.getBranchesHeader"
                                :rows="$store.getters.getBranches"
                                :table-title="$store.getters.getBranchesHeader"
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
        name: "Branches",
        created() {
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
        data() {
            return {
                branchesData: {
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
                this.branchesData.name = "";
                this.branchesData.id = "";
                this.branchesData.code = ""
            },
            updateBranches() {
                if (this.branchesData.name.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Şube Adı Giriniz",
                        "info",
                        "Tamam"
                    );
                } else if (this.branchesData.code.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Şube Kodu Giriniz",
                        "info",
                        "Tamam"
                    );
                } else {
                    this.loading = true;
                    this.$store
                        .dispatch("updateBranches", {
                            name: this.branchesData.name,
                            id: this.branchesData.id,
                            code: this.branchesData.code
                        })
                        .then(res => {
                            if (res.status === 200) {
                                this.loading = false;
                                this.updateMode = false;
                                this.resetData();
                                appPlugin.showalert(
                                    "Bilgilendirme",
                                    "Şube Güncelleme İşlemi Başarılı",
                                    "success",
                                    "Tamam"
                                );
                            } else if (res.status == 204) {
                                this.loading = false;
                                appPlugin.showalert(
                                    "Uyarı",
                                    "Şube Adı veya Şube Kodu Daha Önce Eklendi",
                                    "warning",
                                    "Tamam"
                                );
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            appPlugin.showalert(
                                "Uyarı",
                                "Şube Güncellenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                                "error",
                                "Tamam"
                            );
                        });
                }
            },
            createBranches() {
                if (this.branchesData.name.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Şube Adı Giriniz",
                        "info",
                        "Tamam"
                    );
                } else if (this.branchesData.code.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Şube Kodu Giriniz",
                        "info",
                        "Tamam"
                    )
                } else {
                    this.loading = true;
                    this.$store
                        .dispatch("createBranches", {name: this.branchesData.name, code: this.branchesData.code})
                        .then(res => {
                            if (res.status === 200) {
                                this.loading = false;
                                this.resetData();
                                appPlugin.showalert(
                                    "Bilgilendirme",
                                    "Şube Ekleme İşlemi Başarılı",
                                    "success",
                                    "Tamam"
                                );
                            } else if (res.status == 204) {
                                this.loading = false;
                                appPlugin.showalert(
                                    "Uyarı",
                                    "Şube Adı veya Şube Kodu Daha Önce Eklendi",
                                    "warning",
                                    "Tamam"
                                );
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            appPlugin.showalert(
                                "Uyarı",
                                "Şube Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
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
                this.branchesData.name = row.item.name;
                this.branchesData.id = row.item.id;
                this.branchesData.code = row.item.code;
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
                            .dispatch("deleteBranches", {
                                deleted: row.item,
                                index: row.i
                            })
                            .then(res => {
                                if (res.status) {
                                    if (res.status === 200) {
                                        appPlugin.showalert(
                                            "Bilgilendirme",
                                            "Şube Silme İşlemi Başarılı",
                                            "success",
                                            "Tamam"
                                        );
                                    }
                                } else {
                                    appPlugin.showalert(
                                        "Uyarı",
                                        "Şube Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
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
