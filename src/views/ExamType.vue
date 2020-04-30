<template>
    <div>
        <Loading v-if="loading"/>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <card>
                <slot name="header">
                    <p>Sınav Türü Ekle</p>
                </slot>
                <div class="row">
                    <div class="col-md-9">
                        <base-input placeholder="Sınav Tür Adı Giriniz" v-model="examtypeData.name"></base-input>
                    </div>
                    <div class="col-md-3">
                        <base-button outline type="success" v-if="!updateMode" @click="createExamType">Ekle
                        </base-button>
                        <base-button outline type="warning" v-if="updateMode" @click="updateExamType">Güncelle
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
                    <p>Sınav Türü Listesi</p>
                </slot>
                <div class="row">
                    <div class="col">
                        <v-table
                                :detailVisible="false"
                                :edit-visible="true"
                                :del-visible="true"
                                @edClick="editClick($event)"
                                @delClick="deleteClick($event)"
                                :columns="$store.getters.getExamTypeHeader"
                                :rows="$store.getters.getExamType"
                                :table-title="$store.getters.getExamTypeHeader"
                        ></v-table>
                    </div>
                </div>
            </card>
        </div>


    </div>
</template>
<script>
    import VTable from "@/components/Table"
    import Loading from "@/components/Loading";
    import Swal from "sweetalert2"
    import appPlugin from "../plugins/appPlugin";

    export default {
        name: 'ExamType',
        created() {
            this.loading = true

            this.$store.dispatch("fetchExamType").then((res) => {
                this.loading = false
            }).catch((err) => {
                appPlugin.showalert("Uyarı", "Sınav Türü Kayıtları Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")
                this.loading = false

            })
        },
        data() {
            return {
                examtypeData: {
                    id: "",
                    name: ""
                },
                updateMode: false,
                loading: false
            }
        },
        methods: {
            resetData() {
                this.examtypeData.name = ""
                this.examtypeData.id = ""
            },
            updateExamType() {
                if (this.examtypeData.name.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Sınav Tür Adı Giriniz", "info", "Tamam")
                } else {
                    this.loading = true
                    this.$store.dispatch("updateExamType", {
                        name: this.examtypeData.name,
                        id: this.examtypeData.id
                    }).then((res) => {
                        if (res.status === 200) {
                            this.loading = false
                            this.updateMode = false
                            this.resetData()
                            appPlugin.showalert("Bilgilendirme", "Sınav Türü Güncelleme İşlemi Başarılı", "success", "Tamam")
                        } else if (res.status == 204) {
                            this.loading = false
                            appPlugin.showalert("Uyarı", "Sınav Türü Daha Önce Eklendi", "warning", "Tamam")
                        }
                    }).catch((err) => {
                        this.loading = false
                        appPlugin.showalert("Uyarı", "Sınav Türü Güncellenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")
                    })
                }
            },
            createExamType() {
                if (this.examtypeData.name.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Sınav Tür Adı Giriniz", "info", "Tamam")
                } else {
                    this.loading = true
                    this.$store.dispatch("createExamType", {name: this.examtypeData.name}).then((res) => {
                        if (res.status === 200) {
                            this.loading = false
                            this.resetData()
                            appPlugin.showalert("Bilgilendirme", " Sınav Türü Ekleme İşlemi Başarılı", "success", "Tamam")
                        } else if (res.status == 204) {
                            this.loading = false
                            appPlugin.showalert("Uyarı", " Sınav Türü Daha Önce Eklendi", "warning", "Tamam")
                        }
                    }).catch((err) => {
                        this.loading = false
                        appPlugin.showalert("Uyarı", "  Sınav Türü Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")

                    })
                }
            },
            onCancelUpdate() {
                this.updateMode = false;
                this.resetData()
            },
            editClick(row) {
                this.updateMode = true;
                this.examtypeData.name = row.item.name
                this.examtypeData.id = row.item.id
            },
            deleteClick(row) {
                Swal.fire({
                    title: "Uyarı",
                    text: row.item.name + " " + "Kaydını Silmek İstediğinize Emin Misiniz ? Bu İşlem Geri Alınamaz",
                    confirmButtonText: "Evet",
                    icon: 'info',
                    confirmButtonColor: 'red',
                    cancelButtonText: "Hayır",
                    showCancelButton: true
                }).then(res => {
                    if (res.value) {
                        this.loading = true
                        this.$store
                            .dispatch('deleteExamType', {
                                deleted: row.item,
                                index: row.i
                            })
                            .then(res => {
                                if (res.status) {
                                    if (res.status === 200) {
                                        appPlugin.showalert("Bilgilendirme", " Sınav Türü Silme İşlemi Başarılı", "success", "Tamam")

                                    }
                                } else {
                                    appPlugin.showalert("Uyarı", " Sınav Türü Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")

                                }
                                this.loading = false
                            })
                    }
                })
            }
        },
        components: {
            VTable,
            Loading
        }
    };
</script>
<style></style>
