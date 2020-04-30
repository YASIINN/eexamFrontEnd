<template>
    <div>
        <Loading v-if="loading"/>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <card>
                <slot name="header">
                    <p>Grup Ekle</p>
                </slot>
                <div class="row">
                    <div class="col-md-9">
                        <base-input placeholder="Grup Adı Giriniz" v-model="groupsData.name"></base-input>
                    </div>
                    <div class="col-md-3">
                        <base-button outline type="success" v-if="!updateMode" @click="createExamGroups">Ekle
                        </base-button>
                        <base-button outline type="warning" v-if="updateMode" @click="updateExamGroups">Güncelle
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
                    <p>Grup Listesi</p>
                </slot>
                <div class="row">
                    <div class="col">
                        <v-table
                                :detailVisible="false"
                                :edit-visible="true"
                                :del-visible="true"
                                @edClick="editClick($event)"
                                @delClick="deleteClick($event)"
                                :columns="$store.getters.getGroupsHeader"
                                :rows="$store.getters.getGroups"
                                :table-title="$store.getters.getGroupsHeader"
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
        name: 'ExamChapter',
        created() {
            this.loading = true

            this.$store.dispatch("fetchGroups").then((res) => {
                this.loading = false
            }).catch((err) => {
                appPlugin.showalert("Uyarı", "Sınav Grubu Kayıtları Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")
                this.loading = false

            })
        },
        data() {
            return {
                groupsData: {
                    id: "",
                    name: ""
                },
                updateMode: false,
                loading: false
            }
        },
        methods: {
            resetData() {
                this.groupsData.name = ""
                this.groupsData.id = ""
            },
            updateExamGroups() {
                if (this.groupsData.name.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Sınav Grup Adı Giriniz", "info", "Tamam")
                } else {
                    this.loading = true
                    this.$store.dispatch("updateGroups", {
                        name: this.groupsData.name,
                        id: this.groupsData.id
                    }).then((res) => {
                        if (res.status === 200) {
                            this.loading = false
                            this.updateMode = false
                            this.resetData()
                            appPlugin.showalert("Bilgilendirme", "Sınav Grup Güncelleme İşlemi Başarılı", "success", "Tamam")
                        } else if (res.status == 204) {
                            this.loading = false
                            appPlugin.showalert("Uyarı", "Sınav Grubu Daha Önce Eklendi", "warning", "Tamam")
                        }
                    }).catch((err) => {
                        this.loading = false
                        appPlugin.showalert("Uyarı", "Sınav Grubu Güncellenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")
                    })
                }
            },
            createExamGroups() {
                if (this.groupsData.name.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Sınav Grubu Adı Giriniz", "info", "Tamam")
                } else {
                    this.loading = true
                    this.$store.dispatch("createGroups", {name: this.groupsData.name}).then((res) => {
                        if (res.status === 200) {
                            this.loading = false
                            this.resetData()
                            appPlugin.showalert("Bilgilendirme", " Sınav Grubu Ekleme İşlemi Başarılı", "success", "Tamam")
                        } else if (res.status == 204) {
                            this.loading = false
                            appPlugin.showalert("Uyarı", " Sınav Grubu Daha Önce Eklendi", "warning", "Tamam")
                        }
                    }).catch((err) => {
                        this.loading = false
                        appPlugin.showalert("Uyarı", " Sınav Grubu Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")

                    })
                }
            },
            onCancelUpdate() {
                this.updateMode = false;
                this.resetData()
            },
            editClick(row) {
                this.updateMode = true;
                this.groupsData.name = row.item.name
                this.groupsData.id = row.item.id
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
                            .dispatch('deleteGroups', {
                                deleted: row.item,
                                index: row.i
                            })
                            .then(res => {
                                if (res.status) {
                                    if (res.status === 200) {
                                        appPlugin.showalert("Bilgilendirme", " Sınav Grubu Silme İşlemi Başarılı", "success", "Tamam")

                                    }
                                } else {
                                    appPlugin.showalert("Uyarı", " Sınav Grubu Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")

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
