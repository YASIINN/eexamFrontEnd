<template>
    <div>
        <Loading v-if="loading"/>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <card>
                <slot name="header">
                    <p>Ders Ekle</p>
                </slot>
                <div class="row">
                    <div class="col-md-9">
                        <base-input placeholder="Ders Adı Giriniz" v-model="lessonsData.name"></base-input>
                    </div>
                    <div class="col-md-3">
                        <base-button outline type="success" v-if="!updateMode" @click="createLesson">Ekle</base-button>
                        <base-button outline type="warning" v-if="updateMode" @click="updateLesson">Güncelle
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
                    <p>Ders Listesi</p>
                </slot>
                <div class="row">
                    <div class="col">
                        <v-table
                                :detailVisible="false"
                                :edit-visible="true"
                                :del-visible="true"
                                @edClick="editClick($event)"
                                @delClick="deleteClick($event)"
                                :columns="$store.getters.getLessonHeader"
                                :rows="$store.getters.getLessons"
                                :table-title="$store.getters.getLessonHeader"
                        ></v-table>
                    </div>
                </div>
            </card>
        </div>


    </div>
</template>
<script>
    import ProjectsTable from './Tables/ProjectsTable'
    import VTable from "@/components/Table"
    import Loading from "@/components/Loading";
    import Swal from "sweetalert2"
    import appPlugin from "../plugins/appPlugin";

    export default {
        name: 'Lessons',
        created() {
            this.loading = true

            this.$store.dispatch("fetchLesson").then((res) => {
                this.loading = false
            }).catch((err) => {
                appPlugin.showalert("Uyarı", "Ders Kayıtları Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")
                this.loading = false

            })
        },
        data() {
            return {
                lessonsData: {
                    id: "",
                    name: ""
                },
                updateMode: false,
                loading: false
            }
        },
        methods: {
            resetData() {
                this.lessonsData.name = ""
                this.lessonsData.id = ""
            },
            updateLesson() {
                if (this.lessonsData.name.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Ders Adı Giriniz", "info", "Tamam")
                } else {
                    this.loading = true
                    this.$store.dispatch("updateLesson", {
                        name: this.lessonsData.name,
                        id: this.lessonsData.id
                    }).then((res) => {
                        if (res.status === 200) {
                            this.loading = false
                            this.updateMode = false
                            this.resetData()
                            appPlugin.showalert("Bilgilendirme", "Ders Güncelleme İşlemi Başarılı", "success", "Tamam")
                        } else if (res.status == 204) {
                            this.loading = false
                            appPlugin.showalert("Uyarı", "Ders Daha Önce Eklendi", "warning", "Tamam")
                        }
                    }).catch((err) => {
                        this.loading = false
                        appPlugin.showalert("Uyarı", "Ders Güncellenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")
                    })
                }
            },
            createLesson() {
                if (this.lessonsData.name.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Ders Adı Giriniz", "info", "Tamam")
                } else {
                    this.loading = true
                    this.$store.dispatch("createLessons", {name: this.lessonsData.name}).then((res) => {
                        if (res.status === 200) {
                            this.loading = false
                            this.resetData()
                            appPlugin.showalert("Bilgilendirme", "Ders Ekleme İşlemi Başarılı", "success", "Tamam")
                        } else if (res.status == 204) {
                            this.loading = false
                            appPlugin.showalert("Uyarı", "Ders Daha Önce Eklendi", "warning", "Tamam")
                        }
                    }).catch((err) => {
                        this.loading = false
                        appPlugin.showalert("Uyarı", "Ders Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")

                    })
                }
            },
            onCancelUpdate() {
                this.updateMode = false;
                this.resetData()
            },
            editClick(row) {
                this.updateMode = true;
                this.lessonsData.name = row.item.name
                this.lessonsData.id = row.item.id
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
                            .dispatch('deleteLesson', {
                                deleted: row.item,
                                index: row.i
                            })
                            .then(res => {
                                if (res.status) {
                                    if (res.status === 200) {
                                        appPlugin.showalert("Bilgilendirme", "Ders Silme İşlemi Başarılı", "success", "Tamam")

                                    }
                                } else {
                                    appPlugin.showalert("Uyarı", "Ders Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")

                                }
                                this.loading = false
                            })
                    }
                })
            }
        },
        components: {
            VTable,
            ProjectsTable,
            Loading
        }
    };
</script>
<style></style>
