<template>
    <div>
        <Loading v-if="loading"/>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <card>
                <slot name="header">
                    <p>Sınav Bölümü Ekle</p>
                </slot>
                <div class="row">
                    <div class="col-md-9">
                        <base-input placeholder="Sınav Bölüm Adı Giriniz" v-model="chapterData.name"></base-input>
                    </div>
                    <div class="col-md-3">
                        <base-button outline type="success" v-if="!updateMode" @click="createExamChapter">Ekle
                        </base-button>
                        <base-button outline type="warning" v-if="updateMode" @click="updateExamChapter">Güncelle
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
                    <p>Sınav Bölüm Listesi</p>
                </slot>
                <div class="row">
                    <div class="col">
                        <v-table
                                :detailVisible="false"
                                :edit-visible="true"
                                :del-visible="true"
                                @edClick="editClick($event)"
                                @delClick="deleteClick($event)"
                                :columns="$store.getters.getChapterHeader"
                                :rows="$store.getters.getChapter"
                                :table-title="$store.getters.getChapterHeader"
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
        name: 'Lessons',
        created() {
            this.loading = true

            this.$store.dispatch("fetchChapter").then((res) => {
                this.loading = false
            }).catch((err) => {
                appPlugin.showalert("Uyarı", "Sınav Bölümü Kayıtları Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")
                this.loading = false

            })
        },
        data() {
            return {
                chapterData: {
                    id: "",
                    name: ""
                },
                updateMode: false,
                loading: false
            }
        },
        methods: {
            resetData() {
                this.chapterData.name = ""
                this.chapterData.id = ""
            },
            updateExamChapter() {
                if (this.chapterData.name.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Sınav Bölüm Adı Giriniz", "info", "Tamam")
                } else {
                    this.loading = true
                    this.$store.dispatch("updateChapters", {
                        name: this.chapterData.name,
                        id: this.chapterData.id
                    }).then((res) => {
                        if (res.status === 200) {
                            this.loading = false
                            this.updateMode = false
                            this.resetData()
                            appPlugin.showalert("Bilgilendirme", "Sınav Bölümü Güncelleme İşlemi Başarılı", "success", "Tamam")
                        } else if (res.status == 204) {
                            this.loading = false
                            appPlugin.showalert("Uyarı", "Sınav Bölümü Daha Önce Eklendi", "warning", "Tamam")
                        }
                    }).catch((err) => {
                        this.loading = false
                        appPlugin.showalert("Uyarı", "Sınav Bölümü Güncellenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")
                    })
                }
            },
            createExamChapter() {
                if (this.chapterData.name.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Sınav Bölüm Adı Giriniz", "info", "Tamam")
                } else {
                    this.loading = true
                    this.$store.dispatch("createChapter", {name: this.chapterData.name}).then((res) => {
                        if (res.status === 200) {
                            this.loading = false
                            this.resetData()
                            appPlugin.showalert("Bilgilendirme", "Sınav Bölümü Ekleme İşlemi Başarılı", "success", "Tamam")
                        } else if (res.status == 204) {
                            this.loading = false
                            appPlugin.showalert("Uyarı", "Sınav Bölümü Daha Önce Eklendi", "warning", "Tamam")
                        }
                    }).catch((err) => {
                        this.loading = false
                        appPlugin.showalert("Uyarı", "Sınav Bölümü Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")

                    })
                }
            },
            onCancelUpdate() {
                this.updateMode = false;
                this.resetData()
            },
            editClick(row) {
                this.updateMode = true;
                this.chapterData.name = row.item.name
                this.chapterData.id = row.item.id
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
                            .dispatch('deleteChapter', {
                                deleted: row.item,
                                index: row.i
                            })
                            .then(res => {
                                if (res.status) {
                                    if (res.status === 200) {
                                        appPlugin.showalert("Bilgilendirme", "Sınav Bölümü Silme İşlemi Başarılı", "success", "Tamam")

                                    }
                                } else {
                                    appPlugin.showalert("Uyarı", "Sınav Bölümü Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")

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
